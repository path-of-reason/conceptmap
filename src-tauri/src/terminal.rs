use portable_pty::{Child, CommandBuilder, MasterPty, NativePtySystem, PtySize, PtySystem};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter, State};

/// 터미널 크기 상태값
#[derive(serde::Deserialize)]
pub struct PtyInitArgs {
    /// 터미널 가로길이
    #[serde(rename = "initialCols")]
    initial_cols: u16,
    /// 터미널 세로길이
    #[serde(rename = "initialRows")]
    initial_rows: u16,
}

pub struct PtyProcess {
    master_control: Arc<Mutex<Box<dyn MasterPty + Send>>>, // 리사이즈 및 다른 제어용
    writer: Arc<Mutex<Box<dyn Write + Send>>>, // 쓰기 핸들 (Mutex로 감싸서 여러 write_to_pty 호출에서 공유)
    _child: Box<dyn Child + Send + Sync>,      // Child 트레잇 객체
}

impl Drop for PtyProcess {
    fn drop(&mut self) {
        println!("[PtyProcess Drop] PtyProcess is being dropped. Child process should terminate.");
        // child.kill()을 명시적으로 호출하거나, child가 drop될 때 알아서 종료되도록 할 수 있음.
        // writer가 drop될 때 EOF가 보내지므로, child는 정상 종료할 기회를 가짐.
    }
}

/// xterm 세션 시작 상태
#[derive(Default)]
pub struct PtySessionState(Arc<Mutex<Option<PtyProcess>>>);

#[derive(Clone, serde::Serialize)]
struct PtyOutputPayload {
    output: String,
}

#[tauri::command]
pub async fn start_pty_session(
    app_handle: AppHandle,
    state: State<'_, PtySessionState>,
    // args: PtyInitArgs, // 초기 크기 인자 추가
    initial_cols: u16,
    initial_rows: u16,
) -> Result<(), String> {
    println!(
        "[Rust Backend] 'start_pty_session_interactive' called with initial size: cols={}, rows={}",
        // args.initial_cols, args.initial_rows
        initial_cols,
        initial_rows
    );

    {
        let mut pty_session_guard = state.0.lock().unwrap();
        if let Some(_existing_session) = pty_session_guard.take() {
            println!("[Rust Backend] Previous PtyProcess dropped, closing existing PTY session.");
        }
    }

    let pty_system = NativePtySystem::default();
    let initial_size = PtySize {
        // rows: args.initial_rows,
        // cols: args.initial_cols,
        rows: initial_rows,
        cols: initial_cols,
        pixel_width: 0,
        pixel_height: 0,
    };

    match pty_system.openpty(initial_size) {
        Ok(pair) => {
            // pair는 여기서 소유권을 가짐
            println!("[Rust Backend] PTY opened successfully.");

            let shell_cmd = if cfg!(windows) { "cmd.exe" } else { "zsh" }; // zsh로 변경
            let mut cmd = CommandBuilder::new(shell_cmd);
            cmd.env("TERM", "xterm-256color");

            let master_control_arc = Arc::new(Mutex::new(pair.master));
            // master_control_arc를 사용하여 리더와 라이터 생성
            let pty_output_reader = {
                let master_guard = master_control_arc.lock().unwrap();
                master_guard
                    .try_clone_reader()
                    .map_err(|e| format!("Failed to clone reader: {}", e))?
            };
            let writer_taken = {
                let master_guard = master_control_arc.lock().unwrap();
                master_guard
                    .take_writer()
                    .map_err(|e| format!("Failed to take writer: {}", e))?
            };

            let slave = pair.slave;
            let child_obj = match slave.spawn_command(cmd) {
                Ok(c) => c,
                Err(e) => return Err(format!("Failed to spawn command: {}", e)),
            };
            // PtyProcess 인스턴스 생성 및 State에 저장
            {
                let mut pty_session_guard = state.0.lock().unwrap();
                *pty_session_guard = Some(PtyProcess {
                    master_control: Arc::clone(&master_control_arc), // master_control_arc 저장
                    writer: Arc::new(Mutex::new(writer_taken)),
                    _child: child_obj,
                    // // master_reader: master_reader_clone,         // 복제된 리더 저장
                    // writer: Arc::new(Mutex::new(writer_taken)), // 가져온 writer를 Arc<Mutex<>>로 감싸서 저장
                    // child,                                      // child 저장
                });
            }

            // PTY 출력을 읽는 스레드 (pty_output_reader 사용)
            let app_handle_clone = app_handle.clone();
            let pty_state_clone_for_cleanup = state.0.clone();
            tokio::task::spawn_blocking(move || {
                let mut reader_in_thread = pty_output_reader;
                // ... (리더 스레드 로직은 동일) ...
                let mut buffer = [0u8; 1024];
                loop {
                    match reader_in_thread.read(&mut buffer) {
                        Ok(0) => {
                            break;
                        } // EOF
                        Ok(n) => {
                            if let Ok(output_str) = String::from_utf8(buffer[..n].to_vec()) {
                                // print!("[PTY Out]: {}", output_str);
                                app_handle_clone
                                    .emit("pty_output", PtyOutputPayload { output: output_str })
                                    .unwrap_or_else(|e| eprintln!("Emit error: {}", e));
                            } else {
                                eprintln!("[Rust PTY Reader] Invalid UTF-8 sequence.");
                            }
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::Interrupted => continue,
                        Err(e) => {
                            eprintln!("[Rust PTY Reader] Read error: {}. Ending reader task.", e);
                            break;
                        }
                    }
                }
                println!("[Rust PTY Reader] Reader task finished. Cleaning up session state.");
                let mut session_guard = pty_state_clone_for_cleanup.lock().unwrap();
                if let Some(session_to_drop) = session_guard.take() {
                    drop(session_to_drop);
                    println!("[Rust PTY Reader] PtyProcess from state explicitly dropped.");
                }
                app_handle_clone
                    .emit(
                        "pty_output",
                        PtyOutputPayload {
                            output: "\r\n[PTY Session Ended In Reader]\r\n".to_string(),
                        },
                    )
                    .unwrap_or_else(|e| eprintln!("Emit error: {}", e));
            });
            Ok(())
        }
        Err(e) => Err(format!("Failed to open PTY: {}", e)),
    }
}

#[tauri::command]
pub async fn stop_pty_session(state: State<'_, PtySessionState>) -> Result<(), String> {
    println!("[Rust Backend] 'close_pty_session_interactive' command called.");
    let mut pty_session_guard = state.0.lock().unwrap();
    if let Some(pty_process_to_drop) = pty_session_guard.take() {
        // PtyProcess가 drop되면서 내부의 _child (자식 프로세스)와 writer 등이 정리됨.
        // _child.kill() 등을 명시적으로 호출할 수도 있지만, drop 시 자동으로 처리될 것으로 기대.
        drop(pty_process_to_drop); // 명시적인 drop 호출 (선택 사항, scope 벗어날 때 자동 drop)
        println!(
            "[Rust Backend] PtyProcess taken from state and dropped. PTY session should be closed."
        );
        Ok(())
    } else {
        println!("[Rust Backend] No active PTY session to close.");
        Ok(())
    }
}

#[tauri::command]
pub async fn write_pty(input: String, state: State<'_, PtySessionState>) -> Result<(), String> {
    println!(
        "[Rust Backend] 'write_to_pty' input: {:?}",
        input.trim_end()
    );

    // State에서 PtyProcess를 가져오고, 그 안의 writer (Arc<Mutex<Box<dyn Write + Send>>>)에 접근
    let session_arc_mutex = state.0.lock().unwrap(); // Option<PtyProcess>에 대한 MutexGuard

    if let Some(pty_process) = &*session_arc_mutex {
        // Option 내부의 PtyProcess에 대한 참조
        // pty_process.writer는 Arc<Mutex<Box<dyn Write + Send>>> 타입
        // 이 Arc를 복제하여 Mutex를 잠그고 내부 writer에 접근
        let writer_arc_clone = Arc::clone(&pty_process.writer); // Arc 복제
        let mut writer_guard = writer_arc_clone.lock().unwrap(); // Mutex 잠금 (Box<dyn Write + Send>에 대한 MutexGuard)
                                                                 // writer_guard는 DerefMut을 통해 &mut Box<dyn Write + Send>처럼 동작

        // 이제 writer_guard (실제로는 내부 Box<dyn Write + Send>에 대한 &mut 참조)에 씁니다.
        match writer_guard.write_all(input.as_bytes()) {
            Ok(_) => {
                if let Err(e) = writer_guard.flush() {
                    eprintln!("[Rust Backend] Error flushing PTY writer: {}", e);
                }
                println!("[Rust Backend] Successfully wrote to PTY.");
                Ok(())
            }
            Err(e) => {
                eprintln!("[Rust Backend] Error writing to PTY: {}", e);
                Err(e.to_string())
            }
        }
        // writer_guard (MutexGuard)가 여기서 drop되면서 Mutex 잠금 해제
    } else {
        Err("PTY session not initialized or already closed.".to_string())
    }
    // session_arc_mutex (MutexGuard)가 여기서 drop되면서 바깥쪽 Mutex 잠금 해제
}

#[tauri::command]
pub async fn resize_pty(
    rows: u16,
    cols: u16,
    state: State<'_, PtySessionState>,
) -> Result<(), String> {
    println!(
        "[Rust Backend] 'resize_pty' CALLED with rows: {}, cols: {}",
        rows, cols
    );
    let session_guard = state.0.lock().unwrap();

    if let Some(pty_process) = &*session_guard {
        let master_guard = pty_process.master_control.lock().unwrap();
        let new_size = PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        };
        match master_guard.resize(new_size) {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    } else {
        Err("PTY session not initialized for resize.".to_string())
    }
}
