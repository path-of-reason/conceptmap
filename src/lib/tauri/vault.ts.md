# 온톨로지: `src/lib/tauri/vault.ts`

## 핵심 개념

Tauri 백엔드(`vault_manager.rs`)와 프런트엔드 간의 볼트 데이터 통신을 담당하는 API 모듈입니다. `effect-ts`를 사용하여 비동기 작업과 에러 처리를 안정적으로 관리합니다.

## 주요 기능 (Functions)

-   `addVault(path)`: 백엔드에 새 볼트 경로 추가를 요청합니다.
-   `removeVault(path)`: 백엔드에 특정 볼트 경로 삭제를 요청합니다.
-   `setCurrentVault(path)`: 백엔드에 현재 활성 볼트를 지정하도록 요청합니다.
-   `loadVaults()`: 모든 볼트 목록을 가져옵니다.
-   `getCurrentVault()`: 현재 활성 볼트 경로를 가져옵니다.
-   `loadVaultsAndCurrent()`: 앱 초기화 시 모든 볼트 목록과 현재 활성 볼트를 한 번에 가져옵니다.
-   `VaultOperationError`: 볼트 관련 작업 실패 시 발생하는 커스텀 에러 타입입니다.

## 활용처

-   `src/lib/store/vault.svelte.ts`에서 이 API를 사용하여 백엔드와 통신하고, 그 결과를 바탕으로 프런트엔드 상태를 업데이트합니다.

## 변경 이력

-   **2025-08-23**: 다중 볼트 지원을 위해 `loadVaultsAndCurrent` 함수를 추가하고, `addVault`, `removeVault`, `setCurrentVault` 등 관련 API 함수들을 구현하여 백엔드 커맨드와 연동되도록 수정했습니다.
