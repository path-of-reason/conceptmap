<script lang="ts">
  import { layoutMapVisible } from "./resizable-pane/layoutStore.svelte";

  let visibleMap = $derived.by(layoutMapVisible);
</script>

<div class="rounded-lg overflow-hidden bg-purple-400 w-full h-full">
  {#each visibleMap.list as { id, visible }}
    <div class="p-4">
      <h2 class="text-lg font-bold">{id}</h2>
      <p class="text-sm">Visible: {visible}</p>
    </div>
  {/each}
</div>
