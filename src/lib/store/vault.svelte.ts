import { Effect, Exit, Cause } from "effect";
import { TauriApi } from "$lib/tauri/api";

const vaultState = $state<{
  vaults: string[];
  path: string | null;
  isSet: boolean;
  loading: boolean;
  error: string | null;
}>({
  vaults: [],
  path: null,
  isSet: false,
  loading: false,
  error: null,
});

/** vaults 상태 배열을 설정합니다. */
const setVaults = (vaults: string[]) => (vaultState.vaults = vaults);

/** 현재 볼트 경로 및 상태(isSet, error)를 갱신합니다. */
const setVaultPath = (path: string | null) => {
  vaultState.path = path;
  vaultState.isSet = !!path;
  vaultState.error = null;
};

/** 로딩 상태를 변경합니다. */
const setLoading = (loading: boolean) => (vaultState.loading = loading);

/** 에러 메시지를 셋팅합니다. */
const setError = (e: any) => (vaultState.error = e?.message ?? String(e));

/** 백엔드에서 vault 목록과 현재 path를 fetch해 상태를 갱신합니다. */
const fetchVaultPath = async () => {
  setLoading(true);
  const exit = await Effect.runPromiseExit(
    TauriApi.vault.loadVaultsAndCurrent(),
  );
  Exit.match(exit, {
    onSuccess: ({ vaults, current }) => {
      setVaults(vaults);
      setVaultPath(current ?? null);
    },
    onFailure: (cause) => {
      setError(Cause.prettyErrors(cause));
    },
  });
  setLoading(false);
};

/** vault 목록에 새 경로를 추가하고 백엔드에 반영합니다. */
const addVault = async (path: string) => {
  if (vaultState.vaults.includes(path)) return;
  setLoading(true);
  const exit = await Effect.runPromiseExit(TauriApi.vault.addVault(path));
  Exit.match(exit, {
    onSuccess: () => {
      vaultState.vaults.push(path);
      // 추가한 볼트를 current로 지정하고 싶으면 setVaultPath(path) 호출
    },
    onFailure: (cause) => setError(Cause.prettyErrors(cause)),
  });
  setLoading(false);
};

/** vault 목록·백엔드에서 해당 경로를 삭제하고, 현재 선택된 볼트면 path도 초기화합니다. */
const removeVault = async (path: string) => {
  setLoading(true);
  const exit = await Effect.runPromiseExit(TauriApi.vault.removeVault(path));
  Exit.match(exit, {
    onSuccess: () => {
      vaultState.vaults = vaultState.vaults.filter((p) => p !== path);
      if (vaultState.path === path) setVaultPath(null);
    },
    onFailure: (cause) => setError(Cause.prettyErrors(cause)),
  });
  setLoading(false);
};

/** 현재 선택된 볼트 path를 백엔드에 저장하고 상태도 갱신합니다. */
const saveVaultPathToBackend = async (path: string) => {
  setLoading(true);
  const exit = await Effect.runPromiseExit(
    TauriApi.vault.setCurrentVault(path),
  );
  Exit.match(exit, {
    onSuccess: () => setVaultPath(path),
    onFailure: (cause) => setError(Cause.prettyErrors(cause)),
  });
  setLoading(false);
};

/** vault 상태 값을 모두 초기화합니다. */
const reset = () => {
  vaultState.vaults = [];
  vaultState.path = null;
  vaultState.isSet = false;
  vaultState.loading = false;
  vaultState.error = null;
};

export const VaultApi = {
  state: vaultState,
  fetchVaultPath,
  addVault,
  setVaults,
  removeVault,
  setVaultPath,
  setLoading,
  setError,
  saveVaultPathToBackend,
  reset,
};
