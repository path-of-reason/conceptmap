<script lang="ts">
  import {
    hotkeys,
    type RegisteredHotkey,
  } from "$lib/hooks/useKeyboard.svelte";
  import { sectionVisible } from "../resizable-pane/sectionStore.svelte";

  let visibleMap = $derived.by(sectionVisible);
  const hotkeyGroup = $derived.by(() => {
    const leaders: RegisteredHotkey[] = [];
    const normars: RegisteredHotkey[] = [];
    hotkeys.keyState.registeredHotkeys.forEach((h) => {
      h.options.mode === "leader" ? leaders.push(h) : normars.push(h);
    });
    return { leaders, normars };
  });
</script>

<div
  class={[
    "rounded-md overflow-hidden w-full h-full ",
    "bg-black/20 text-white/70",
  ]}
>
  <div class="p-4">
    {#each visibleMap.list as { id, visible }}
      <div class="flex gap-2 items-center">
        <h2 class="text-lg font-bold">{id}</h2>
        <p class="text-sm">{visible}</p>
      </div>
    {/each}
  </div>
  <div class="flex flex-col gap-2 p-4">
    <div>
      <div class="text-2xl font-bold">leaders</div>
      {#each hotkeyGroup.leaders as hotkey}
        <div>
          {hotkey.id}: {hotkey.description}
        </div>
      {/each}
    </div>
    <div>
      <div class="text-2xl font-bold">normals</div>
      {#each hotkeyGroup.normars as hotkey}
        <div>
          {hotkey.id}: {hotkey.description}
        </div>
      {/each}
    </div>
  </div>
</div>
