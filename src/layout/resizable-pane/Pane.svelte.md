# Pane.svelte

## 핵심 개념 (Core Concept)
애플리케이션의 레이아웃을 구성하는 개별 '창(Pane)'을 나타내는 Svelte 컴포넌트입니다. 크기 조절이 가능한 영역을 정의하며, 각 Pane의 ID를 기반으로 `SectionApi`와 연동하여 상태를 관리합니다. 또한, `toggleKey` prop을 통해 특정 단축키로 Pane의 접힘/펼침 상태를 제어할 수 있도록 핫키를 등록하는 역할도 수행합니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성.
- **2025-08-20**: 핫키 등록 시 `toggleCollapsed` 대신 `API.section.toggleLayout(id)`를 호출하도록 변경하여, 컨텍스트 변경 로직이 포함된 중앙 토글 함수를 사용하도록 수정했습니다. (요청: "토글 로직 통합 리팩토링")
- **2025-08-20**: 불필요한 `onfocusin`/`onfocusout` props 및 관련 속성을 제거했습니다. (요청: "불필요한 onfocusin/onfocusout 제거")
