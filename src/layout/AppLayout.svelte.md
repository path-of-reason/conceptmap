# AppLayout.svelte

## 핵심 개념 (Core Concept)
애플리케이션의 최상위 레이아웃 구조를 정의하는 Svelte 컴포넌트입니다. `PaneGroup`과 `Pane`을 사용하여 헤더, 사이드바, 메인 콘텐츠 영역, 상태바 등 주요 UI 섹션의 배치와 관계를 설정합니다. 또한, 각 섹션에 컨텍스트를 부여하는 이벤트를 처리하는 역할도 일부 담당합니다.

## 변경 이력 (Change History)
- **2025-08-20**: 왼쪽 사이드바 `Pane`에 `onfocusin`/`onfocusout` 이벤트를 추가하여 'leftSidebar' 컨텍스트를 관리하도록 수정했습니다. (요청: "고급 컨텍스트 핫키 시스템 구현")
