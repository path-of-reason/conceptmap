use crate::kuzudb::domain::schema;
use crate::kuzudb::{
    domain::models::{NoteAggregate, NoteCreateType, NoteUpdateType},
    repository::KuzuDB,
    service::NoteService,
};
use crate::vault_manager;
use std::{fs, path::Path};
use tauri::AppHandle;

fn initialize_vault_db(app: &AppHandle) -> Result<KuzuDB, String> {
    let vault_path = vault_manager::get_current_vault_path(app)?;
    let db_path = Path::new(&vault_path).join(".config").join("kuzu.db");
    if let Some(parent) = db_path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }
    let kuzudb = KuzuDB::new(db_path.to_str().unwrap()).map_err(|e| e.to_string())?;
    schema::initialize(&kuzudb).map_err(|e| e.to_string())?;
    Ok(kuzudb)
}

#[tauri::command]
pub fn create_note(app: AppHandle, note: NoteCreateType) -> Result<String, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .create_new_note(note)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_notes(app: AppHandle) -> Result<Vec<NoteAggregate>, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service.get_all_notes().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_note_aggregate_by_id(app: AppHandle, id: String) -> Result<NoteAggregate, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .get_note_aggregate_by_id(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_note(app: AppHandle, id: String, payload: NoteUpdateType) -> Result<(), String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .update_note(&id, payload)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_note(app: AppHandle, id: String) -> Result<(), String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service.remove_note(&id).map_err(|e| e.to_string())
}
