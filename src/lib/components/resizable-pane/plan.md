왼쪽 사이드바 구현을 위한 계획 수립 (Svelte 5, 데이터 기반)
말씀하신 대로, 코드를 바로 제시하기보다는 전체적인 설계 과정과 주요 결정 지점에 초점을 맞춰 계획을 단계별로 수립해 보겠습니다.

# 1단계: 핵심 요구사항 재확인 및 구체화

먼저, 왼쪽 사이드바가 어떤 기능을 가져야 하는지 핵심적인 요구사항을 다시 한번 정리하고 구체화합니다.

- [x] 가시성 제어: 사이드바를 보이거나 숨길 수 있어야 합니다 (토글).
- [ ] 크기 조절: 사용자가 마우스를 드래그하여 사이드바의 너비를 조절할 수 있어야 합니다.
- [ ] 초기 상태 정의: 사이드바의 초기 너비, 접힘 여부 등을 설정할 수 있어야 합니다.
- [ ] 최소/최대 크기 제한: 크기 조절 시 특정 범위(예: 100px ~ 500px)를 벗어나지 않도록 제한해야 합니다.
- [ ] 애니메이션: 토글하거나 리사이즈할 때 부드러운 전환 효과가 있어야 합니다.
- [ ] 콘텐츠 주입: 사이드바 내부에 원하는 어떠한 Svelte 컴포넌트나 HTML 콘텐츠도 유연하게 넣을 수 있어야 합니다.
- [ ] 데이터 기반: 위 모든 제어가 **설정 객체(Configuration Object)**를 통해 이루어져야 합니다.

# 2단계: 데이터 모델 설계 (핵심)

데이터 중심 설계를 위해, 사이드바의 모든 상태와 설정이 담길 단일 설정 객체의 구조를 정의합니다.

속성 정의:

width: 사이드바의 현재 너비를 나타내는 숫자 (px 단위).

minWidth: 사이드바의 최소 너비 (px).

maxWidth: 사이드바의 최대 너비 (px).

collapsed: 사이드바가 현재 접혀 있는지 여부를 나타내는 불리언 값.

resizable: 사용자가 크기를 조절할 수 있는지 여부 (불리언).

collapsible: 사용자가 사이드바를 접거나 펼 수 있는지 여부 (불리언).

animationDuration: 접힘/펼침 애니메이션의 지속 시간 (ms).

animationEasing: 애니메이션의 이징 함수 (CSS transition-timing-function 값).

예시 스키마:

TypeScript

interface SidebarConfig {
width: number; // 현재 너비, 초기값으로도 사용
minWidth: number;
maxWidth: number;
collapsed: boolean;
resizable: boolean;
collapsible: boolean;
animationDuration: number;
animationEasing: string;
// 다른 설정이 추가될 수 있음 (예: 배경색, 그림자 등)
}
핵심 결정: 이 SidebarConfig 객체 자체가 상위 컴포넌트에서 $state로 선언되어 Sidebar 컴포넌트의 $props로 전달될 것입니다. 이렇게 하면 Sidebar 내부에서 config.collapsed = !config.collapsed와 같이 변경해도 상위 컴포넌트에 즉시 반영되어 반응성이 유지됩니다 ($bindable 룬 사용 불필요).

# 3단계: 컴포넌트 계층 구조 및 역할 분담

단일 Sidebar.svelte 컴포넌트로 시작하되, 필요에 따라 역할을 분리할 수 있는 구조를 고려합니다.

Sidebar.svelte (메인 컴포넌트):

SidebarConfig 객체를 props로 받아 사이드바의 외형(너비, 접힘 상태)과 동작(리사이즈, 토글)을 제어합니다.

Svelte 5의 $props 룬을 사용하여 config 객체를 받습니다.

$state 룬을 사용하여 isResizing과 같이 컴포넌트 내부에서만 관리되는 임시 상태를 관리합니다.

$derived 룬을 사용하여 effectiveWidth (접힘 상태에 따라 0 또는 width 값)와 같은 파생된 상태를 계산합니다.

$effect 룬을 사용하여 마우스 드래그 이벤트 리스너 등록 및 해제와 같은 부수 효과를 관리합니다.

사이드바 콘텐츠를 위한 **#snippets**를 props로 받아 @render 룬으로 렌더링합니다.

리사이즈 핸들 및 토글 버튼을 포함합니다.

ResizeHandle.svelte (선택적 서브 컴포넌트):

리사이즈 로직이 복잡해지면 별도의 ResizeHandle.svelte 컴포넌트로 분리하여 onMouseDown 등의 이벤트를 상위 Sidebar.svelte로 전달할 수 있습니다. 초기 단계에는 Sidebar.svelte 내부에 포함하여 개발합니다.

# 4단계: 레이아웃 및 스타일링 전략

사이드바와 메인 콘텐츠 영역이 나란히 배치되고, 사이드바의 크기가 조절될 수 있도록 CSS를 설계합니다.

Flexbox/Grid Layout: 부모 컨테이너에 display: flex를 사용하여 사이드바와 메인 콘텐츠 영역을 쉽게 배치합니다.

CSS 변수: Svelte 컴포넌트에서 동적으로 계산된 값을 CSS에 전달하기 위해 -- 접두사가 붙은 CSS 변수를 활용합니다 (예: width: var(--sidebar-width);).

CSS transition: transition: width [duration] [easing] 속성을 사용하여 접힘/펼침 및 리사이즈 애니메이션을 구현합니다.

# 5단계: 인터랙션 및 애니메이션 구현 상세 계획

각 기능이 어떻게 작동할지 구체적으로 계획합니다.

크기 조절 (Resizing):

리사이즈 핸들의 onmousedown 이벤트 발생 시 isResizing = true로 설정하고, 현재 마우스 위치(startX) 및 사이드바 너비(startWidth)를 저장합니다.

$effect 룬 내부에서 isResizing이 true일 때 document에 mousemove 및 mouseup 이벤트 리스너를 등록합니다.

mousemove 발생 시 event.clientX와 startX를 기반으로 currentWidth를 계산하고, minWidth 및 maxWidth 내에 있도록 제한하여 config.width를 업데이트합니다.

mouseup 발생 시 isResizing = false로 설정하고 이벤트 리스너를 해제합니다.

토글 (Collapse/Expand):

토글 버튼의 onclick 이벤트 발생 시 config.collapsed의 불리언 값을 반전시킵니다.

CSS transition이 config.width가 0으로 되거나 다시 복원되는 것을 감지하여 애니메이션을 자동으로 처리합니다.

콘텐츠 주입:

Sidebar.svelte는 let { content }: { content: Snippet } = $props(); 형태로 content 속성을 받습니다.

상위 컴포넌트에서는 <Sidebar config={...}> {#snippet content()} ...실제 내용... {/snippet} </Sidebar> 형태로 스니펫을 사용하여 콘텐츠를 전달합니다.

Sidebar.svelte 내에서는 <div class="sidebar-content"> {@render content()} </div>와 같이 {@render}를 사용하여 전달받은 콘텐츠를 원하는 위치에 렌더링합니다.

6단계: 개발 환경 및 마이그레이션 고려사항
SvelteKit / Vite: Svelte 5를 위한 개발 환경 설정은 SvelteKit이나 Vite를 사용하는 것이 가장 일반적입니다.

TypeScript: 강력한 타입 추론과 안정성을 위해 TypeScript를 사용합니다. Snippet 타입 import 등을 활용합니다.

sv migrate: 기존 Svelte 4 프로젝트라면 sv migrate 도구가 도움이 될 수 있지만, 새로운 Svelte 5 프로젝트라면 처음부터 룬 기반으로 설계하는 것이 좋습니다.

요약 및 다음 단계
이 계획은 왼쪽 사이드바를 Svelte 5와 데이터 기반으로 구현하기 위한 포괄적인 로드맵입니다. 핵심은 SidebarConfig 객체를 통한 모든 상태 및 동작 제어와 $state, $props, $derived, $effect 룬 및 #snippets, @render의 적절한 활용입니다.

이 계획에 대해 추가하거나 수정하고 싶은 부분이 있으신가요? 아니면 특정 단계에 대해 더 자세히 논의해 보고 싶으신가요? 예를 들어, "리사이즈 로직의 세부 사항"이나 "애니메이션 구현 방식"에 대해 더 깊이 들어갈 수 있습니다.
