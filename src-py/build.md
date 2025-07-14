```sh
# 환경셋팅
uv venv
# 환경실행
pyactivate
# 의존성 설치
uv pip install pyinstaller
# src-tauri 폴더에 빌드
pyinstaller --onefile --distpath "./../src-tauri" -n "main-aarch64-apple-darwin" "main.py"
```
