use std::sync::{Arc, Mutex};
use std::time::Instant;
use tauri::Manager;

/// 앱의 공유 상태를 정의하는 구조체
pub struct AppState {
    pub start_time: Instant,
}

impl AppState {
    /// AppState의 새 인스턴스를 생성하는 생성자
    pub fn new() -> Self {
        AppState {
            start_time: Instant::now(),
        }
    }
}

/// 프론트엔드에서 호출하여 앱 로딩 시간을 계산하는 명령어
#[tauri::command]
pub fn get_load_time(app_handle: tauri::AppHandle) -> u128 {
    // Tauri 앱 핸들을 통해 공유된 상태에 접근
    let app_state_arc = app_handle.state::<Arc<Mutex<AppState>>>();
    let app_state = app_state_arc.lock().unwrap();

    // 현재 시간과 기록된 시작 시간의 차이 계산 (밀리초 단위)
    let elapsed = app_state.start_time.elapsed();
    let duration_ms = elapsed.as_millis();

    println!("Total load time (Rust perspective): {}ms", duration_ms);
    duration_ms
}
