use crate::app_state::AppState;
use crate::kuzudb::{
    domain::models::{NoteAggregate, NoteCreateType, NoteUpdateType},
    service::{IntegrityReport, NoteService},
};
use std::sync::{Arc, Mutex};
use tauri::State;

#[tauri::command]
pub fn create_note(
    app_state: State<Arc<Mutex<crate::app_state::AppState>>>,
    note: NoteCreateType,
) -> Result<String, String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("현재 선택된 Vault가 없습니다. DB 인스턴스가 초기화되지 않았습니다.")?;
    let note_service = NoteService::new(kuzudb);
    note_service
        .create_new_note(note)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_notes(
    app_state: State<Arc<Mutex<crate::app_state::AppState>>>,
) -> Result<Vec<NoteAggregate>, String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("현재 선택된 Vault가 없습니다. DB 인스턴스가 초기화되지 않았습니다.")?;

    let note_service = NoteService::new(kuzudb);
    note_service.get_all_notes().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_note_aggregate_by_id(
    app_state: State<Arc<Mutex<crate::app_state::AppState>>>,
    id: String,
) -> Result<NoteAggregate, String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("현재 선택된 Vault가 없습니다. DB 인스턴스가 초기화되지 않았습니다.")?;

    let note_service = NoteService::new(kuzudb);
    note_service
        .get_note_aggregate_by_id(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_note(
    app_state: State<Arc<Mutex<crate::app_state::AppState>>>,
    id: String,
    payload: NoteUpdateType,
) -> Result<(), String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("현재 선택된 Vault가 없습니다. DB 인스턴스가 초기화되지 않았습니다.")?;

    let note_service = NoteService::new(kuzudb);
    note_service
        .update_note(&id, payload)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_note(
    app_state: State<Arc<Mutex<crate::app_state::AppState>>>,
    id: String,
) -> Result<(), String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("현재 선택된 Vault가 없습니다. DB 인스턴스가 초기화되지 않았습니다.")?;

    let note_service = NoteService::new(kuzudb);
    note_service.remove_note(&id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn run_integrity_checks(
    app_state: State<Arc<Mutex<AppState>>>,
) -> Result<IntegrityReport, String> {
    let state = app_state.lock().unwrap();
    let kuzudb = state
        .kuzudb
        .as_ref()
        .ok_or("No vault is currently active.")?;

    let note_service = NoteService::new(kuzudb);
    note_service
        .run_integrity_checks()
        .map_err(|e| e.to_string())
}
