# 온톨로지: `hotkey.ts`

## 1. 핵심 개념

`hotkey.ts` 파일은 CodeMirror 에디터에서 사용될 커스텀 핫키를 정의합니다. React의 `useCustomHotkeys` 훅을 Svelte 환경에 맞게 변환하여, `uiVisibilityStore`와 같은 Svelte 스토어와 연동하여 UI 요소의 가시성을 토글하는 기능을 제공합니다.

- **핫키 정의**: CodeMirror의 `keymap.of` 확장에 전달될 핫키 객체 배열을 반환합니다.
- **Svelte 스토어 연동**: `uiVisibilityStore`에서 `toggleCommandPalette` 및 `toggleFileExplorer` 함수를 가져와 핫키 실행 시 호출합니다.

## 2. 활용처 (Usage)

- `Codemirror.svelte` 컴포넌트에서 `keymap.of` 확장의 일부로 사용되어 에디터에 커스텀 핫키 기능을 추가합니다.

## 3. 변경 이력

- **25.08.26**: React 기반의 `hotkey.ts`에서 Svelte 호환 버전으로 변환.
    - Zustand `useUiVisibilityStore` -> Svelte `uiVisibilityStore`로 교체.
