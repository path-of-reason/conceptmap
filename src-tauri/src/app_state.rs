use crate::kuzudb::{domain::schema, repository::KuzuDB};
use crate::vault_manager;
use std::{
    fs,
    path::Path,
    sync::{Arc, Mutex},
    time::Instant,
};
use tauri::Manager;
use tauri_plugin_store::StoreExt;

/// 앱의 공유 상태를 정의하는 구조체
pub struct AppState {
    pub start_time: Instant,
    pub kuzudb: Option<KuzuDB>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            start_time: Instant::now(),
            kuzudb: None,
        }
    }

    pub fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
        let handle = app.handle();
        let app_state = handle.state::<Arc<Mutex<AppState>>>();
        let store = handle.store(vault_manager::STORE_FILE)?;

        // store에서 마지막 Vault 경로를 읽어옵니다.
        if let Some(vault_path) = store
            .get(vault_manager::CURRENT_VAULT_KEY)
            .and_then(|v| v.as_str().map(|s| s.to_string()))
        {
            println!(
                "Found last used vault, attempting to initialize DB: {}",
                vault_path
            );

            let db_path = Path::new(&vault_path).join(".config").join("kuzu.db");
            if let Some(parent) = db_path.parent() {
                fs::create_dir_all(parent)?;
            }

            if let Some(db_path_str) = db_path.to_str() {
                match KuzuDB::new(db_path_str) {
                    Ok(db) => {
                        if let Err(e) = schema::initialize(&db) {
                            eprintln!("Failed to initialize schema on startup: {}", e);
                        } else {
                            // 성공적으로 초기화되면 AppState에 주입합니다.
                            let mut state = app_state.lock().unwrap();
                            state.kuzudb = Some(db);
                            println!("DB instance successfully created and set in AppState.");
                        }
                    }
                    Err(e) => {
                        eprintln!("Failed to create KuzuDB instance on startup: {}", e);
                    }
                }
            }
        }

        Ok(())
    }
}

/// 프론트엔드에서 호출하여 앱 로딩 시간을 계산하는 명령어
#[tauri::command]
pub fn get_load_time(app_handle: tauri::AppHandle) -> u128 {
    let app_state_arc = app_handle.state::<Arc<Mutex<AppState>>>();
    let app_state = app_state_arc.lock().unwrap();

    let elapsed = app_state.start_time.elapsed();
    let duration_ms = elapsed.as_millis();

    println!("Total load time (Rust perspective): {}ms", duration_ms);
    duration_ms
}
