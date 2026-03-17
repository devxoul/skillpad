use std::path::{Path, PathBuf};
use tauri::{Emitter, Manager};

#[tauri::command]
fn check_commands_on_path(commands: Vec<String>) -> Vec<bool> {
    let path_dirs: Vec<PathBuf> = std::env::var("PATH")
        .unwrap_or_default()
        .split(':')
        .map(PathBuf::from)
        .collect();

    commands
        .iter()
        .map(|cmd| path_dirs.iter().any(|dir| dir.join(cmd).is_file()))
        .collect()
}

#[tauri::command]
fn check_directories_exist(paths: Vec<String>) -> Vec<bool> {
    paths.iter().map(|p| Path::new(p).is_dir()).collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_commands_on_path,
            check_directories_exist
        ])
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
