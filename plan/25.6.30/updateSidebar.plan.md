### 프로젝트명 및 기술 스택

* **프로젝트명**: update shadcn sidebar
* **모듈명**: Main Layout, Two-Way Sidebar
* **기술 스택**: `[Svelte 5, SvelteKit, TypeScript, Shadcn Svelte (Sidebar components), Tailwind CSS]`

### 현재 상황 및 목표

현재 Shadcn Svelte의 사이드바는 단일 방향(좌 또는 우)으로 한정된 컨텍스트를 제공합니다. 목표는 `Sidebar.Provider`를 중첩 배치하고, 각각의 `Sidebar.Root` 인스턴스에 독립적인 상태 및 단축키 제어 기능을 부여하여 왼쪽과 오른쪽 사이드바를 동시에 유연하게 운용할 수 있는 레이아웃 아키텍처를 구축하는 것입니다.

### 제약 조건 및 가정

* `Sidebar.Provider`는 병렬 배치가 아닌 중첩 배치되어야 합니다.
* 각 사이드바는 독립적으로 열리고 닫힐 수 있으며, 별도의 단축키로 제어됩니다.
---

### 계획 (Tasks Checklist)

-   [ ] **1. Shadcn Sidebar 핵심 컴포넌트 분석 및 준비**
    * [ ] `Sidebar.Provider`와 `useSidebar` 훅의 내부 컨텍스트 관리 방식 파악.
    * [ ] 필요시 Shadcn Sidebar 컴포넌트 파일들을 로컬 프로젝트로 복사하여 수정 준비.
-   [ ] **2. 양방향 사이드바 컨텍스트 공급자 설계**
    * [ ] `LeftSidebarProvider.svelte`와 `RightSidebarProvider.svelte` 컴포넌트 생성.
    * [ ] 각 Provider가 고유한 Svelte 5 `$state` 기반의 사이드바 상태를 `Symbol` 키로 `setContext`를 통해 제공하도록 구현.
-   [ ] **3. 애플리케이션 메인 레이아웃 구조화**
    * [ ] 최상위 레이아웃 (`+layout.svelte`)에서 `<LeftSidebarProvider>` 내부에 `<RightSidebarProvider>`를 중첩 배치.
    * [ ] 메인 콘텐츠 영역을 가장 안쪽 Provider 내에 포함.
-   [ ] **4. 독립적인 사이드바 인스턴스 구현**
    * [ ] `LeftAppSidebar.svelte` 및 `RightAppSidebar.svelte` 컴포넌트 생성.
    * [ ] 각 `AppSidebar` 컴포넌트 내에서 `Sidebar.Root` 컴포넌트를 사용하고, `side` prop 및 해당 컨텍스트를 활용하여 상태 제어.
-   [ ] **5. 맞춤형 트리거 및 전역 단축키 로직 구현**
    * [ ] 각 사이드바를 위한 커스텀 트리거 컴포넌트 (예: `LeftSidebarTrigger`, `RightSidebarTrigger`) 개발.
    * [ ] Svelte 5 `$effect`를 활용하여 각 사이드바에 할당된 단축키(`cmd+l`, `cmd+r` 등)가 해당 사이드바를 토글하도록 전역 이벤트 리스너 구현.
-   [ ] **6. 시각적 스타일 및 반응형 레이아웃 조정**
    * [ ] 각 `Sidebar.Provider`에 CSS 변수 (`--sidebar-width`)를 사용하여 개별 너비 설정.
    * [ ] 두 사이드바가 동시에 열릴 때 메인 콘텐츠 영역의 레이아웃(겹침 방지 등)이 올바르게 동작하도록 CSS/Tailwind 규칙 검토.
-   [ ] **7. 핵심 기능 검증**
    * [ ] 각 사이드바의 독립적인 열림/닫힘 및 단축키 동작 확인.
    * [ ] 두 사이드바가 동시에 열렸을 때의 레이아웃 안정성 확인.

---

### 계획 상세 설명 (Report)

**1. Shadcn Sidebar 핵심 컴포넌트 분석 및 준비**
Shadcn Svelte의 Sidebar 컴포넌트가 컨텍스트를 어떻게 제공하고 소비하는지 `Sidebar.Provider` 및 `useSidebar` 훅의 구현 방식을 파악합니다. 필요하다면 이 컴포넌트 파일들을 로컬 프로젝트로 복사하여 향후 커스터마이징을 용이하게 준비합니다.

**2. 양방향 사이드바 컨텍스트 공급자 설계**
왼쪽과 오른쪽 사이드바를 위해 각각 `LeftSidebarProvider.svelte`와 `RightSidebarProvider.svelte`라는 독립적인 컴포넌트를 정의합니다. 이 Provider들은 Svelte 5의 `$state`를 사용하여 자신만의 고유한 `isOpen` 상태와 `toggle()` 함수를 관리합니다. 이 상태와 함수들은 `Symbol`로 정의된 고유한 컨텍스트 키(`LEFT_SIDEBAR_CONTEXT_KEY`, `RIGHT_SIDEBAR_CONTEXT_KEY` 등)를 통해 `setContext`로 하위 컴포넌트에 노출됩니다.

**3. 애플리케이션 메인 레이아웃 구조화**
애플리케이션의 최상위 레이아웃을 담당하는 `src/routes/+layout.svelte` 파일에서 Provider를 중첩하는 방식을 사용합니다. `<LeftSidebarProvider>`가 전체 앱을 감싸고, 그 내부에 `<RightSidebarProvider>`를 배치합니다. 애플리케이션의 주요 콘텐츠 (`<main>` 태그와 `{@render children?.()}`)는 `<RightSidebarProvider>` 내부에 위치하게 되어 양쪽 사이드바 컨텍스트에 모두 접근할 수 있게 됩니다.

**4. 독립적인 사이드바 인스턴스 구현**
실제 사이드바 UI를 렌더링할 `LeftAppSidebar.svelte`와 `RightAppSidebar.svelte` 컴포넌트를 각각 생성합니다. 이 컴포넌트들은 Shadcn의 `Sidebar.Root`를 사용하되, 각각 `side="left"`와 `side="right"` prop을 명시합니다. 각 `AppSidebar` 컴포넌트는 `getContext`를 통해 자신이 속한 Provider의 독립적인 사이드바 상태를 가져와 `Sidebar.Root` 컴포넌트에 연결함으로써, 각 사이드바가 개별적으로 제어되도록 합니다.

**5. 맞춤형 트리거 및 전역 단축키 로직 구현**
Shadcn의 기본 `Sidebar.Trigger` 대신, 각 사이드바에 특화된 커스텀 트리거 컴포넌트를 만듭니다. 이 트리거들은 `getContext`를 사용하여 해당 사이드바의 컨텍스트를 참조하고 `toggle()` 함수를 호출합니다. 또한, Svelte 5의 `$effect`를 활용하여 전역 키보드 이벤트 리스너를 설정하고, `cmd+l`, `cmd+r`과 같은 정의된 단축키 입력에 따라 각 사이드바의 `toggle()` 함수를 호출하는 로직을 구현합니다.

**6. 시각적 스타일 및 반응형 레이아웃 조정**
`Sidebar.Provider`의 `style` prop을 활용하여 각 사이드바 인스턴스에 `--sidebar-width`와 `--sidebar-width-mobile` CSS 변수를 개별적으로 적용하여 너비를 조절합니다. 두 사이드바가 동시에 활성화될 경우 메인 콘텐츠 영역이 적절하게 축소되거나 배치되도록 Tailwind CSS와 필요에 따라 커스텀 CSS 규칙을 사용하여 전체 레이아웃의 반응성을 보장합니다.

**7. 핵심 기능 검증**
계획된 기능이 제대로 동작하는지 확인하기 위해 기본적인 테스트를 수행합니다. 왼쪽/오른쪽 사이드바의 독립적인 열림/닫힘 기능, 할당된 단축키의 정상 작동 여부, 그리고 두 사이드바가 동시에 열렸을 때 UI 겹침이나 레이아웃 문제가 없는지 중점적으로 확인합니다.

---

**개발지시사항**

작업 진행 시 체크리스트 업데이트: 개발자 AI는 작업을 진행하면서 위에 제시된 `- [ ] 태스크` 형식의 체크리스트를 완료될 때마다 `- [x] 태스크`로 직접 업데이트해야 합니다.
완료 보고서 작성 가이드:
* 모든 태스크가 완료되면, 이 `[workname].plan.md` 파일과 함께 `[workname].complete.md` 형식의 작업 완료 보고서를 작성해주세요.
* `[workname].complete.md` 보고서 구조:
    * 마크다운 Heading (`#`, `##`, `###` 등)을 사용하여 `[workname].plan.md`의 체크리스트 항목들을 구조화합니다.
    * 각 Heading 아래에 해당 태스크에 대한 실제 코드 변경 내용이 담긴 코드 블록과 구체적인 설명(어떤 변경을 왜 했는지, 구현 과정에서 발생한 이슈 및 해결 방법, 최종 결과는 무엇인지 등)을 상세히 포함해야 합니다.
    * 이 보고서는 변경 이력을 명확히 기록하고, 향후 코드 유지보수 및 이해에 도움이 되도록 한글로 작성되어야 합니다.
    * 이 보고서는 커밋메시지로 사용되지 않습니다.
