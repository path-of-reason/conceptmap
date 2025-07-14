use std::sync::Arc;
use tauri::{AppHandle, Runtime};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;
use tokio::sync::{mpsc::Receiver, Mutex};

use crate::sidecar::model::PythonResponse;

/// 파이썬 코드 실행 사이드카
#[derive(Debug, Clone)]
pub struct SidecarState {
    /// child:실행, 시작, 종료 등 사이드카 프로세스 제어
    pub child: Arc<Mutex<Option<CommandChild>>>,
    /// rx:실행된 사이드카 프로세스에서 이벤트를 받아오는 통신용 수신기
    pub rx: Arc<Mutex<Option<Receiver<CommandEvent>>>>,
}

impl SidecarState {
    pub fn new() -> Arc<SidecarState> {
        Arc::new(SidecarState {
            child: Arc::new(Mutex::new(None)),
            rx: Arc::new(Mutex::new(None)),
        })
    }

    pub async fn start_sidecar<R: Runtime>(&self, app_handle: AppHandle<R>) -> Result<(), String> {
        if self.child.lock().await.is_some() {
            println!("[INFO] Sidecar is already running.");
            return Ok(());
        }
        let (rx_channel, child_process) = app_handle
            .shell()
            .sidecar("main")
            .map_err(|e| format!("Failed to create sidecar command: {}", e))?
            .spawn()
            .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;
        // 상태 업데이트
        *self.child.lock().await = Some(child_process);
        *self.rx.lock().await = Some(rx_channel);
        println!("[INFO] Sidecar started successfully.");
        Ok(())
    }

    // 사이드카를 중지하는 함수
    pub async fn stop_sidecar(&self) -> PythonResponse {
        if self.child.lock().await.is_none() {
            println!("[INFO] Sidecar is not running.");
            return PythonResponse {
                status: "success".to_string(),
                result: Some("사이드카가 이미 실행 중이지 않습니다.".to_string()),
                message: None,
            };
        }
        println!("[INFO] Stopping sidecar...");
        let response = self
            .send_command_to_python(
                serde_json::json!({
                  "command": "__SHUTDOWN__", // 파이썬이 인식하는 종료 명령
                  "message": "Rust is requesting shutdown."
                })
                .to_string(),
            )
            .await;
        *self.child.lock().await = None;
        *self.rx.lock().await = None;
        println!("[INFO] Sidecar state cleared.");
        response
    }

    pub async fn send_command_to_python(&self, input_data: String) -> PythonResponse {
        println!("[INFO] Attempting to send command to Python sidecar...");
        let mut child_guard = self.child.lock().await;
        let child = match child_guard.as_mut() {
            Some(c) => c,
            None => {
                return PythonResponse {
                    status: "error".to_string(),
                    result: None,
                    message: Some("사이드카 프로세스가 실행중이지 않습니다.".to_string()),
                };
            }
        };
        let mut rx_guard = self.rx.lock().await;
        let rx = match rx_guard.as_mut() {
            Some(r) => r,
            None => {
                return PythonResponse {
                    status: "error".to_string(),
                    result: None,
                    message: Some("사이드카 리시버(rx)가 유효하지 않습니다.".to_string()),
                };
            }
        };
        if let Err(e) = child.write(format!("{}\n", input_data).as_bytes()) {
            return PythonResponse {
                status: "error".to_string(),
                result: None,
                message: Some(format!(
                    "사이드카의 입력 스트림에 데이터를 쓰는 데 실패했습니다: {}",
                    e
                )),
            };
        }

        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    let response_line = String::from_utf8_lossy(&line).to_string();
                    println!("[DEBUG] Received from sidecar stdout: {}", response_line);
                    return match serde_json::from_str::<PythonResponse>(&response_line) {
                        Ok(resp) => resp, // 성공 응답 반환
                        Err(e) => PythonResponse {
                            status: "error".to_string(),
                            result: None,
                            message: Some(format!(
                                "JSON 파싱에 실패했습니다: {}. 원본 데이터: '{}'",
                                e, response_line
                            )),
                        },
                    };
                }
                CommandEvent::Stderr(line) => {
                    println!(
                        "[ERROR] Received from sidecar stderr: {}",
                        String::from_utf8_lossy(&line)
                    );
                }
                CommandEvent::Terminated(payload) => {
                    println!(
                        "[INFO] Sidecar process terminated with code: {:?}, signal: {:?}",
                        payload.code, payload.signal
                    );
                    *child_guard = None;
                    *rx_guard = None;
                    return PythonResponse {
                        status: "error".to_string(),
                        result: None,
                        message: Some("사이드카 프로세스가 종료되었습니다.".to_string()),
                    };
                }
                _ => {
                    println!("[DEBUG] Received other event: {:?}", event);
                }
            }
        }

        PythonResponse {
            status: "error".to_string(),
            result: None,
            message: Some("사이드카로부터 유효한 출력(stdout)을 받지 못했습니다.".to_string()),
        }
    }
}
