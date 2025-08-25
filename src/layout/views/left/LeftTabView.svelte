<script lang="ts">
  import XIcon from "@lucide/svelte/icons/x";
  import { API } from "$lib/store/api";
  import { slide2 } from "$lib/utils/transition";

  const { store, removeTab, handleTabClick } = API.workspace;
</script>

<div
  class="h-full w-full flex flex-col gap-1 justify-start overflow-y-scroll hide-scrollbar"
>
  {#each store.tabs as tab (tab.id)}
    {@const curTab = store.layout.cells.reduce(
      (acc, cell) => {
        if (!acc.ok && cell.activeTabId === tab.id)
          acc = { ok: true, tabId: tab.id, color: cell.color };
        return acc;
      },
      {
        ok: false,
        tabId: "",
        color: "",
      },
    )}
    {@const isFocused =
      store.layout.cells.findIndex(
        (cell) =>
          cell.id === store.layout.focusedCellId && cell.activeTabId === tab.id,
      ) > -1}
    <div class="relative w-fit flex-shrink-0 group">
      <button
        class={[
          "item content-center text-center rounded-md h-full w-full px-6",
          "hover:bg-white/30 nottransition-[width,height,background] relative",
          isFocused ? "text-black bg-white" : "bg-black/20 text-white",
        ]}
        onclick={() => handleTabClick(tab.id)}
      >
        {tab.title}
        <div
          class="absolute w-2 h-2 z-50 top-1 right-1 rounded-full"
          style="background-color: {curTab.color};"
        ></div>
      </button>
      <button
        class={[
          "absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 rounded-full hover:bg-transparent ",
          "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        ]}
        onclick={removeTab(tab.id)}
      >
        <XIcon class="w-3 h-3 text-white" />
      </button>
    </div>
  {/each}
</div>
