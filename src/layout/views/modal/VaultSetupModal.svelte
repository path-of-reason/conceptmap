<script lang="ts">
  import { LogApi } from "$lib/store/log.svelte";
  import { VaultApi } from "$lib/store/vault.svelte";
  import { TauriApi } from "$lib/tauri/api";
  import { Effect } from "effect";

  let selectedPath = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);

  const handleSelectFolder = () => {
    errorMessage = null;
    Effect.runPromise(TauriApi.dialog.selectNewVaultPath()).then((path) => {
      if (path) {
        selectedPath = path;
      } else {
        LogApi.info("Folder selection cancelled.");
      }
    }).catch((error) => {
      errorMessage = `Failed to select folder: ${error.message || error}`;
      LogApi.error("Folder selection error:", error);
    });
  };

  const handleSaveVault = () => {
    if (!selectedPath) {
      errorMessage = "Please select a folder first.";
      return;
    }
    errorMessage = null;
    Effect.runPromise(VaultApi.saveVaultPath(selectedPath)).then(() => {
      LogApi.info(`Vault path saved: ${selectedPath}`);
      // TODO: 모달 닫기 로직 (API.modal.closeModal() 호출)
      // 현재는 API.modal이 직접 임포트되지 않아 호출 불가. ModalApi 등록 시점에 처리 필요.
    }).catch((error) => {
      errorMessage = `Failed to save vault: ${error.message || error}`;
      LogApi.error("Vault save error:", error);
    });
  };

  // 모달이 열릴 때 기존 볼트 경로를 로드
  $effect(() => {
    if (!VaultApi.state.isSet && !VaultApi.state.isLoading) {
      Effect.runPromise(VaultApi.loadVaultPath()).catch((error) => {
        LogApi.error("Failed to load vault path on modal open:", error);
      });
    }
  });
</script>

<div class="w-[500px] max-w-[90vw] bg-zinc-800 border border-zinc-700 rounded-lg p-6 text-gray-100 shadow-lg">
  <h2 class="text-2xl font-bold mb-4">Set Your Vault Folder</h2>

  <p class="mb-4 text-gray-300">
    Please select the base folder where your Markdown notes will be stored.
    This will be your main knowledge vault.
  </p>

  <div class="flex items-center space-x-2 mb-4">
    <input
      type="text"
      placeholder="No folder selected"
      class="flex-1 py-2 px-3 rounded-md bg-zinc-700 border border-zinc-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      bind:value={selectedPath}
      readonly
    />
    <button
      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
      onclick={handleSelectFolder}
    >
      Select Folder
    </button>
  </div>

  {#if errorMessage}
    <p class="text-red-400 mb-4">{errorMessage}</p>
  {/if}

  <div class="flex justify-end space-x-2">
    <button
      class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold"
      onclick={() => {
        // TODO: 모달 닫기 로직 (API.modal.closeModal() 호출)
        // 현재는 API.modal이 직접 임포트되지 않아 호출 불가.
      }}
    >
      Cancel
    </button>
    <button
      class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
      onclick={handleSaveVault}
      disabled={!selectedPath}
    >
      Save Vault
    </button>
  </div>

  {#if VaultApi.state.isLoading}
    <p class="text-blue-400 mt-4">Loading vault status...</p>
  {/if}
</div>
