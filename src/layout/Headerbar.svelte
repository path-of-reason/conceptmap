<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { LAYOUT } from "./constant";
  import { useLayoutStore } from "./resizable-pane/layoutStore.svelte";

  const { toggleCollapsed } = useLayoutStore<"vertical">({
    id: LAYOUT.LEFT_SIDEBAR,
  });
</script>

<div class="w-full h-full rounded-lg overflow-hidden bg-sky-400">
  <Button class="focus:bg-sky-400 " draggable onclick={toggleCollapsed}
    >LeftCollapsed</Button
  >
</div>
