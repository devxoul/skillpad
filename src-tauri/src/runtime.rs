use reqwest::Client;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use tauri::Emitter;
use tauri::Manager;
use tokio::io::AsyncWriteExt;
use zip::ZipArchive;

const PINNED_BUN_VERSION: &str = "1.2.10";

#[derive(Clone, Serialize)]
struct DownloadProgressPayload {
    progress: u64,
    total: u64,
}

#[derive(Clone)]
struct RuntimePaths {
    bin_dir: PathBuf,
    download_tmp_path: PathBuf,
    extract_tmp_path: PathBuf,
    final_binary_path: PathBuf,
    bunx_path: Option<PathBuf>,
}

#[derive(Serialize, Deserialize)]
pub struct RuntimeCheckResult {
    pub available: bool,
    pub found_pm: Option<String>,
    pub downloaded_bun_exists: bool,
}

#[tauri::command]
pub async fn check_runtime(app: tauri::AppHandle) -> Result<RuntimeCheckResult, String> {
    let package_managers = ["bunx", "npx", "pnpx"];
    let found_pm = find_available_pm(&package_managers);

    let downloaded_bun_exists = check_downloaded_bun_exists(&app);

    Ok(RuntimeCheckResult {
        available: found_pm.is_some(),
        found_pm,
        downloaded_bun_exists,
    })
}

fn find_available_pm(candidates: &[&str]) -> Option<String> {
    for pm in candidates {
        if is_command_available(pm) {
            return Some(pm.to_string());
        }
    }
    None
}

fn is_command_available(cmd: &str) -> bool {
    #[cfg(target_os = "windows")]
    let which_cmd = "where.exe";
    #[cfg(not(target_os = "windows"))]
    let which_cmd = "which";

    std::process::Command::new(which_cmd)
        .arg(cmd)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

fn check_downloaded_bun_exists(app: &tauri::AppHandle) -> bool {
    let Ok(data_dir) = app.path().app_local_data_dir() else {
        return false;
    };

    runtime_bin_dir_if_exists(&data_dir).is_some()
}

#[tauri::command]
pub async fn setup_runtime_path(app: tauri::AppHandle) -> Result<(), String> {
    let data_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("failed to resolve app local data dir: {e}"))?;

    append_runtime_bin_from_data_dir(&data_dir);
    Ok(())
}

pub fn append_runtime_path_if_exists(app: &tauri::AppHandle) {
    let Ok(data_dir) = app.path().app_local_data_dir() else {
        return;
    };

    append_runtime_bin_from_data_dir(&data_dir);
}

fn append_runtime_bin_from_data_dir(data_dir: &Path) {
    let Some(bin_dir) = runtime_bin_dir_if_exists(data_dir) else {
        return;
    };

    let mut paths: Vec<PathBuf> = std::env::var_os("PATH")
        .map(|value| std::env::split_paths(&value).collect())
        .unwrap_or_default();

    if paths.iter().any(|path| path == &bin_dir) {
        return;
    }

    paths.push(bin_dir);
    if let Ok(updated_path) = std::env::join_paths(paths) {
        std::env::set_var("PATH", updated_path);
    }
}

fn runtime_bin_dir_if_exists(data_dir: &Path) -> Option<PathBuf> {
    let bin_dir = data_dir.join("bin");
    let binary_path = bin_dir.join(runtime_binary_name());

    if binary_path.exists() {
        Some(bin_dir)
    } else {
        None
    }
}

fn runtime_binary_name() -> &'static str {
    #[cfg(target_os = "windows")]
    {
        "bun.exe"
    }
    #[cfg(not(target_os = "windows"))]
    {
        "bun"
    }
}

#[tauri::command]
pub async fn download_runtime(app: tauri::AppHandle, window: tauri::Window) -> Result<(), String> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    let platform = map_platform(os, arch)?;

    let data_dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("failed to resolve app local data dir: {e}"))?;
    let paths = runtime_paths(&data_dir, os);

    if let Err(err) = tokio::fs::create_dir_all(&paths.bin_dir).await {
        return Err(format!("failed to create runtime bin directory: {err}"));
    }

    let result = download_runtime_inner(&window, &paths, platform, os).await;
    if result.is_err() {
        cleanup_tmp_file(&paths.download_tmp_path);
        cleanup_tmp_file(&paths.extract_tmp_path);
    }

    result
}

async fn download_runtime_inner(
    window: &tauri::Window,
    paths: &RuntimePaths,
    platform: &str,
    os: &str,
) -> Result<(), String> {
    let client = Client::new();
    let archive_name = format!("bun-{platform}.zip");
    let download_url = bun_download_url(PINNED_BUN_VERSION, platform);
    let shasums_url = bun_shasums_url(PINNED_BUN_VERSION);

    download_file_with_progress(&client, &download_url, &paths.download_tmp_path, window).await?;

    let shasums = client
        .get(shasums_url)
        .send()
        .await
        .map_err(|e| format!("failed to download SHASUMS256.txt: {e}"))?
        .error_for_status()
        .map_err(|e| format!("SHASUMS256.txt response error: {e}"))?
        .text()
        .await
        .map_err(|e| format!("failed to read SHASUMS256.txt response body: {e}"))?;

    let expected_sha = parse_expected_sha256(&shasums, &archive_name)?;

    let paths_clone = paths.clone();
    let platform = platform.to_string();
    let os = os.to_string();
    tokio::task::spawn_blocking(move || {
        let actual_sha = sha256_file(&paths_clone.download_tmp_path)?;
        if !actual_sha.eq_ignore_ascii_case(&expected_sha) {
            return Err(format!(
                "sha256 mismatch for {archive_name}: expected {expected_sha}, got {actual_sha}"
            ));
        }

        extract_bun_binary(
            &paths_clone.download_tmp_path,
            &paths_clone.extract_tmp_path,
            &archive_binary_entry_path(&platform, &os),
        )?;

        if paths_clone.final_binary_path.exists() {
            std::fs::remove_file(&paths_clone.final_binary_path)
                .map_err(|e| format!("failed to replace existing runtime binary: {e}"))?;
        }

        std::fs::rename(&paths_clone.extract_tmp_path, &paths_clone.final_binary_path)
            .map_err(|e| format!("failed to install runtime binary: {e}"))?;

        #[cfg(unix)]
        set_executable_permissions(&paths_clone.final_binary_path)?;

        #[cfg(target_os = "macos")]
        {
            run_codesign(&paths_clone.final_binary_path)?;
            remove_quarantine_attribute(&paths_clone.final_binary_path);
            create_or_replace_bunx_symlink(paths_clone.bunx_path.as_ref(), &paths_clone.final_binary_path)?;
        }

        #[cfg(target_os = "windows")]
        if let Some(bunx_path) = &paths_clone.bunx_path {
            extract_bun_binary(
                &paths_clone.download_tmp_path,
                bunx_path,
                &archive_binary_entry_path_bunx(&platform),
            )?;
        }

        cleanup_tmp_file(&paths_clone.download_tmp_path);

        Ok(())
    })
    .await
    .map_err(|e| format!("blocking task failed: {e}"))?
}

async fn download_file_with_progress(
    client: &Client,
    url: &str,
    output_path: &Path,
    window: &tauri::Window,
) -> Result<(), String> {
    let mut response = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("failed to download bun runtime archive: {e}"))?
        .error_for_status()
        .map_err(|e| format!("bun runtime archive response error: {e}"))?;

    let total = response.content_length().unwrap_or(0);
    let mut progress = 0_u64;
    let mut output = tokio::fs::File::create(output_path)
        .await
        .map_err(|e| format!("failed to create temporary archive file: {e}"))?;

    while let Some(chunk) = response
        .chunk()
        .await
        .map_err(|e| format!("failed while streaming archive: {e}"))?
    {
        output
            .write_all(&chunk)
            .await
            .map_err(|e| format!("failed while writing archive stream: {e}"))?;
        progress += chunk.len() as u64;
        window
            .emit("runtime-download-progress", DownloadProgressPayload { progress, total })
            .map_err(|e| format!("failed to emit runtime download progress: {e}"))?;
    }

    output
        .flush()
        .await
        .map_err(|e| format!("failed to flush runtime archive to disk: {e}"))?;

    Ok(())
}

fn runtime_paths(data_dir: &Path, os: &str) -> RuntimePaths {
    let bin_dir = data_dir.join("bin");
    let binary_name = if os == "windows" { "bun.exe" } else { "bun" };
    let bunx_path = if os == "macos" {
        Some(bin_dir.join("bunx"))
    } else if os == "windows" {
        Some(bin_dir.join("bunx.exe"))
    } else {
        None
    };

    RuntimePaths {
        bin_dir: bin_dir.clone(),
        download_tmp_path: bin_dir.join(".bun-download.tmp"),
        extract_tmp_path: bin_dir.join(".bun-extract.tmp"),
        final_binary_path: bin_dir.join(binary_name),
        bunx_path,
    }
}

fn map_platform(os: &str, arch: &str) -> Result<&'static str, String> {
    match (os, arch) {
        ("macos", "aarch64") => Ok("darwin-aarch64"),
        ("macos", "x86_64") => Ok("darwin-x64"),
        ("windows", "x86_64") => Ok("windows-x64"),
        _ => Err(format!("unsupported platform: os={os}, arch={arch}")),
    }
}

fn bun_download_url(version: &str, platform: &str) -> String {
    format!(
        "https://github.com/oven-sh/bun/releases/download/bun-v{version}/bun-{platform}.zip"
    )
}

fn bun_shasums_url(version: &str) -> String {
    format!("https://github.com/oven-sh/bun/releases/download/bun-v{version}/SHASUMS256.txt")
}

fn archive_binary_entry_path(platform: &str, os: &str) -> String {
    if os == "windows" {
        format!("bun-{platform}/bun.exe")
    } else {
        format!("bun-{platform}/bun")
    }
}

#[cfg(target_os = "windows")]
fn archive_binary_entry_path_bunx(platform: &str) -> String {
    format!("bun-{platform}/bunx.exe")
}

fn parse_expected_sha256(shasums: &str, archive_name: &str) -> Result<String, String> {
    for line in shasums.lines() {
        let mut parts = line.split_whitespace();
        let Some(hash) = parts.next() else {
            continue;
        };
        let Some(name) = parts.next() else {
            continue;
        };
        let normalized = name.trim_start_matches('*');
        if normalized == archive_name {
            return Ok(hash.to_string());
        }
    }

    Err(format!("missing SHA256 entry for {archive_name}"))
}

fn sha256_file(file_path: &Path) -> Result<String, String> {
    let mut file = File::open(file_path).map_err(|e| format!("failed to open file for sha256: {e}"))?;
    let mut hasher = Sha256::new();
    let mut buffer = [0_u8; 8192];

    loop {
        let read = file
            .read(&mut buffer)
            .map_err(|e| format!("failed to read file for sha256: {e}"))?;
        if read == 0 {
            break;
        }
        hasher.update(&buffer[..read]);
    }

    Ok(format!("{:x}", hasher.finalize()))
}

fn extract_bun_binary(archive_path: &Path, output_path: &Path, entry_path: &str) -> Result<(), String> {
    let archive_file = File::open(archive_path).map_err(|e| format!("failed to open archive file: {e}"))?;
    let mut archive = ZipArchive::new(archive_file).map_err(|e| format!("failed to read zip archive: {e}"))?;
    let mut entry = archive
        .by_name(entry_path)
        .map_err(|e| format!("missing runtime binary in zip archive: {e}"))?;

    let mut output = File::create(output_path)
        .map_err(|e| format!("failed to create temporary runtime binary: {e}"))?;
    std::io::copy(&mut entry, &mut output)
        .map_err(|e| format!("failed to extract runtime binary from zip archive: {e}"))?;
    output
        .flush()
        .map_err(|e| format!("failed to flush extracted runtime binary: {e}"))?;

    Ok(())
}

#[cfg(unix)]
fn set_executable_permissions(binary_path: &Path) -> Result<(), String> {
    use std::os::unix::fs::PermissionsExt;

    let mut perms = std::fs::metadata(binary_path)
        .map_err(|e| format!("failed to read runtime binary metadata: {e}"))?
        .permissions();
    perms.set_mode(0o755);
    std::fs::set_permissions(binary_path, perms)
        .map_err(|e| format!("failed to set executable permissions on runtime binary: {e}"))
}

#[cfg(target_os = "macos")]
fn run_codesign(binary_path: &Path) -> Result<(), String> {
    let status = std::process::Command::new("codesign")
        .arg("--force")
        .arg("--sign")
        .arg("-")
        .arg(binary_path)
        .status()
        .map_err(|e| format!("failed to execute codesign: {e}"))?;

    if !status.success() {
        return Err(format!(
            "codesign failed for runtime binary with exit status: {status}"
        ));
    }

    Ok(())
}

#[cfg(target_os = "macos")]
fn remove_quarantine_attribute(binary_path: &Path) {
    let _ = std::process::Command::new("xattr")
        .arg("-d")
        .arg("com.apple.quarantine")
        .arg(binary_path)
        .status();
}

#[cfg(target_os = "macos")]
fn create_or_replace_bunx_symlink(
    bunx_path: Option<&PathBuf>,
    final_binary_path: &Path,
) -> Result<(), String> {
    use std::os::unix::fs::symlink;

    let Some(bunx_path) = bunx_path else {
        return Ok(());
    };

    if bunx_path.exists() || bunx_path.is_symlink() {
        std::fs::remove_file(bunx_path)
            .map_err(|e| format!("failed to replace existing bunx symlink: {e}"))?;
    }

    let target = final_binary_path
        .file_name()
        .ok_or_else(|| "failed to resolve runtime binary filename for bunx symlink".to_string())?;
    symlink(target, bunx_path).map_err(|e| format!("failed to create bunx symlink: {e}"))
}

fn cleanup_tmp_file(path: &Path) {
    if path.exists() {
        let _ = std::fs::remove_file(path);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::{self, File};
    use std::path::{Path, PathBuf};
    use std::sync::{Mutex, MutexGuard, OnceLock};
    use std::time::{SystemTime, UNIX_EPOCH};

    struct PathGuard {
        original: Option<std::ffi::OsString>,
    }

    impl PathGuard {
        fn capture() -> Self {
            Self {
                original: std::env::var_os("PATH"),
            }
        }
    }

    impl Drop for PathGuard {
        fn drop(&mut self) {
            if let Some(path) = &self.original {
                std::env::set_var("PATH", path);
            } else {
                std::env::remove_var("PATH");
            }
        }
    }

    fn runtime_binary_name_for_test() -> &'static str {
        #[cfg(target_os = "windows")]
        {
            "bun.exe"
        }
        #[cfg(not(target_os = "windows"))]
        {
            "bun"
        }
    }

    fn unique_temp_dir(name: &str) -> PathBuf {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system time should be after epoch")
            .as_nanos();
        let dir = std::env::temp_dir().join(format!("skillpad-runtime-{name}-{timestamp}"));
        fs::create_dir_all(&dir).expect("temp directory should be created");
        dir
    }

    fn create_downloaded_bun(data_dir: &Path) -> PathBuf {
        let bin_dir = data_dir.join("bin");
        fs::create_dir_all(&bin_dir).expect("bin directory should be created");
        let binary_path = bin_dir.join(runtime_binary_name_for_test());
        File::create(&binary_path).expect("bun binary file should be created");
        bin_dir
    }

    fn env_lock() -> MutexGuard<'static, ()> {
        static ENV_LOCK: OnceLock<Mutex<()>> = OnceLock::new();
        ENV_LOCK
            .get_or_init(|| Mutex::new(()))
            .lock()
            .expect("environment mutex should not be poisoned")
    }

    #[test]
    fn test_find_available_pm_finds_existing() {
        let _lock = env_lock();

        #[cfg(target_os = "windows")]
        let test_cmd = "where.exe";
        #[cfg(not(target_os = "windows"))]
        let test_cmd = "sh";

        let result = find_available_pm(&[test_cmd]);
        assert!(result.is_some());
        assert_eq!(result.unwrap(), test_cmd);
    }

    #[test]
    fn test_find_available_pm_returns_none_for_nonexistent() {
        let result = find_available_pm(&["this-command-does-not-exist-xyz-123"]);
        assert!(result.is_none());
    }

    #[test]
    fn test_is_command_available_true_for_sh() {
        let _lock = env_lock();

        #[cfg(not(target_os = "windows"))]
        assert!(is_command_available("sh"));
    }

    #[test]
    fn test_is_command_available_false_for_nonexistent() {
        assert!(!is_command_available("this-command-does-not-exist-xyz-123"));
    }

    #[test]
    fn test_map_platform_darwin_aarch64() {
        assert_eq!(map_platform("macos", "aarch64").unwrap(), "darwin-aarch64");
    }

    #[test]
    fn test_map_platform_darwin_x64() {
        assert_eq!(map_platform("macos", "x86_64").unwrap(), "darwin-x64");
    }

    #[test]
    fn test_map_platform_windows_x64() {
        assert_eq!(map_platform("windows", "x86_64").unwrap(), "windows-x64");
    }

    #[test]
    fn test_map_platform_rejects_linux() {
        assert!(map_platform("linux", "x86_64").is_err());
    }

    #[test]
    fn test_bun_download_url() {
        let url = bun_download_url(PINNED_BUN_VERSION, "darwin-aarch64");
        assert_eq!(
            url,
            "https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/bun-darwin-aarch64.zip"
        );
    }

    #[test]
    fn test_bun_shasums_url() {
        let url = bun_shasums_url(PINNED_BUN_VERSION);
        assert_eq!(
            url,
            "https://github.com/oven-sh/bun/releases/download/bun-v1.2.10/SHASUMS256.txt"
        );
    }

    #[test]
    fn test_binary_entry_path_macos() {
        let path = archive_binary_entry_path("darwin-aarch64", "macos");
        assert_eq!(path, "bun-darwin-aarch64/bun");
    }

    #[test]
    fn test_binary_entry_path_windows() {
        let path = archive_binary_entry_path("windows-x64", "windows");
        assert_eq!(path, "bun-windows-x64/bun.exe");
    }

    #[test]
    fn test_append_runtime_bin_from_data_dir_appends_path_when_binary_exists() {
        let _lock = env_lock();
        let _path_guard = PathGuard::capture();
        let temp_data_dir = unique_temp_dir("append");
        let bin_dir = create_downloaded_bun(&temp_data_dir);

        let original_path = std::env::join_paths([
            temp_data_dir.join("first"),
            temp_data_dir.join("second"),
        ])
        .expect("original path should be joined");
        std::env::set_var("PATH", &original_path);

        append_runtime_bin_from_data_dir(&temp_data_dir);

        let updated_path = std::env::var_os("PATH").expect("updated path should exist");
        let updated_parts: Vec<PathBuf> = std::env::split_paths(&updated_path).collect();

        assert!(updated_parts.contains(&bin_dir));
        assert_eq!(updated_parts.last(), Some(&bin_dir));
    }

    #[test]
    fn test_append_runtime_bin_from_data_dir_is_noop_when_binary_missing() {
        let _lock = env_lock();
        let _path_guard = PathGuard::capture();
        let temp_data_dir = unique_temp_dir("noop");

        let original_path = std::env::join_paths([
            temp_data_dir.join("first"),
            temp_data_dir.join("second"),
        ])
        .expect("original path should be joined");
        std::env::set_var("PATH", &original_path);

        append_runtime_bin_from_data_dir(&temp_data_dir);

        let current_path = std::env::var_os("PATH").expect("path should still exist");
        assert_eq!(current_path, original_path);
    }

    #[test]
    fn test_append_runtime_bin_from_data_dir_does_not_duplicate_existing_entry() {
        let _lock = env_lock();
        let _path_guard = PathGuard::capture();
        let temp_data_dir = unique_temp_dir("dedupe");
        let bin_dir = create_downloaded_bun(&temp_data_dir);

        let original_path = std::env::join_paths([
            temp_data_dir.join("first"),
            bin_dir.clone(),
            temp_data_dir.join("second"),
        ])
        .expect("original path should be joined");
        std::env::set_var("PATH", &original_path);

        append_runtime_bin_from_data_dir(&temp_data_dir);

        let updated_path = std::env::var_os("PATH").expect("updated path should exist");
        let occurrences = std::env::split_paths(&updated_path)
            .filter(|path| path == &bin_dir)
            .count();
        assert_eq!(occurrences, 1);
    }
}
