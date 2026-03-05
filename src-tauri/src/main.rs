// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fix-path-env only re-sets the current PATH on Windows (no-op when the inherited
// PATH is already stale). Read authoritative values from the Windows Registry so
// GUI-launched apps can find npx/bunx/pnpx.
#[cfg(windows)]
fn fix_windows_path() {
    use std::collections::HashSet;
    use winreg::enums::*;
    use winreg::RegKey;

    fn expand_env(s: &str) -> String {
        let mut result = String::with_capacity(s.len());
        let mut chars = s.chars().peekable();
        while let Some(ch) = chars.next() {
            if ch == '%' {
                let var_name: String = chars.by_ref().take_while(|&c| c != '%').collect();
                if var_name.is_empty() {
                    result.push('%');
                } else if let Ok(val) = std::env::var(&var_name) {
                    result.push_str(&val);
                } else {
                    result.push('%');
                    result.push_str(&var_name);
                    result.push('%');
                }
            } else {
                result.push(ch);
            }
        }
        result
    }

    fn read_path_from_key(key: &RegKey) -> Vec<String> {
        key.get_value::<String, _>("Path")
            .map(|path| {
                expand_env(&path)
                    .split(';')
                    .filter(|s| !s.is_empty())
                    .map(String::from)
                    .collect()
            })
            .unwrap_or_default()
    }

    let mut seen = HashSet::new();
    let mut paths = Vec::new();

    if let Ok(key) = RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey_with_flags(
        r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment",
        KEY_READ,
    ) {
        for p in read_path_from_key(&key) {
            if seen.insert(p.to_lowercase()) {
                paths.push(p);
            }
        }
    }

    if let Ok(key) =
        RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags("Environment", KEY_READ)
    {
        for p in read_path_from_key(&key) {
            if seen.insert(p.to_lowercase()) {
                paths.push(p);
            }
        }
    }

    if let Ok(current) = std::env::var("PATH") {
        for p in current.split(';').filter(|s| !s.is_empty()) {
            if seen.insert(p.to_lowercase()) {
                paths.push(p.to_string());
            }
        }
    }

    if !paths.is_empty() {
        std::env::set_var("PATH", paths.join(";"));
    }
}

fn main() {
    #[cfg(windows)]
    fix_windows_path();

    let _ = fix_path_env::fix();
    skillpad_lib::run();
}
