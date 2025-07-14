<script lang="ts">
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
</script>

<div
  class={[
    hotkeys.keyState.currentMode === "normal" ? "bg-red-400" : "bg-red-600",
    "rounded-lg overflow-hidden w-full h-full content-center text-center transition-colors",
  ]}
>
  {hotkeys.keyState.currentMode}: ({JSON.stringify(
    hotkeys.keyState.pendingKeys,
  )}), {hotkeys.keyState.pressedKeys}
</div>
