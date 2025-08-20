# modal.svelte.ts

## 핵심 개념 (Core Concept)
애플리케이션의 모달(Modal) 상태를 관리하는 Svelte 5 스토어입니다. 모달의 열림/닫힘 상태, 현재 표시할 모달 컴포넌트 등을 관리하며, `ModalApi`를 통해 모달을 제어하는 함수들을 제공합니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
- **2025-08-20**: `openModal` 및 `closeModal` 함수에 `API.context.enter('modal')` 및 `API.context.leave('modal')` 호출 로직을 추가하여 모달 컨텍스트를 자동으로 관리하도록 했습니다. (요청: "고급 컨텍스트 초기화")