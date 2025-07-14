use crate::sidecar::{model::PythonResponse, state::SidecarState};
use std::sync::Arc;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn call_python_greet(
    name: String,
    app_handle: tauri::AppHandle,
) -> Result<PythonResponse, String> {
    let sidecar_state = app_handle.state::<Arc<SidecarState>>();
    let command_payload = serde_json::json!({
        "command": "greet",
        "name": name,
    })
    .to_string();
    let python_response = sidecar_state.send_command_to_python(command_payload).await;
    if python_response.status == "error" {
        Err(python_response
            .message
            .unwrap_or_else(|| "알 수 없는 사이드카 오류가 발생했습니다.".to_string()))
    } else {
        Ok(python_response)
    }
}

/// 사이드카 시작(1초정도 딜레이 있음)
#[tauri::command]
pub async fn start_sidecar_command(app_handle: AppHandle) -> Result<PythonResponse, String> {
    let sidecar_state = app_handle.state::<Arc<SidecarState>>();
    match sidecar_state.start_sidecar(app_handle.clone()).await {
        Ok(_) => Ok(PythonResponse {
            status: "success".to_string(),
            result: Some("사이드카가 실행되었습니다.".to_string()),
            message: None,
        }),
        Err(e) => Ok(PythonResponse {
            status: "error".to_string(),
            result: None,
            message: Some(format!("사이드카 실행에 실패했습니다: {}", e)),
        }),
    }
}

#[tauri::command]
pub async fn stop_sidecar_command(app_handle: AppHandle) -> Result<PythonResponse, String> {
    let sidecar_state = app_handle.state::<Arc<SidecarState>>();
    let response = sidecar_state.stop_sidecar().await;
    Ok(response)
}

#[tauri::command]
pub async fn restart_sidecar_command(app_handle: AppHandle) -> Result<PythonResponse, String> {
    let sidecar_state = app_handle.state::<Arc<SidecarState>>();
    let stop_response = sidecar_state.stop_sidecar().await; // stop_sidecar 호출
    if stop_response.status == "error" {
        eprintln!(
            "[ERROR] Failed to gracefully stop sidecar for restart: {:?}",
            stop_response.message
        );
    } else {
        println!("[INFO] Sidecar gracefully stopped for restart or was not running.");
    }
    tokio::time::sleep(std::time::Duration::from_millis(300)).await;
    match sidecar_state.start_sidecar(app_handle.clone()).await {
        Ok(_) => Ok(PythonResponse {
            status: "success".to_string(),
            result: Some("사이드카가 재시작되었습니다.".to_string()),
            message: None,
        }),
        Err(e) => Ok(PythonResponse {
            status: "error".to_string(),
            result: None,
            message: Some(format!("사이드카 재시작에 실패했습니다: {}", e)),
        }),
    }
}

#[tauri::command]
pub async fn is_sidecar_running_command(app_handle: AppHandle) -> Result<PythonResponse, String> {
    let sidecar_state = app_handle.state::<Arc<SidecarState>>();
    let is_running = sidecar_state.child.lock().await.is_some();
    Ok(PythonResponse {
        status: "success".to_string(),
        result: Some(is_running.to_string()),
        message: Some(if is_running {
            "사이드카가 실행 중입니다.".to_string()
        } else {
            "사이드카가 실행 중이지 않습니다.".to_string()
        }),
    })
}
