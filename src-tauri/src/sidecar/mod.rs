pub mod commands;
pub mod model;
pub mod state;

use std::sync::Arc;
use tauri::{Manager, RunEvent, Runtime};

/// 파이썬 사이드카 초기화 플러그인
pub fn init<R: Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("sidecar") // plugin 이름 작성
        .setup(|_app, _api| {
            // let app_handle = app.app_handle().clone(); // 빌려온걸 넘겨줄 수 없으니 클론해서 줌
            // tauri::async_runtime::spawn(async move {
            //     app_handle
            //         .state::<Arc<state::SidecarState>>() // lib에 등록된 매니저에서 SidecarState를 호출해온다.
            //         .start_sidecar(app_handle.clone()) // 사이드카를 시작한다.
            //         .await // 비동기니까 기다리면
            //         .map_err(|e| {
            //             // 잘못하면 오류생기는데 처리
            //             eprintln!("[ERROR] 사이드카 초기화 실패: {}", e);
            //         })
            // });
            Ok(())
        })
        .on_event(|app, event| {
            match event {
                // 종료 이벤트가 발생하면
                RunEvent::Exit => {
                    let app_handle = app.app_handle().clone();
                    tauri::async_runtime::spawn(async move {
                        let stop_result = app_handle
                            .state::<Arc<state::SidecarState>>()
                            .stop_sidecar()
                            .await;
                        println!("[INFO] App Exit: Sidecar stop result: {:?}", stop_result);
                    });
                }
                _ => {} // 다른 이벤트는 무시
            }
        })
        .build()
}
