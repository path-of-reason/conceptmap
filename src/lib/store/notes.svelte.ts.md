# 온톨로지: `store/notes.svelte.ts`

## 1. 핵심 개념

`store/notes.svelte.ts` 파일은 Svelte 5의 `$state` 런타임 기능을 활용하여 애플리케이션의 노트 목록 상태를 중앙에서 관리합니다. 프론트엔드에서 노트 데이터를 추가, 조회, 업데이트하는 로직을 캡슐화하며, 백엔드 API 호출과 UI 업데이트를 연결하는 역할을 합니다.

- **`notesState`**: `$state` 런타임으로 선언된 객체로, 현재 로드된 노트 목록(`Note[]`), 로딩 상태(`loading`), 발생한 오류 메시지(`error`)를 포함합니다. Svelte의 반응성 시스템과 통합되어 상태 변경 시 UI가 자동으로 업데이트됩니다.
- **`addNote` 함수**: 새로운 노트를 생성하기 위한 비즈니스 로직을 담당합니다. `lib/tauri/note.ts`의 `createNote` 함수를 호출하여 백엔드에 요청을 보내고, 성공적으로 생성된 노트를 `notesState.notes` 배열에 추가합니다.
- **오류 및 로딩 상태 관리**: API 호출 중 로딩 상태를 표시하고, 오류 발생 시 사용자에게 피드백을 제공하기 위한 상태를 관리합니다.

## 2. 활용처 (Usage)

- **노트 생성 UI**: `NoteEditor.svelte`와 같은 컴포넌트에서 `NotesApi.addNote` 함수를 호출하여 사용자의 입력값을 기반으로 새 노트를 생성합니다.
- **노트 목록 표시**: `notesState.notes`를 구독하여 현재 애플리케이션에 존재하는 노트 목록을 UI에 렌더링합니다.
- **피드백 제공**: `notesState.loading`과 `notesState.error`를 사용하여 사용자에게 비동기 작업의 진행 상황과 결과를 시각적으로 피드백합니다.

## 3. 변경 이력

- **25.08.26**:
    - `notesState` `$state` 객체 및 `addNote` 함수 초기 구현.
    - `lib/tauri/note.ts`의 `createNote`와 연동하여 노트 생성 및 상태 업데이트 로직 추가.
