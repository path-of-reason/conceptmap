import { invoke } from "@tauri-apps/api/core";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { Data } from "effect";

// Tauri 커맨드 이름 상수
export const INVOKE = {
  GREET: "greet",
  READ: {
    DIR: "read_directory",
    DIR_RECURSIVE: "read_dir_recursive",
    FILE: "read_file",
    FILE_BASE64: "read_file_base64",
  },
  WRITE_FILE: "write_file",
  EXECUTE_COMMAND: "execute_command",
  START_PTY: "start_pty_session_interactive",
  STOP_PTY: "stop_pty_session_interactive",
  WRITE_PTY: "write_pty",
  RESIZE_PTY: "resize_pty",
};

// Error Types
export class TauriError extends Data.TaggedError("TauriError")<{
  message: string;
  cause?: unknown;
}> {}

export class TauriInvokeError extends Data.TaggedError("TauriInvokeError")<{
  command: string;
  message: string;
  cause?: unknown;
}> {}

export class PtyError extends Data.TaggedError("PtyError")<{
  operation: "start" | "stop" | "write" | "resize";
  message: string;
  cause?: unknown;
}> {}

export class FileOperationError extends Data.TaggedError("FileOperationError")<{
  operation: "read" | "write" | "read_dir";
  path: string;
  message: string;
  cause?: unknown;
}> {}

export class DialogOperationError extends Data.TaggedError(
  "DialogOperationError",
)<{
  message: string;
  cause?: unknown;
}> {}

// export const TAURI_COMMAND_CONVERT_MARKDOWN_TO_HTML = "convert_markdown_to_html";

export type DirEntryRecursive = DirEntry & {
  children?: DirEntryRecursive[];
};
export type DirEntry = {
  name: string;
  path: string;
  is_dir: boolean;
};

export const startPty = (proposed: {
  cols: number;
  rows: number;
}): Effect.Effect<void, PtyError | TauriInvokeError> =>
  invokeTauri<void>(INVOKE.START_PTY, {
    initialCols: proposed.cols,
    initialRows: proposed.rows,
  }).pipe(
    Effect.mapError((cause) => {
      if (cause instanceof TauriInvokeError) {
        return new PtyError({
          operation: "start",
          message: `Failed to start PTY session: ${cause.message}`,
          cause,
        });
      }
      return cause; // Should not happen if invokeTauri is typed correctly
    }),
  );

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

export const selectNewVaultPath = (): Effect.Effect<
  string | null,
  DialogOperationError
> =>
  Effect.tryPromise({
    try: async () => {
      const selectedPath = await openDialog({
        directory: true,
        multiple: false,
      });
      return selectedPath; // selectedPath can be string or null
    },
    catch: (error) =>
      new DialogOperationError({
        message: "Failed to open directory dialog",
        cause: error,
      }),
  });

export const executeTerminalCommand = (
  terminalCommand: string,
): Effect.Effect<void, TauriInvokeError> => // Renamed arg
  invokeTauri<void>(INVOKE.EXECUTE_COMMAND, {
    command: terminalCommand,
  });

import { Effect } from "effect";

// 공통 invoke 함수
export const invokeTauri = <T>(
  command: string,
  args?: Record<string, any>,
): Effect.Effect<T, TauriInvokeError> =>
  Effect.tryPromise({
    try: () => invoke<T>(command, args),
    catch: (error) =>
      new TauriInvokeError({
        command,
        message: `Failed to invoke Tauri command "${command}"`,
        cause: error,
      }),
  });
