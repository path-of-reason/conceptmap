use serde::Serialize;
use serde_json::{json, Value};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

pub const STORE_FILE: &str = "store.json";
pub const CURRENT_VAULT_KEY: &str = "current_vault";
pub const VAULTS_KEY: &str = "vaults";

pub fn get_current_vault_path(app: &AppHandle) -> Result<String, String> {
    let store = app.store(STORE_FILE).map_err(|e| e.to_string())?;
    store
        .get(CURRENT_VAULT_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .ok_or_else(|| "현재 선택된 Vault가 없습니다.".to_string())
}

#[derive(Serialize)]
pub struct VaultsAndCurrent {
    vaults: Vec<String>,
    current: Option<String>,
}

#[tauri::command]
pub fn add_vault(app: AppHandle, path: String) -> Result<(), String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("store open: {e}"))?;

    // 기존 vaults 배열 가져오기
    let mut arr: Vec<String> = match store.get(VAULTS_KEY) {
        Some(Value::Array(vals)) => vals
            .into_iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect(),
        _ => vec![],
    };

    let trimmed = path.trim();
    if trimmed.is_empty() {
        return Err("경로가 비어있습니다.".to_string());
    }
    // ★ 중복 방어 : 이미 있으면 추가하지 않고 그냥 OK(또는 에러로 반환)
    if arr.iter().any(|p| p == trimmed) {
        return Ok(());
        // 또는 return Err("이미 존재하는 볼트입니다.".to_string());
    }

    arr.push(trimmed.to_string());
    store.set(VAULTS_KEY, json!(arr));
    store.save().map_err(|e| format!("save error: {e}"))?;
    Ok(())
}

#[tauri::command]
pub fn remove_vault(app: AppHandle, path: String) -> Result<(), String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("store open: {e}"))?;
    let arr: Vec<String> = match store.get(VAULTS_KEY) {
        Some(Value::Array(vals)) => vals
            .into_iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect(),
        _ => vec![],
    };
    let trimmed = path.trim();
    let new_arr: Vec<String> = arr.into_iter().filter(|v| v != trimmed).collect();
    store.set(VAULTS_KEY, json!(new_arr));

    // 만약 current가 삭제된 vault라면 current도 제거(초기화)
    let current = store
        .get(CURRENT_VAULT_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()));
    if let Some(cur) = current {
        if cur == trimmed {
            store.set(CURRENT_VAULT_KEY, json!(null));
        }
    }

    store.save().map_err(|e| format!("save error: {e}"))?;
    Ok(())
}

#[tauri::command]
pub fn load_vaults(app: AppHandle) -> Result<Vec<String>, String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("store open: {e}"))?;
    let arr = match store.get(VAULTS_KEY) {
        Some(Value::Array(vals)) => vals
            .into_iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect(),
        _ => vec![],
    };
    Ok(arr)
}

#[tauri::command]
pub fn load_vaults_and_current(app: AppHandle) -> Result<VaultsAndCurrent, String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("store open: {e}"))?;
    // vaults
    let vaults = match store.get(VAULTS_KEY) {
        Some(Value::Array(vals)) => vals
            .into_iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect(),
        _ => vec![],
    };
    // current
    let current = store
        .get(CURRENT_VAULT_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()));
    Ok(VaultsAndCurrent { vaults, current })
}

#[tauri::command]
pub fn set_current_vault(app: AppHandle, path: String) -> Result<(), String> {
    let store = app
        .store(STORE_FILE)
        .map_err(|e| format!("store open: {e}"))?;
    let arr: Vec<String> = match store.get(VAULTS_KEY) {
        Some(Value::Array(vals)) => vals
            .into_iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect(),
        _ => vec![],
    };
    let trimmed = path.trim();
    // 등록된 vault 목록 내에 있을 때만 current_vault 지정
    if arr.contains(&trimmed.to_string()) {
        store.set(CURRENT_VAULT_KEY, json!(trimmed));
        store.save().map_err(|e| format!("save error: {e}"))?;
        Ok(())
    } else {
        Err("해당 vault가 목록에 없습니다.".into())
    }
}

#[tauri::command]
pub fn get_current_vault(app: AppHandle) -> Result<Option<String>, String> {
    Ok(get_current_vault_path(&app).ok())
}
