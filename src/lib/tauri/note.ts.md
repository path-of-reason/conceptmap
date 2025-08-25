# 온톨로지: `tauri/note.ts`

## 1. 핵심 개념

`tauri/note.ts` 파일은 프론트엔드에서 백엔드(Rust)의 노트 관련 Tauri 커맨드를 호출하기 위한 인터페이스를 제공합니다. `effect-ts` 라이브러리를 활용하여 비동기 작업 및 오류 처리를 함수형 방식으로 관리합니다.

- **`createNote` 함수**: 백엔드의 `create_note` 커맨드를 래핑하여 호출합니다. 노트 생성에 필요한 `title`, `content`, `parent_uuid`를 인자로 받으며, `VaultApi`를 통해 현재 활성화된 Vault 경로를 자동으로 주입합니다.
- **`Effect` 기반 비동기 처리**: 모든 Tauri 커맨드 호출은 `Effect` 타입으로 반환되어, `effect-ts`의 강력한 오류 처리 및 합성 기능을 활용할 수 있습니다.
- **`NoteOperationError`**: 파일 시스템 작업과 유사하게, 노트 관련 작업에서 발생할 수 있는 특정 오류(`Vault` 경로 없음 등)를 정의하여 명확한 오류 타입을 제공합니다.

## 2. 활용처 (Usage)

- **노트 생성 로직**: `lib/store/notes.svelte.ts`와 같은 상태 관리 스토어에서 `createNote` 함수를 호출하여 백엔드에 노트 생성 요청을 보냅니다.
- **오류 처리**: `Effect.runPromiseExit` 또는 `Effect.match`를 사용하여 `createNote` 호출 결과를 처리하고, 성공 시에는 생성된 `Note` 객체를, 실패 시에는 `NoteOperationError` 또는 `TauriInvokeError`를 통해 상세한 오류 정보를 얻을 수 있습니다.

## 3. 변경 이력

- **25.08.26**:
    - `createNote` 함수 초기 구현.
    - `effect-ts` 기반의 비동기 및 오류 처리 로직 적용.
    - `NoteOperationError` 정의 및 `invokeTauri`를 통한 백엔드 커맨드 호출.
