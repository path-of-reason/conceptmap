1. 기능적 요구사항 (Functional Requirements)
   1.1. 주요 영역 렌더링:
   좌측 사이드바 영역
   메인 콘텐츠 영역
   우측 사이드바 영역 (선택적)
   1.2. Shadcn Svelte Sidebar.Provider 통합:
   좌/우 사이드바를 위해 Sidebar.Provider를 적절히 중첩하여 사용해야 합니다.
   각 Sidebar.Provider는 고유한 ctxKey (예: "left", "right")를 받아야 합니다.
   1.3. 콘텐츠 슬롯/프로퍼티 제공:
   메인 콘텐츠 영역을 위한 슬롯(children)을 받아야 합니다.
   좌/우 사이드바 영역에도 콘텐츠를 주입할 수 있는 슬롯(named slot) 또는 프로퍼티를 제공해야 합니다. (예: <slot name="leftSidebar" />, <slot name="rightSidebar" />)
   1.4. 사이드바 컴포넌트 통합:
   LeftSidebar.svelte (좌측 사이드바)와 향후 생성될 RightSidebar.svelte (우측 사이드바) 컴포넌트를 이 레이아웃 내부에 포함해야 합니다.
   LeftSidebar는 ctxKey, variant, collapsible 등의 필요한 프로퍼티를 받아야 합니다.
   1.5. 트리거 버튼 통합:
   좌/우 사이드바를 토글하는 Sidebar.Trigger 버튼을 메인 영역 내 적절한 위치에 통합해야 합니다.
   각 Sidebar.Trigger는 올바른 side 프로퍼티를 가져야 합니다.
   1.6. 유연한 영역 너비 및 가시성 제어:
   useLayoutStore (또는 useSidebarStore, useUIVisibilityStore 등 분리된 스토어)로부터 사이드바 너비(sidebarWidth, rightSidebarWidth)와 가시성(isFileExplorerVisible, isRightSidebarVisible) 상태를 받아 각 영역의 크기 및 표시 여부를 제어해야 합니다.
   사이드바 너비 조절 로직(useSidebarResizing, useRightSidebarResizing)과의 간접적인 연동을 고려해야 합니다.
2. 비기능적 요구사항 (Non-Functional Requirements)
   2.1. 모듈성 및 캡슐화:
   레이아웃 로직(Flexbox, Provider 중첩 등)을 완전히 캡슐화하여, 이 컴포넌트를 사용하는 상위 컴포넌트(AppLayout.svelte)는 레이아웃의 내부 구현을 알 필요 없이 단순히 이 컴포넌트를 렌더링하도록 해야 합니다.
   2.2. 재사용성:
   EditorWorkspace뿐만 아니라 유사한 2-pane/3-pane 레이아웃이 필요한 다른 곳에서도 재사용할 수 있도록 설계해야 합니다. (지나치게 Editor에 종속되지 않도록 일반화 고려)
   2.3. 유지보수성:
   코드 가독성이 높고, 레이아웃 구조 변경 시 쉽게 수정할 수 있어야 합니다.
   2.4. 성능:
   불필요한 리렌더링을 최소화하고, 레이아웃 변경(예: 사이드바 토글/리사이징) 시 부드러운 전환을 제공해야 합니다.
   2.5. 확장성:
   향후 새로운 사이드바, 패널 또는 레이아웃 요소가 추가될 때 유연하게 확장될 수 있도록 설계해야 합니다.
   2.6. 접근성 (Accessibility):
   tabIndex, ARIA roles (예: role="main", role="complementary") 등 웹 접근성 표준을 준수하여 키보드 내비게이션 및 스크린 리더 사용자가 레이아웃을 효과적으로 탐색할 수 있도록 해야 합니다.
   Sidebar.Provider와 Sidebar.Trigger가 제공하는 기본 접근성 기능을 유지하고 활용합니다.
   2.7. Svelte 친화적:
   Svelte의 반응성 시스템($derived, $state 등)과 컴포넌트 패턴을 올바르게 활용하여 효율적으로 구현해야 합니다.
   이 요구사항 리스트를 바탕으로, 독자적인 레이아웃 컴포넌트를 생성하는 계획을 수립해볼 수 있습니다. 어떤 부분에 대해 더 논의하거나 추가/수정하고 싶은 요구사항이 있으신가요?
