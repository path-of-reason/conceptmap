<script lang="ts">
  // route/editor에서 분기되어 사용 됨
  import { API } from "$lib/store/api";
  import type { GridCell } from "$lib/types/workspace";
  import { slide } from "svelte/transition";

  const { store, getTabById, focusCell } = API.workspace;

  const gridStyle = $derived(
    `
    display: grid;
    grid-template-rows: ${store.layout.rowSizes.join(" ")};
    grid-template-columns: ${store.layout.colSizes.join(" ")};
  `,
  );

  function renderCellContent(cell: GridCell) {
    if (!cell.activeTabId) return null;
    const tab = getTabById(cell.activeTabId);
    if (!tab) return null;
    return { title: tab.title, content: tab.content, type: tab.type }; // type도 반환하도록 수정
  }
</script>

<div class="w-full h-full" style={gridStyle}>
  {#each store.layout.cells as cell (cell.id)}
    {@const isFocused = store.layout.focusedCellId === cell.id}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={[
        "relative flex flex-col overflow-hidden nottransition-all",
        isFocused ? "bg-zinc-900/30" : "bg-gray-900/70",
      ]}
      in:slide
      onclick={() => focusCell(cell.id)}
    >
      {#if cell.type === "leaf"}
        {@const content = renderCellContent(cell)}
        <div class="flex-1 text-gray-300 p-2 overflow-auto">
          <div class={["truncate text-2xl opacity-50", "relative"]}>
            {content ? content.title : "No Tab"}
            <div
              class="absolute w-2 h-2 z-50 top-1 right-1 rounded-full"
              style="background-color: {cell.color};"
            ></div>
          </div>
          {#if content}
            <div>Content for: {content.content}</div>
            {#if content.type === "file"}
              <p class="text-sm text-gray-500 mt-2">
                This is a file content placeholder.
              </p>
            {:else if content.type === "terminal"}
              <p class="text-sm text-gray-500 mt-2">
                Terminal content goes here.
              </p>
            {:else}
              <p class="text-sm text-gray-500 mt-2">
                Unknown tab type content.
              </p>
            {/if}
          {:else}
            <div
              class="text-gray-500 flex flex-col items-center justify-center h-full"
            >
              <p class="text-lg">No active tab.</p>
              <p class="text-sm mt-1">Drag a tab here or open a new one.</p>
            </div>
          {/if}
        </div>
      {:else if cell.type === "empty"}
        <div
          class="w-full h-full border-dashed border-2 border-gray-700 flex flex-col items-center justify-center text-gray-500 text-lg"
        >
          <div>
            id: {cell.id}
          </div>
          <div>
            ({cell.col}, {cell.row})
          </div>
          <div>Empty Panel</div>
        </div>
      {/if}
    </div>
  {/each}
</div>
