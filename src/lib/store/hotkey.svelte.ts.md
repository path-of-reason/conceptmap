# hotkey.svelte.ts

## 핵심 개념 (Core Concept)
전역 단축키(핫키)를 등록하고 관리하는 시스템입니다. Svelte 5의 Rune(`$state`)을 사용하여 반응적으로 키 입력 상태를 추적하며, 'normal' 모드와 'leader' 모드(예: 'Space' 키를 누른 후 다른 키를 입력)를 지원합니다. 등록된 핫키는 중앙 `CommandApi`와 연동되어 특정 명령을 실행합니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
