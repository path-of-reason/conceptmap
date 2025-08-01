<script lang="ts">
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
  import { onMount } from "svelte";
  import { loadTime } from "../../lib/tauri/load_test";

  let loadtime = $state(0);
  onMount(() => {
    if (loadtime === 0)
      loadTime().then((n) => {
        if (n) loadtime = n;
      });
  });
</script>

<div
  class={[
    hotkeys.keyState.currentMode === "normal" ? "" : "bg-red-600/20",
    "rounded-b-xl overflow-hidden w-full h-full content-center text-center items-center transition-colors",
    "text-white/50 text-xs flex gap-5 justify-center",
  ]}
>
  <div>loadtime: {loadtime}</div>
  <div>
    {hotkeys.keyState.currentMode}: ({JSON.stringify(
      hotkeys.keyState.pendingKeys,
    )}), {hotkeys.keyState.pressedKeys}
  </div>
</div>
