// mod epub_parser;
// mod sidecar;
// mod terminal;
mod app_state;
mod file_system;
mod kuzudb;
mod vault_manager;
use std::sync::{Arc, Mutex};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = Arc::new(Mutex::new(app_state::AppState::new()));

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .manage(app_state.clone())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            file_system::greet,
            file_system::read_file,
            file_system::read_file_base64,
            file_system::write_file,
            file_system::read_directory,
            file_system::read_dir_recursive,
            app_state::get_load_time,
            vault_manager::add_vault,
            vault_manager::remove_vault,
            vault_manager::set_current_vault,
            vault_manager::get_current_vault,
            vault_manager::load_vaults,
            vault_manager::load_vaults_and_current,
            kuzudb::commands::create_note,
            kuzudb::commands::get_all_notes,
            kuzudb::commands::get_note_aggregate_by_id,
            kuzudb::commands::update_note,
            kuzudb::commands::remove_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//     tauri::Builder::default()
//         .manage(terminal::PtySessionState::default())
//         .manage(sidecar::state::SidecarState::new())
//         .plugin(tauri_plugin_dialog::init()) // 볼트 탐색 폴더찾기 다이얼로그
//         .plugin(tauri_plugin_opener::init()) // url오픈
//         .plugin(tauri_plugin_shell::init()) // 사이드카 실행할려면 필요함
//         // .plugin(tauri_plugin_fs::init())
//         // .plugin(sidecar::init())
//         .invoke_handler(tauri::generate_handler![
//             file_system::greet,
//             file_system::read_file,
//             file_system::write_file,
//             file_system::read_directory,
//             file_system::read_dir_recursive,
//             epub_parser::convert_markdown_to_html,
//             sidecar::commands::call_python_greet,
//             sidecar::commands::start_sidecar_command,
//             sidecar::commands::stop_sidecar_command,
//             sidecar::commands::restart_sidecar_command,
//             sidecar::commands::is_sidecar_running_command,
//             terminal::start_pty_session,
//             terminal::stop_pty_session,
//             terminal::write_pty,
//             terminal::resize_pty
//         ])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }
