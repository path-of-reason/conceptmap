import os
import sys
import json
import time

def greet(name):
    if name:
        return {"status": "success",
                "result": f"Hello, {name} from Python!", "message": None}
    else:
        return {"status": "error",
                "result": None, "message": "Name cannot be empty."}

# 바탕화면에 로그 작성 => 옮길것
desktop_path = os.path.join(os.path.expanduser('~'), 'Desktop')
log_file_path = os.path.join(desktop_path, 'tauri_sidecar_log.txt')

def log(msg):
    with open(log_file_path, "a", encoding="utf-8") as f:
        f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
        f.flush()

if __name__ == "__main__":
    log("=== Python sidecar started ===")
    while True:
        try:
            log("Waiting for input...")
            line = sys.stdin.readline()
            if not line:
                log("EOF or stdin closed! Exiting...")
                time.sleep(0.1)
                break

            cleaned_text = line.strip()
            log(f"Received input: {cleaned_text}")

            # --- 추가된 종료 로직 ---
            if cleaned_text == "__SHUTDOWN__": # 특별한 종료 명령
                log("Received shutdown command. Exiting gracefully.")
                response_data = {"status": "success", "result": "Python sidecar shutting down.", "message": None}
                sys.stdout.write(json.dumps(response_data) + '\n')
                sys.stdout.flush()
                break # 루프를 빠져나가 스크립트 종료

            response_data = greet(cleaned_text)
            sys.stdout.write(json.dumps(response_data) + '\n')
            sys.stdout.flush()
            log(f"Sent response: {response_data}")

        except Exception as e:
            error_response = {"status": "error", "result": None,
                              "message": f"Python script error: {str(e)}"}
            sys.stderr.write(json.dumps(error_response) + '\n')
            sys.stderr.flush()
            log(f"Exception: {str(e)}")
    log("=== Python sidecar terminated ===") # 종료 로그 추가
