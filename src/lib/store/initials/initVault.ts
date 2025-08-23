import { VaultApi } from "$lib/store/vault.svelte";
import { API } from "$lib/store/api";
import { CMDKEYS } from "$lib/constant/commandKey";

export const initVault = async () => {
  await API.vault.fetchVaultPath();
  if (!VaultApi.state.isSet)
    API.command.executeCommand(CMDKEYS.LAYOUT.MODAL.OPEN_VAULT_SETUP);
};
