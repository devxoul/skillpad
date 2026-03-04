use serde::{Deserialize, Serialize};
use tauri::Manager;

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

    #[cfg(target_os = "windows")]
    let binary_name = "bun.exe";
    #[cfg(not(target_os = "windows"))]
    let binary_name = "bun";

    data_dir.join("bin").join(binary_name).exists()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_available_pm_finds_existing() {
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
        #[cfg(not(target_os = "windows"))]
        assert!(is_command_available("sh"));
    }

    #[test]
    fn test_is_command_available_false_for_nonexistent() {
        assert!(!is_command_available("this-command-does-not-exist-xyz-123"));
    }
}
