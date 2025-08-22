import { invoke } from "@tauri-apps/api/core";
import { Data, Effect } from "effect";

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