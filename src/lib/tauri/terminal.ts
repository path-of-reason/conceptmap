import { Data, Effect } from "effect";
import { invokeTauri, TauriInvokeError } from "./utils";

// Tauri 커맨드 이름 상수
const INVOKE = {
  EXECUTE_COMMAND: "execute_command",
  START_PTY: "start_pty_session_interactive",
  STOP_PTY: "stop_pty_session_interactive",
  WRITE_PTY: "write_pty",
  RESIZE_PTY: "resize_pty",
};

// Error Types
export class PtyError extends Data.TaggedError("PtyError")<{
  operation: "start" | "stop" | "write" | "resize";
  message: string;
  cause?: unknown;
}> {}

// Functions
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

export const executeTerminalCommand = (
  terminalCommand: string,
): Effect.Effect<void, TauriInvokeError> =>
  invokeTauri<void>(INVOKE.EXECUTE_COMMAND, {
    command: terminalCommand,
  });
