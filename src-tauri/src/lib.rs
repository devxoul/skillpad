use std::path::{Path, PathBuf};
use tauri::{Emitter, Manager};

#[tauri::command]
fn create_symlink(target: String, link_path: String) -> Result<(), String> {
    if let Some(parent) = std::path::Path::new(&link_path).parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let path = std::path::Path::new(&link_path);
    if path.exists() || path.symlink_metadata().is_ok() {
        if path.is_dir()
            && !path
                .symlink_metadata()
                .map(|m| m.file_type().is_symlink())
                .unwrap_or(false)
        {
            std::fs::remove_dir_all(path).map_err(|e| e.to_string())?;
        } else {
            std::fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }
    #[cfg(unix)]
    std::os::unix::fs::symlink(&target, &link_path).map_err(|e| e.to_string())?;
    #[cfg(windows)]
    std::os::windows::fs::symlink_dir(&target, &link_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn is_symlink(path: String) -> bool {
    std::fs::symlink_metadata(&path)
        .map(|m| m.file_type().is_symlink())
        .unwrap_or(false)
}

#[tauri::command]
fn check_commands_on_path(commands: Vec<String>) -> Vec<bool> {
    let path_dirs: Vec<PathBuf> = std::env::var_os("PATH")
        .map(|paths| std::env::split_paths(&paths).collect())
        .unwrap_or_default();

    #[cfg(windows)]
    let path_exts: Vec<String> = std::env::var_os("PATHEXT")
        .map(|exts| {
            exts.to_string_lossy()
                .split(';')
                .map(|ext| ext.to_ascii_lowercase())
                .collect()
        })
        .unwrap_or_else(|| vec![".exe".into(), ".cmd".into(), ".bat".into(), ".com".into()]);

    commands
        .iter()
        .map(|cmd| {
            path_dirs.iter().any(|dir| {
                if dir.join(cmd).is_file() {
                    return true;
                }
                #[cfg(windows)]
                {
                    path_exts
                        .iter()
                        .any(|ext| dir.join(format!("{cmd}{ext}")).is_file())
                }
                #[cfg(not(windows))]
                false
            })
        })
        .collect()
}

#[tauri::command]
fn check_directories_exist(paths: Vec<String>) -> Vec<bool> {
    paths.iter().map(|p| Path::new(p).is_dir()).collect()
}

#[tauri::command]
fn write_debug(content: String) -> Result<(), String> {
    std::fs::write("/tmp/skillpad-ts-debug.txt", content).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_skills_dir(path: String) -> Result<Vec<String>, String> {
    let dir = Path::new(&path);
    if !dir.is_dir() {
        return Err(format!("Not a directory: {}", path));
    }
    let mut names = Vec::new();
    for entry in std::fs::read_dir(dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        if entry.path().is_dir() {
            if let Some(name) = entry.file_name().to_str() {
                names.push(name.to_string());
            }
        }
    }
    Ok(names)
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read {}: {}", path, e))
}

#[tauri::command]
fn home_dir() -> Result<String, String> {
    dirs::home_dir()
        .map(|p| p.display().to_string())
        .ok_or_else(|| "Cannot determine home directory".to_string())
}

#[derive(serde::Serialize)]
struct SkillEntry {
    name: String,
    path: String,
    agents: Vec<String>,
}

#[tauri::command]
fn list_skills(global: bool, cwd: Option<String>) -> Result<Vec<SkillEntry>, String> {
    eprintln!("[list_skills] global={} cwd={:?} -> {} skills", global, cwd, {
        let dir = if global {
            dirs::home_dir().map(|h| h.join(".agents/skills"))
        } else {
            Some(PathBuf::from(cwd.as_deref().unwrap_or(".")).join(".agents/skills"))
        };
        dir.and_then(|d| std::fs::read_dir(d).ok()).map(|r| r.count()).unwrap_or(0)
    });
    let canonical_dir = if global {
        let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
        home.join(".agents/skills")
    } else {
        let base = cwd.as_deref().unwrap_or(".");
        PathBuf::from(base).join(".agents/skills")
    };

    if !canonical_dir.is_dir() {
        return Ok(vec![]);
    }

    let agent_dirs: Vec<(&str, &str)> = vec![
        ("claude-code", ".claude/skills"),
        ("cursor", ".cursor/skills"),
        ("windsurf", ".codeium/windsurf/skills"),
        ("opencode", ".config/opencode/skills"),
        ("codex", ".codex/skills"),
        ("gemini-cli", ".gemini/skills"),
        ("github-copilot", ".copilot/skills"),
        ("cline", ".agents/skills"),
        ("roo", ".roo/skills"),
        ("augment", ".augment/skills"),
        ("amp", ".config/agents/skills"),
        ("continue", ".continue/skills"),
        ("kode", ".kode/skills"),
        ("goose", ".config/goose/skills"),
        ("trae", ".trae/skills"),
        ("kiro-cli", ".kiro/skills"),
    ];

    let home = dirs::home_dir().unwrap_or_default();

    let mut skills = Vec::new();
    for entry in std::fs::read_dir(&canonical_dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }
        let name = match entry.file_name().to_str() {
            Some(n) => n.to_string(),
            None => continue,
        };

        let mut agents = Vec::new();
        for (agent_id, agent_dir) in &agent_dirs {
            let agent_skill_path = if global {
                home.join(agent_dir).join(&name)
            } else {
                let base = cwd.as_deref().unwrap_or(".");
                PathBuf::from(base).join(agent_dir).join(&name)
            };
            if agent_skill_path.exists() {
                agents.push(agent_id.to_string());
            }
        }

        skills.push(SkillEntry {
            name,
            path: path.display().to_string(),
            agents,
        });
    }

    Ok(skills)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_commands_on_path,
            check_directories_exist,
            create_symlink,
            home_dir,
            is_symlink,
            read_skills_dir,
            read_text_file,
            list_skills,
            write_debug
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            if let Some(url) = args.into_iter().find(|arg| arg.starts_with("skillpad://")) {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_focus();
                    let _ = window.emit("deep-link-open", url);
                }
            }
        }))
        .plugin(tauri_plugin_deep_link::init())
        .on_window_event(|_window, _event| {})
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "macos")]
                {
                    use tauri::window::{Effect, EffectState, EffectsBuilder};
                    let _ = window.set_effects(
                        EffectsBuilder::new()
                            .effects([Effect::UnderWindowBackground])
                            .state(EffectState::Active)
                            .build(),
                    );
                }
                #[cfg(target_os = "windows")]
                {
                    use tauri::window::{Effect, EffectState, EffectsBuilder};
                    let _ = window.set_effects(
                        EffectsBuilder::new()
                            .effects([Effect::Mica])
                            .state(EffectState::Active)
                            .build(),
                    );
                }
                if !cfg!(debug_assertions) {
                    let _ = window.set_focus();
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
