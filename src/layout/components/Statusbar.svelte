<script lang="ts">
  import { onMount } from "svelte";
  import { loadTime } from "$lib/tauri/load_test";
  import { API } from "$lib/store/api";

  let loadtime = $state(0);
  onMount(() => {
    if (loadtime === 0)
      loadTime().then((n) => {
        if (n) loadtime = n;
      });
  });
  const { keyState } = API.hotkey;
  const { contextState } = API.context;
</script>

<div
  class={[
    keyState.currentMode === "normal" ? "" : "bg-red-600/20",
    "rounded-b-xl overflow-hidden w-full h-full content-center text-center items-center transition-colors",
    "text-white/50 text-xs flex gap-5 justify-center",
  ]}
>
  <div>loadtime: {loadtime}</div>
  <div>
    {keyState.currentMode}: ({JSON.stringify(keyState.pendingKeys)}), {keyState.pressedKeys}
  </div>
  <div>
    Contexts: {JSON.stringify(contextState.contextStack)}
  </div>
</div>
