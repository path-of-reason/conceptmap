<script lang="ts">
  import type { GridCell } from "./types";
  import { useLayoutStore } from "./layoutStore.svelte";

  const { layoutStore, getTabById, focusCell } = useLayoutStore();

  function renderCellContent(cell: GridCell) {
    if (!cell.activeTabId) return null;
    const tab = getTabById(cell.activeTabId);
    if (!tab) return null;
    return { title: tab.title, content: tab.content, type: tab.type };
  }

  const focusedCell = $derived(
    layoutStore.root.cells.find((c) => c.id === layoutStore.root.focusedCellId),
  );
  // 현재 포커스된 셀을 기준으로 왼쪽에 있는 셀들
  const leftSideCells = $derived(
    focusedCell
      ? layoutStore.root.cells
          .filter(
            (cell) =>
              cell.col < focusedCell.col &&
              // 동일한 행 범위 내의 셀만 포함하거나, 논리적으로 왼쪽에 있는 모든 셀을 포함하도록 조정
              // 여기서는 모든 왼쪽 셀을 가져오되, 정렬은 나중에 합니다.
              cell.row < layoutStore.root.rows, // 모든 행을 포함하도록 가정. 필요시 row 범위 조정
          )
          .sort((a, b) => a.col - b.col || a.row - b.row) // 왼쪽에서 오른쪽, 위에서 아래로 정렬
      : [],
  );

  // 현재 포커스된 셀을 기준으로 오른쪽에 있는 셀들
  const rightSideCells = $derived(
    focusedCell
      ? layoutStore.root.cells
          .filter(
            (cell) =>
              cell.col + cell.colspan >=
                focusedCell.col + focusedCell.colspan &&
              // 동일한 행 범위 내의 셀만 포함하거나, 논리적으로 오른쪽에 있는 모든 셀을 포함하도록 조정
              // 여기서는 모든 오른쪽 셀을 가져오되, 정렬은 나중에 합니다.
              cell.row < layoutStore.root.rows, // 모든 행을 포함하도록 가정. 필요시 row 범위 조정
          )
          .sort((a, b) => a.col - b.col || a.row - b.row) // 왼쪽에서 오른쪽, 위에서 아래로 정렬
      : [],
  );

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
          "absolute hover:z-50 hover:bg-amber-400 ",
          "w-full p-2 rounded transition-colors duration-200 text-right",
          cell.id === layoutStore.root.focusedCellId
            ? "bg-amber-600"
            : "bg-zinc-800/0",
        ]}
        style={`top: ${Math.floor((100 * cell.row) / layoutStore.root.rows + cell.col * 3)}%; `}
        onclick={() => handleBookmarkClick(cell.id)}
      >
        <div
          class="flex justify-end items-center space-x-2 pr-3"
          style={`padding-right: ${Math.floor((30 * (layoutStore.root.cols - cell.col - 1)) / layoutStore.root.cols)}px;`}
        >
          <span
            class={[
              "text-sm truncate text-gray-200",
              content ? "opacity-100" : "opacity-40",
            ]}
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
          <div
            class="flex-1 text-gray-300 p-2 bg-zinc-800/30 rounded-sm w-full h-full"
          >
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
              "text-gray-500 text-lg bg-zinc-800/30 rounded-sm",
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
          cell.id === layoutStore.root.focusedCellId
            ? "bg-amber-600"
            : "bg-zinc-800/0",
        ]}
        style={`top: ${Math.floor((100 * cell.row) / layoutStore.root.rows + cell.col * 3)}%;`}
        onclick={() => handleBookmarkClick(cell.id)}
      >
        <div
          style={`padding-left: ${Math.floor((30 * (cell.col + 1)) / layoutStore.root.cols)}px;`}
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
