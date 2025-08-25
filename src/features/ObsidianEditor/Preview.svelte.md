# 온톨로지: `Preview.svelte`

## 1. 핵심 개념

`Preview.svelte`는 마크다운 텍스트를 HTML로 변환하여 표시하는 Svelte 컴포넌트입니다. `marked.js` 라이브러리를 사용하여 마크다운을 파싱하고, Svelte 5의 `$derived` 런타임 함수를 통해 `markdownText` 프롭의 변경에 반응하여 `htmlContent`를 업데이트합니다. `{@html}` 디렉티브를 사용하여 변환된 HTML을 DOM에 안전하게 삽입합니다.

- **마크다운 렌더링**: `marked.js`를 사용하여 마크다운 문자열을 HTML로 변환합니다.
- **반응형 업데이트**: `$derived`를 사용하여 `markdownText` 프롭이 변경될 때마다 미리보기 내용이 자동으로 갱신됩니다.
- **HTML 삽입**: `{@html}` 디렉티브를 사용하여 파싱된 HTML을 DOM에 직접 삽입합니다. (XSS 공격에 대한 주의 필요)

## 2. 활용처 (Usage)

- `Workspace.svelte`와 같은 상위 컴포넌트에서 `markdownText` 프롭을 전달하여 마크다운 미리보기를 표시하는 데 사용됩니다.

## 3. 변경 이력

- **25.08.26**: `Preview.tsx`에서 `Preview.svelte`로 마이그레이션.
    - React `useState`, `useEffect` -> Svelte 5 `$derived`로 변경.
    - `dangerouslySetInnerHTML` -> `{@html}` 디렉티브로 변경.
