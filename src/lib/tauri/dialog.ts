import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { Data, Effect } from "effect";

// Error Types
export class DialogOperationError extends Data.TaggedError(
  "DialogOperationError",
)<{
  message: string;
  cause?: unknown;
}> {}

// Functions
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
