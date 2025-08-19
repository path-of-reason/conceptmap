<script lang="ts">
  // route/editor에서 분기되어 사용 됨
  import { API } from "$lib/store/api";
  import type { GridCell } from "$lib/types/workspace";

  const { store, getTabById, focusCell, CellUtil } = API.workspace;

  function renderCellContent(cell: GridCell) {
    if (!cell.activeTabId) return null;
    const tab = getTabById(cell.activeTabId);
    if (!tab) return null;
    return { title: tab.title, content: tab.content, type: tab.type };
  }

  const focusedCell = $derived(CellUtil.getFocusedCell());
  const leftSideCells = $derived(CellUtil.getLeftSideCells());
  const rightSideCells = $derived(CellUtil.getRightSideCells());

  // 북마크 스티커 클릭 핸들러
  function handleBookmarkClick(cellId: string) {
    focusCell(cellId);
  }
</script>

<div class={["w-full h-full flex "]}>
  <div class="shrink-0 w-[10%] h-full relative">
    {#each leftSideCells as cell (cell.id)}
      {@const content = renderCellContent(cell)}
      <button
        class={[
          "absolute hover:z-50 hover:bg-amber-400",
          "py-2 rounded transition-colors duration-200 text-right",
          cell.id === store.layout.focusedCellId
            ? "bg-amber-600"
            : "bg-zinc-800/0",
        ]}
        style={`
          top: ${Math.floor((100 * cell.row) / store.layout.rows)}%; 
          padding-top: ${cell.col * 3}%;
          left: ${Math.floor((100 / store.layout.cols) * cell.col)}%;
        `}
        onclick={() => handleBookmarkClick(cell.id)}
      >
        <div class="flex flex-col justify-end items-center space-x-2 pr-3">
          <span
            class={[
              "text-sm truncate text-gray-200",
              content ? "opacity-100" : "opacity-40",
            ]}
            style="writing-mode: vertical-rl; text-orientation: mixed;"
          >
            {content ? content.title : "Empty Panel"}</span
          >
          <div
            class="w-2 h-2 rounded-full"
            style="background-color: {cell.color};"
          ></div>
        </div>
      </button>
    {/each}
  </div>
  <div class="grow h-full overflow-hidden">
    <div class="w-full h-full overflow-y-scroll">
      {#if focusedCell}
        {#if focusedCell.type === "leaf"}
          {@const content = renderCellContent(focusedCell)}
          <div class="flex-1 text-gray-300 p-2 rounded-sm w-full h-full">
            <div class={["truncate text-2xl opacity-50", "relative"]}>
              {content ? content.title : "No Tab"}
              <div
                class="absolute w-2 h-2 z-50 top-1 right-1 rounded-full"
                style="background-color: {focusedCell.color};"
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
        {:else if focusedCell.type === "empty"}
          <div
            class={[
              "w-full h-full flex flex-col items-center justify-center relative",
              "text-gray-500 text-lg rounded-sm",
            ]}
          >
            <div
              class="absolute top-3 right-3 w-2 h-2 z-50 rounded-full"
              style="background-color: {focusedCell.color};"
            ></div>
            <div>
              id: {focusedCell.id}
            </div>
            <div>
              ({focusedCell.col}, {focusedCell.row})
            </div>
            <div>Empty Panel</div>
          </div>
        {/if}
      {:else}
        cell is not focused
      {/if}
    </div>
  </div>
  <div class="shrink-0 w-[10%] h-full relative">
    {#each rightSideCells as cell (cell.id)}
      {@const content = renderCellContent(cell)}
      <button
        class={[
          "absolute left-0 hover:z-50 hover:bg-amber-400", // left-0으로 변경하여 왼쪽에 붙도록
          "w-full p-2 rounded transition-colors duration-200 text-left", // text-left로 변경
          cell.id === store.layout.focusedCellId
            ? "bg-amber-600"
            : "bg-zinc-800/0",
        ]}
        style={`top: ${Math.floor((100 * cell.row) / store.layout.rows + cell.col * 3)}%;`}
        onclick={() => handleBookmarkClick(cell.id)}
      >
        <div
          style={`padding-left: ${Math.floor((30 * (cell.col + 1)) / store.layout.cols)}px;`}
          class="flex justify-start items-center space-x-2"
        >
          <div
            class="w-2 h-2 rounded-full"
            style="background-color: {cell.color};"
          ></div>
          <span
            class={[
              "text-sm truncate text-gray-200",
              content ? "opacity-100" : "opacity-40",
            ]}
          >
            {content ? content.title : "Empty Panel"}</span
          >
        </div>
      </button>
    {/each}
  </div>
</div>
