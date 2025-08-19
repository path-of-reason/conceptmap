# section.svelte.ts

## 핵심 개념 (Core Concept)
애플리케이션의 분할 가능한 레이아웃 섹션(사이드바, 헤더 등)들의 개별 상태와 동작을 관리합니다. 각 섹션의 접힘(collapsed), 크기, 포커스, 리사이징 로직 등을 처리하는 `useSectionStore` 훅과 관련 API를 제공하며, UI 상태 변경 시 `ContextApi`와 연동하여 컨텍스트를 업데이트하는 책임을 가집니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성.
- **2025-08-20**: `toggleLayout` 함수를 수정하여, 섹션이 열리고 닫힐 때 `ContextApi`의 `enter`/`leave`를 호출하도록 변경했습니다. (요청: "고급 컨텍스트 핫키 시스템 구현")
