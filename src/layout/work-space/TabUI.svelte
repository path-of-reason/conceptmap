<script lang="ts">
  import XIcon from "@lucide/svelte/icons/x";
  import { useLayoutStore } from "./layoutStore.svelte";

  const { layoutStore, removeTab, assignTabToCell, focusCell } =
    useLayoutStore();

  function handleTabClick(tabId: string) {
    if (layoutStore.root.focusedCellId) {
      assignTabToCell(tabId, layoutStore.root.focusedCellId);
    } else if (layoutStore.root.cells.length > 0) {
      assignTabToCell(tabId, layoutStore.root.cells[0].id);
      focusCell(layoutStore.root.cells[0].id);
    }
  }
</script>

<div
  data-tauri-drag-region
  class="w-full flex gap-1 justify-start overflow-x-scroll hide-scrollbar"
>
  {#each layoutStore.tabs as tab (tab.id)}
    {@const curTab = layoutStore.root.cells.reduce(
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
      layoutStore.root.cells.findIndex(
        (cell) =>
          cell.id === layoutStore.root.focusedCellId &&
          cell.activeTabId === tab.id,
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
