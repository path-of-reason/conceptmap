# workspace.svelte.ts

## 핵심 개념 (Core Concept)
애플리케이션의 핵심 작업 공간(Workspace)의 상태와 동작을 총괄하는 Svelte 5 스토어입니다. 탭(Tab)과 그리드 셀(GridCell)의 상태, 그리고 이들로 구성된 전체 워크스페이스 레이아웃을 관리합니다. 탭 추가/제거, 셀 분할/병합/포커스 이동 등 작업 공간과 관련된 모든 핵심 로직을 포함하는 `WorkspaceApi`를 제공합니다.

## 변경 이력 (Change History)
- **2025-08-20**: `workspace.svelte.ts` 파일의 기능별 분할. `store.svelte.ts`, `tab.ts`, `panel.ts`, `focus.ts`, `resize.ts`, `actions.ts`, `utils.ts` 파일로 기능이 분리되었으며, `index.ts`는 이들을 통합하는 역할을 합니다.
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")