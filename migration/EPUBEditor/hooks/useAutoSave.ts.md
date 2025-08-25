# 온톨로지: `useAutoSave.ts`

다시만들어야겟다. 엉망이네
## 1. 핵심 개념

`useAutoSave.ts` 파일은 에디터의 자동 저장 기능을 제공하는 Svelte 5 호환 함수입니다. React의 `useAutoSave` 훅을 Svelte 5의 `$state`, `$effect` 런타임 함수 및 Svelte 스토어(`editorContentStore`)를 활용하여 재작성되었습니다. 콘텐츠 변경 디바운싱, 블러 시 즉시 저장, 애플리케이션 종료 전 저장 처리 등의 기능을 수행합니다.

- **상태 관리**: `isAutoSaving`, `lastAutoSaveTime`과 같은 자동 저장 관련 상태를 `$state`로 관리합니다.
- **라이프사이클 관리**: `$effect`를 사용하여 컴포넌트 마운트/언마운트 시 이벤트 리스너 설정 및 해제, 디바운스 타이머 관리 등을 수행합니다.
- **`editorContentStore` 연동**: `editorContentStore`의 상태를 구독하고, `saveCurrentFile`과 같은 액션을 호출하여 에디터 콘텐츠의 저장 로직과 통합됩니다.
- **Tauri 윈도우 이벤트 처리**: `getCurrentWindow().onCloseRequested` 이벤트를 처리하여 애플리케이션 종료 시 미저장 변경 사항을 자동으로 저장합니다.

## 2. 활용처 (Usage)

- 에디터 컴포넌트(예: `Workspace.svelte`)에서 호출되어 자동 저장 기능을 활성화하고, `handleContentChange`, `handleBlur`, `forceSave`와 같은 함수를 에디터 이벤트에 연결합니다.

## 3. 변경 이력

- **25.08.26**: React 기반의 `hooks/useAutoSave.ts`에서 Svelte 5 호환 버전으로 재작성.
    - React 훅(`useState`, `useRef`, `useEffect`, `useCallback`) -> Svelte 5 `$state`, `$effect`로 변경.
    - Zustand `useEditorContentStore` -> Svelte `editorContentStore`로 교체.
    - Tauri 윈도우 이벤트 처리 로직 Svelte 5 문법으로 재작성.
