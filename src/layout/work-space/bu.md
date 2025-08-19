
  <div class="shrink-0 w-[10%] h-full relative">
    {#each leftSideCells as cell (cell.id)}
      {@const content = renderCellContent(cell)}
      <button
        class={[
          "absolute hover:z-50 hover:bg-amber-400 ",
          "w-full p-2 rounded transition-colors duration-200 text-right",
          cell.id === store.layout.focusedCellId
            ? "bg-amber-600"
            : "bg-zinc-800/0",
        ]}
        style={`top: ${Math.floor((100 * cell.row) / store.layout.rows + cell.col * 3)}%; `}
        onclick={() => handleBookmarkClick(cell.id)}
      >
        <div
          class="flex justify-end items-center space-x-2 pr-3"
          style={`padding-right: ${Math.floor((30 * (store.layout.cols - cell.col - 1)) / store.layout.cols)}px;`}
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
