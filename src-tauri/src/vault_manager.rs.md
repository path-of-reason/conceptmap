# 온톨로지: `src-tauri/src/vault_manager.rs`

## 핵심 개념

Tauri의 `tauri-plugin-store`를 사용하여 사용자의 볼트(Vault) 경로 정보를 관리하는 백엔드 모듈입니다. 다중 볼트 경로 목록(`vaults`)과 현재 활성화된 볼트 경로(`current_vault`)를 JSON 파일(`store.json`)에 저장하고 관리합니다.

## 주요 기능 (Tauri Commands)

-   `add_vault(path: String)`: 새 볼트 경로를 목록에 추가합니다.
-   `remove_vault(path: String)`: 기존 볼트 경로를 목록에서 제거합니다.
-   `load_vaults()`: 저장된 모든 볼트 경로 목록을 불러옵니다.
-   `load_vaults_and_current()`: 모든 볼트 경로와 현재 활성화된 볼트 경로를 함께 불러옵니다.
-   `set_current_vault(path: String)`: 지정된 경로를 현재 활성화된 볼트로 설정합니다.
-   `get_current_vault()`: 현재 활성화된 볼트 경로를 불러옵니다.

## 활용처

-   프런트엔드의 `src/lib/tauri/vault.ts`에서 Tauri `invoke`를 통해 호출되어 볼트 데이터를 관리합니다.

## 변경 이력

-   **2025-08-23**: 다중 볼트 지원을 위해 기존 단일 경로 저장 방식에서 여러 볼트 경로(`Vec<String>`)와 현재 볼트 경로(`Option<String>`)를 함께 관리하는 구조로 리팩토링했습니다. 관련 커맨드(`add_vault`, `remove_vault`, `load_vaults_and_current`, `set_current_vault`)를 추가하고 수정했습니다.