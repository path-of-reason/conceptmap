use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

const STORE_FILE: &str = "store.json";
const VAULT_PATH_KEY: &str = "vault_path";

#[derive(Debug, Serialize, Deserialize)]
pub struct VaultPathPayload {
    pub path: String,
}

#[tauri::command]
pub fn save_vault_path(app: AppHandle, payload: VaultPathPayload) -> Result<(), String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("failed to open store: {e}"))?;

    let path = payload.path.trim();
    if path.is_empty() {
        return Err("vault_path is empty".into());
    }

    store.set(VAULT_PATH_KEY, json!(path));

    store
        .save()
        .map_err(|e| format!("failed to save store: {e}"))?;

    Ok(())
}

#[tauri::command]
pub fn load_vault_path(app: AppHandle) -> Result<Option<String>, String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("failed to open store: {e}"))?;

    let maybe_val = store.get(VAULT_PATH_KEY);

    if let Some(val) = maybe_val {
        if let Some(s) = val.as_str() {
            Ok(Some(s.to_string()))
        } else {
            Ok(Some(val.to_string()))
        }
    } else {
        Ok(None)
    }
}
