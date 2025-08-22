## 핵심 개념 (Core Concept)
이 파일은 Tauri 앱의 볼트(Vault) 경로를 `tauri-plugin-store`를 사용하여 관리하는 Rust 백엔드 커맨드를 제공합니다. 사용자가 선택한 마크다운 폴더 경로를 영구적으로 저장하고, 앱 시작 시 이를 불러오는 기능을 담당합니다.

## 설계 원칙 (Design Principle)
- **영속성**: `tauri-plugin-store`를 활용하여 앱 재시작 후에도 볼트 경로가 유지되도록 합니다.
- **양방향 접근**: 프런트엔드와 백엔드 모두에서 볼트 경로에 접근하고 수정할 수 있는 API를 제공합니다.
- **단순성**: 볼트 경로 저장/로드라는 단일 책임에 집중하여 모듈의 복잡성을 낮춥니다.

## 변경 이력 (Change History)
- **25.08.23**: `tauri-plugin-store` API 사용법 오류 수정 (await 제거, `app.store()` 사용, `VaultPathPayload` 도입 등). (요청: "오류 수정")
- **25.08.23**: 볼트 설정 - 핵심 데이터 계층 구현 계획에 따라 `save_vault_path` 및 `load_vault_path` 커맨드를 포함하여 파일 신규 생성. (요청: "볼트 설정 - 핵심 데이터 계층 구현")