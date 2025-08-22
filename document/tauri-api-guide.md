# Tauri 백엔드 통신 모듈 작성 가이드

이 문서는 Tauri 백엔드와 안전하고 효율적으로 통신하기 위한 `TauriApi` 모듈 작성 가이드라인을 제공합니다. `src/lib/tauri/api.ts`는 모든 Tauri 백엔드 통신 기능의 단일 진입점 역할을 하며, 각 기능 도메인(예: 파일 시스템, 다이얼로그)은 별도의 모듈로 분리하여 관리됩니다.

## 핵심 원칙

1.  **모듈화**: 파일 시스템(`fs`), 다이얼로그(`dialog`) 등 기능 도메인별로 별도의 TypeScript 모듈 파일(`src/lib/tauri/[기능명].ts`)을 생성합니다.
2.  **단일 진입점 (`TauriApi`)**: 모든 개별 모듈은 `src/lib/tauri/api.ts` 파일에서 `TauriApi` 객체로 통합되어 애플리케이션 전반에서 일관된 접근 방식을 제공합니다.
3.  **`invokeTauri` 유틸리티 활용**: 실제 Tauri `invoke` 호출은 `src/lib/tauri/utils.ts`에 정의된 `invokeTauri` 유틸리티 함수를 통해 추상화하여 일관된 에러 처리와 타입 안정성을 확보합니다.
4.  **명령어 이름 상수화**: 백엔드 커맨드 이름은 각 모듈 내에서 상수로 정의하여 관리의 용이성과 오타 방지 효과를 얻습니다.
5.  **강력한 타입 및 에러 처리**: `effect` 라이브러리를 활용하여 비동기 작업의 결과와 잠재적 에러를 명확하게 타입화하고 처리합니다.

---

## Tauri 백엔드 통신 모듈 작성 방법

`src/lib/tauri/fs.ts`를 예시로 모듈 작성 단계를 설명합니다.

### 1단계: 새 모듈 파일 생성

-   `src/lib/tauri/` 디렉터리 내에 새로운 기능 도메인에 해당하는 TypeScript 파일(`[기능명].ts`)을 생성합니다. (예: `src/lib/tauri/fs.ts`)

### 2단계: Tauri 커맨드 이름 정의

-   해당 모듈에서 호출할 Tauri 백엔드 커맨드 이름을 상수로 정의합니다. 이는 백엔드(Rust)에서 정의된 `#[tauri::command]` 함수의 이름과 일치해야 합니다.

```typescript
// src/lib/tauri/fs.ts

const INVOKE = {
  READ: {
    DIR: "read_directory",
    DIR_RECURSIVE: "read_dir_recursive",
    FILE: "read_file",
    FILE_BASE64: "read_file_base64",
  },
  WRITE_FILE: "write_file",
};
```

### 3단계: 타입 정의

-   백엔드 함수와 주고받을 데이터의 타입을 명확하게 정의합니다. 이는 타입 안정성을 보장하고 코드 가독성을 높입니다.

```typescript
// src/lib/tauri/fs.ts

export type DirEntryRecursive = DirEntry & {
  children?: DirEntryRecursive[];
};
export type DirEntry = {
  name: string;
  path: string;
  is_dir: boolean;
};

// 에러 타입 정의 (Effect 라이브러리 활용)
export class FileOperationError extends Data.TaggedError("FileOperationError")<{
  operation: "read" | "write" | "read_dir";
  path: string;
  message: string;
  cause?: unknown;
}> {}
```

### 4단계: `invokeTauri`를 사용한 함수 작성 및 에러 처리

-   `invokeTauri` 유틸리티 함수를 사용하여 백엔드 커맨드를 호출하는 함수를 작성합니다.
-   `Effect.Effect<SuccessType, ErrorType>` 타입을 사용하여 성공 시 반환될 값과 발생할 수 있는 에러를 명확히 정의합니다.
-   `Effect.mapError`를 사용하여 `TauriInvokeError`를 모듈의 특정 에러 타입(예: `FileOperationError`)으로 변환하여 더 상세한 에러 정보를 제공합니다.

```typescript
// src/lib/tauri/fs.ts
import { Data, Effect } from "effect";
import { invokeTauri, TauriInvokeError } from "./utils"; // invokeTauri 임포트

export const readDirectory = (
  path: string,
): Effect.Effect<DirEntry[], FileOperationError | TauriInvokeError> =>
  invokeTauri<DirEntry[]>(INVOKE.READ.DIR, { path }).pipe(
    Effect.mapError((cause) => {
      if (cause instanceof TauriInvokeError) {
        return new FileOperationError({
          operation: "read_dir",
          path,
          message: `Failed to read directory at "${path}": ${cause.message}`,
          cause,
        });
      }
      return cause;
    }),
  );

export const writeFile = (
  filePath: string,
  contents: string,
): Effect.Effect<void, FileOperationError | TauriInvokeError> =>
  invokeTauri<void>(INVOKE.WRITE_FILE, {
    path: filePath,
    contents,
  }).pipe(
    Effect.mapError((cause) => {
      if (cause instanceof TauriInvokeError) {
        return new FileOperationError({
          operation: "write",
          path: filePath,
          message: `Failed to write file at "${filePath}": ${cause.message}`,
          cause,
        });
      }
      return cause;
    }),
  );
```

### 5단계: `TauriApi`에 모듈 통합

-   새로 작성한 모듈을 `src/lib/tauri/api.ts` 파일로 임포트하고, `TauriApi` 객체에 추가하여 애플리케이션 전역에서 접근할 수 있도록 합니다.

```typescript
// src/lib/tauri/api.ts

import * as fs from "./fs";
import * as dialog from "./dialog";
// ... 다른 모듈 임포트

/**
 * Tauri 백엔드와 통신하는 모든 API의 단일 진입점.
 * 애플리케이션의 다른 부분에서는 이 객체를 통해서만 Tauri 기능에 접근해야 합니다.
 */
export const TauriApi = {
  fs, // 새로 추가한 fs 모듈
  dialog,
  // ...
};
```

## 결론

이 가이드라인을 따르면 Tauri 백엔드 통신 코드를 모듈화하고, 타입 안정성을 확보하며, 일관된 에러 처리 방식을 적용할 수 있습니다. 이는 코드의 유지보수성을 높이고 개발 효율성을 증대시킬 것입니다.
