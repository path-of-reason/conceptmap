<script lang="ts">
  import { LogApi } from "$lib/store/log.svelte";
  import { TauriApi } from "$lib/tauri/api";
  import { Effect } from "effect";
  import { API } from "$lib/store/api";

  let selectedPath = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);

  const dialogNewVaultPath = () => {
    errorMessage = null;
    Effect.runPromise(TauriApi.dialog.selectNewVaultPath())
      .then((path) => {
        if (path) {
          selectedPath = path;
          API.vault.addVault(path);
          errorMessage = null;
        } else {
          LogApi.info("Folder selection cancelled.");
        }
      })
      .catch((error) => {
        errorMessage = `Failed to select folder: ${error.message || error}`;
        LogApi.error("Folder selection error:", error);
      });
  };

  const setCurrentVaultPath = (path: string) => () => {
    API.vault.setVaultPath(path);
    Effect.runPromise(TauriApi.vault.setCurrentVault(path))
      .then(() => {
        LogApi.info(`Vault path saved: ${path}`);
      })
      .catch((error) => {
        errorMessage = `${error.message || error}`;
        LogApi.error("Vault save error:", error);
      });
  };

  $effect(() => {
    if (!API.vault.state.isSet && !API.vault.state.loading) {
      Effect.runPromise(TauriApi.vault.loadVaultsAndCurrent())
        .then(({ vaults, current }) => {
          API.vault.setVaults(vaults);
          API.vault.setVaultPath(current ?? null);
        })
        .catch((error) => {
          LogApi.error("Failed to load vault path on modal open:", error);
        });
    }
  });
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
  <div
    class="w-full max-w-3xl min-w-[900px] h-[min(70vh,600px)] flex rounded-xl shadow-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
  >
    <aside class="w-1/3 border-r border-zinc-800 flex flex-col">
      <h2
        class="text-lg font-semibold p-5 border-b border-zinc-800 text-gray-100"
      >
        Vault 목록
      </h2>
      <ul class="flex-1 overflow-y-auto p-3 space-y-1">
        {#each API.vault.state.vaults as vault, index (vault)}
          <li
            class={[
              "px-3 py-2 rounded-md hover:bg-zinc-800 cursor-pointer mb-1 last:mb-0",
              API.vault.state.path === vault && "bg-blue-900",
            ]}
          >
            <button class="w-full h-full" onclick={setCurrentVaultPath(vault)}>
              <div class="truncate text-white font-bold text-left">
                {vault.split("/").at(-1)}
              </div>
              <div class="text-xs text-gray-400 truncate text-left">
                {vault}
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </aside>

    <main class="w-2/3 p-8 flex flex-col justify-between bg-zinc-900">
      <div>
        <h2 class="text-2xl font-bold mb-2 text-gray-100">
          Knowledge Vault 폴더 지정
        </h2>
        <p class="mb-6 text-gray-300 text-base">
          노트가 저장될 폴더를 선택하세요.<br />
          <span class="text-sm text-gray-400"
            >이후 언제든 변경 가능합니다。</span
          >
        </p>
        <div class="flex gap-3 mb-6 items-center">
          <input
            type="text"
            class="flex-1 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-gray-100 font-mono focus:border-blue-900 focus:ring-1 focus:ring-blue-800 transition"
            placeholder="폴더가 선택되지 않았습니다"
            bind:value={selectedPath}
            readonly
          />
          <button
            class="shrink-0 px-5 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold shadow focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
            type="button"
            onclick={dialogNewVaultPath}
          >
            📂 폴더 선택
          </button>
        </div>

        {#if errorMessage}
          <div
            class="mb-4 w-full text-sm px-3 py-2 rounded bg-rose-950/90 text-rose-300 border border-rose-600 shadow"
          >
            {errorMessage}
          </div>
        {/if}
      </div>

      <div class="flex justify-end gap-3 mt-5"></div>

      {#if API.vault.state.loading}
        <div
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl z-50"
        >
          <div
            class="animate-spin h-7 w-7 border-4 border-blue-400 border-t-transparent rounded-full mb-2"
          ></div>
          <span class="text-base font-medium text-blue-300">저장 중...</span>
        </div>
      {/if}
    </main>
  </div>
</div>
