# 온톨로지: `src/lib/store/vault.svelte.ts`

## 핵심 개념

Svelte 5의 Rune (`$state`)을 사용하여 볼트 관련 상태를 전역적으로 관리하는 중앙 스토어입니다. 다중 볼트 목록(`vaults`), 현재 선택된 볼트 경로(`path`), 로딩 및 에러 상태를 포함하여 UI의 일관성을 유지합니다.

## 주요 기능 (API)

-   `state`: 현재 스토어의 모든 상태(`vaults`, `path`, `isSet`, `loading`, `error`)를 담고 있는 반응형 객체입니다.
-   `fetchVaultPath`: 앱 초기화 시 백엔드에서 모든 볼트 데이터를 가져와 상태를 설정합니다.
-   `addVault`, `removeVault`: 볼트를 추가/삭제하고 백엔드에 변경 사항을 전파합니다.
-   `setVaultPath`: UI에서 사용자가 선택한 볼트를 현재 활성 볼트로 설정합니다.
-   `saveVaultPathToBackend`: 현재 설정된 볼트 경로를 백엔드에 영구 저장합니다.

## 활용처

-   `VaultSetup.svelte`와 같은 UI 컴포넌트에서 이 스토어의 상태를 구독하여 화면을 렌더링하고, 사용자의 상호작용에 따라 상태를 변경하는 함수들을 호출합니다.
-   애플리케이션 전반에서 현재 볼트 경로가 필요할 때 이 스토어를 참조합니다.

## 변경 이력

-   **2025-08-23**: 다중 볼트 지원을 위해 상태 객체에 `vaults: string[]` 배열을 추가했습니다. `fetchVaultPath`, `addVault`, `removeVault` 등 다중 볼트 목록을 관리하는 로직을 추가하고, 기존 단일 경로 관리 로직을 리팩토링했습니다.
