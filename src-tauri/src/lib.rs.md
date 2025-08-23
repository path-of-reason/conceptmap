## 핵심 개념 (Core Concept)
이 파일은 Tauri 애플리케이션의 메인 진입점 라이브러리입니다. Tauri 플러그인들을 초기화하고, 프런트엔드에서 호출할 수 있는 백엔드 커맨드들을 등록합니다.

## 설계 원칙 (Design Principle)
- **플러그인 관리**: `tauri-plugin-store`, `tauri_plugin_dialog`, `tauri_plugin_opener` 등 필요한 Tauri 플러그인들을 빌드하고 등록합니다.
- **커맨드 핸들러**: `tauri::generate_handler!` 매크로를 사용하여 `file_system`, `kuzu_query`, `app_state`, `vault_manager` 모듈의 백엔드 커맨드들을 프런트엔드에서 호출 가능하도록 노출합니다.
- **상태 관리**: `app_state::AppState`와 같은 애플리케이션 전역 상태를 `tauri::manage`를 통해 관리합니다.

## 변경 이력 (Change History)
- **2025-08-23**: 다중 볼트 시스템 지원을 위해 `vault_manager::save_vault_path` 및 `load_vault_path` 커맨드를 `save_vault_data` 및 `load_vault_data`로 업데이트. (요청: "볼트 관리 시스템 개선")