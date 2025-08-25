# 온톨로지: `Codemirror.svelte`

## 1. 핵심 개념

`Codemirror.svelte`는 CodeMirror 6 에디터를 Svelte 5 애플리케이션에 통합하는 핵심 컴포넌트입니다. 다양한 CodeMirror 확장(예: 마크다운 언어 지원, Vim 모드, 라이브 프리뷰 스타일링, 핫키)을 초기화하고 관리합니다. React의 `useRef`, `useEffect`, `useCallback`과 같은 훅을 Svelte 5의 `$props`, `$effect`, `bind:this`와 같은 런타임 함수 및 디렉티브로 변환하여 구현되었습니다.

- **CodeMirror 초기화**: 컴포넌트 마운트 시 `EditorView` 인스턴스를 생성하고, `initialDoc` 프롭을 사용하여 초기 문서 내용을 설정합니다.
- **확장 통합**: `vim()`, `lpStyle`, `theme`, `markdown` 등 다양한 CodeMirror 확장들을 `EditorState`에 추가하여 에디터의 기능을 확장합니다.
- **문서 변경 감지**: `EditorView.updateListener`를 통해 에디터 내용 변경을 감지하고, `onDocChange` 콜백을 통해 부모 컴포넌트에 변경된 문서 내용을 전달합니다.
- **프롭 반응성**: `initialDoc` 프롭이 변경될 때 에디터의 내용을 업데이트하는 로직을 `$effect`를 사용하여 구현합니다.

## 2. 활용처 (Usage)

- `Workspace.svelte`와 같은 상위 컴포넌트에서 마크다운 에디터 기능을 제공하기 위해 사용됩니다.

## 3. 변경 이력

- **25.08.26**: `Codemirror.tsx`에서 `Codemirror.svelte`로 마이그레이션.
    - React 훅(`useRef`, `useEffect`, `useCallback`) -> Svelte 5 `$props`, `$effect`, `bind:this`로 변경.
    - CodeMirror 초기화 및 확장 통합 로직 Svelte 5 문법으로 재작성.
