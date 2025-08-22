import { invokeTauri, TauriInvokeError } from "$lib/tauri/utils";
import { Data, Effect } from "effect";

type VaultState = {
  path: string | null;
  isSet: boolean;
  isLoading: boolean;
  error: string | null;
};

export class VaultError extends Data.TaggedError("VaultError")<{
  message: string;
  cause?: unknown;
}> {}

const vaultState = $state<VaultState>({
  path: null,
  isSet: false,
  isLoading: true, // Initial loading state
  error: null,
});

const loadVaultPath = (): Effect.Effect<void, VaultError | TauriInvokeError> =>
  Effect.gen(function* () {
    vaultState.isLoading = true;
    vaultState.error = null;
    const path = yield* invokeTauri<string | null>("load_vault_path").pipe(
      Effect.mapError((cause) => {
        if (cause instanceof TauriInvokeError) {
          return new VaultError({
            message: `Failed to load vault path: ${cause.message}`,
            cause,
          });
        }
        return cause;
      }),
    );
    vaultState.path = path;
    vaultState.isSet = path !== null;
    vaultState.isLoading = false;
  });

const saveVaultPath = (path: string): Effect.Effect<void, VaultError | TauriInvokeError> =>
  Effect.gen(function* () {
    vaultState.isLoading = true;
    vaultState.error = null;
    yield* invokeTauri<void>("save_vault_path", { payload: { path } }).pipe(
      Effect.mapError((cause) => {
        if (cause instanceof TauriInvokeError) {
          return new VaultError({
            message: `Failed to save vault path: ${cause.message}`,
            cause,
          });
        }
        return cause;
      }),
    );
    vaultState.path = path;
    vaultState.isSet = true;
    vaultState.isLoading = false;
  });

export const VaultApi = {
  state: vaultState,
  loadVaultPath,
  saveVaultPath,
};