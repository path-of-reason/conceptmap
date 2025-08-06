<script lang="ts">
  let searchQuery = $state("");
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") console.log("enter");
  };
</script>

<div
  class={[
    "w-[500px] max-w-[90vw]",
    "bg-gradient-to-r from-zinc-900 via-slate-950 to-black border-2 border-zinc-400 rounded-lg",
    "p-4 z-1000 text-foreground",
  ]}
  role="dialog"
  aria-modal="true"
>
  <input
    type="text"
    placeholder="Search commands..."
    class={[
      "w-full py-2 px-2.5 mb-3",
      "bg-input border border-zinc-400 rounded-md text-white",
      "box-border focus:outline-none focus:ring-2 focus:ring-accent",
    ]}
    bind:value={searchQuery}
    onkeydown={handleKeyDown}
  />
  <ul class="list-none p-0 m-0 max-h-[300px] h-fit overflow-y-auto transition">
    커맨드 리스트
    <!-- {filteredCommands.length > 0 && -->
    <!--   filteredCommands.map((command, index) => ( -->
    <!--     <li -->
    <!--       key={command.id} -->
    <!--       ref={(el) => setCommandItemRef(el, index)} -->
    <!--       className={cn( -->
    <!--         "py-2 px-3 cursor-pointer rounded-md", -->
    <!--         index === highlightedIndex ? " bg-zinc-700" : "bg-transparent", -->
    <!--         "hover:bg-slate-700", -->
    <!--       )} -->
    <!--       onMouseDown={(e) => e.preventDefault()} -->
    <!--       onClick={() => { -->
    <!--         const command = filteredCommands[index]; -->
    <!--         console.log("Executing command (mouse):", command); -->
    <!--         executeCommand(command.id); -->
    <!--         closeCommandPalette(); -->
    <!--       }} -->
    <!--     > -->
    <!--       {command.name} -->
    <!--     </li> -->
    <!--   ))} -->
  </ul>
</div>
