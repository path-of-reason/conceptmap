import { Data, Effect } from "effect";
import { invokeTauri, TauriInvokeError } from "./utils";

// Tauri 커맨드 이름 상수
const INVOKE = {
  READ: {
    DIR: "read_directory",
    DIR_RECURSIVE: "read_dir_recursive",
    FILE: "read_file",
    FILE_BASE64: "read_file_base64",
  },
  WRITE_FILE: "write_file",
};

// Error Types
export class FileOperationError extends Data.TaggedError("FileOperationError")<{
  operation: "read" | "write" | "read_dir";
  path: string;
  message: string;
  cause?: unknown;
}> {}

// Types
export type DirEntryRecursive = DirEntry & {
  children?: DirEntryRecursive[];
};
export type DirEntry = {
  name: string;
  path: string;
  is_dir: boolean;
};

// Functions
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

export const readDirRecursive = (
  pathStr: string,
): Effect.Effect<DirEntryRecursive[], FileOperationError | TauriInvokeError> =>
  invokeTauri<DirEntryRecursive[]>(INVOKE.READ.DIR_RECURSIVE, {
    pathStr,
  }).pipe(
    Effect.mapError((cause) => {
      if (cause instanceof TauriInvokeError) {
        return new FileOperationError({
          operation: "read_dir",
          path: pathStr,
          message: `Failed to read directory recursively at "${pathStr}": ${cause.message}`,
          cause,
        });
      }
      return cause;
    }),
  );

export const readFile = (
  filePath: string,
  encodeBase64: boolean = false,
): Effect.Effect<string, FileOperationError | TauriInvokeError> =>
  invokeTauri<string>(
    encodeBase64 ? INVOKE.READ.FILE_BASE64 : INVOKE.READ.FILE,
    {
      path: filePath,
    },
  ).pipe(
    Effect.mapError((cause) => {
      if (cause instanceof TauriInvokeError) {
        return new FileOperationError({
          operation: "read",
          path: filePath,
          message: `Failed to read file at "${filePath}": ${cause.message}`,
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
