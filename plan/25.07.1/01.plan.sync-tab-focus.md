### **계획: 탭 포커스 동기화**

-   `[ ]` `TabbedPane` 컴포넌트에 `onValueChange` 이벤트 핸들러 추가
-   `[ ]` `EditorLayout`에서 `setActiveTab` 함수를 `TabbedPane`으로 전달

---

#### **1. `TabbedPane.svelte` 수정**

-   **목표**: 사용자가 UI에서 직접 탭을 클릭했을 때, 그 변경 사항이 전역 상태(`activeTabId`)에 반영되도록 합니다.
-   **작업 내용**:
    -   `TabbedPane.svelte`의 `<script>` 블록에 `setActiveTab: (id: string) => void` 함수를 props로 추가합니다.
    -   `<Tabs.Root>` 컴포넌트에 `onValueChange` 속성을 추가합니다. 이 속성의 값으로 `(id) => { if (id) setActiveTab(id); }` 와 같은 콜백 함수를 설정하여, 탭이 변경될 때마다 부모로부터 받은 `setActiveTab` 함수가 호출되도록 합니다.

#### **2. `EditorLayout.svelte` 수정**

-   **목표**: `TabbedPane`이 전역 상태를 업데이트할 수 있도록 `setActiveTab` 함수를 전달합니다.
-   **작업 내용**:
    -   `EditorLayout.svelte`의 `<script>` 블록에서 `useLayout()` 훅을 통해 `setActiveTab` 함수를 가져옵니다.
    -   `mainTabs`와 `sidebarTabs`를 렌더링하는 두 개의 `<TabbedPane>` 컴포넌트 각각에 `{setActiveTab}` prop을 전달합니다.

---

### **Gemini 개발 지시사항**

이 계획은 Gemini에 의해 실행됩니다.

- **체크리스트 업데이트**: 작업을 진행하면서 위에 제시된 `- [ ] 태스크` 형식의 체크리스트를 완료될 때마다 `- [x] 태스크`로 직접 업데이트해야 합니다.
- **완료 보고서 작성**:
  - 모든 태스크가 완료되면, 이 `[workname].plan.md` 파일과 함께 `[workname].complete.md` 형식의 작업 완료 보고서를 작성해주세요.
  - 보고서는 마크다운 Heading (`#`, `##`)을 사용하여 `plan.md`의 체크리스트 항목을 구조화하고, 각 항목 아래에 실제 코드 변경 내용(코드 블록), 구체적인 설명(변경 이유, 구현 이슈 및 해결 과정 등)을 상세히 포함해야 합니다.
  - 보고서는 변경 이력을 명확히 기록하고, 향후 코드 유지보수 및 이해에 도움이 되도록 한글로 작성되어야 합니다.