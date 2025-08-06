<script lang="ts">
  import { API } from "$lib/store/api";
  import type { RegisteredHotkey } from "$lib/types/hotkey";

  const hotkeyGroup = $derived.by(() => {
    const leaders: RegisteredHotkey[] = [];
    const normars: RegisteredHotkey[] = [];
    API.hotkey.keyState.registeredHotkeys.forEach((h) => {
      h.options.mode === "leader" ? leaders.push(h) : normars.push(h);
    });
    return { leaders, normars };
  });
</script>

<div class={[" overflow-hidden w-full h-full ", "bg-black/20 text-white/70"]}>
  <div class="w-full h-full flex flex-col gap-4 p-4 overflow-y-scroll">
    <div>
      <div class="text-2xl font-bold text-center mb-5">leaders</div>
      <div class="flex flex-col gap-1">
        {#each hotkeyGroup.leaders.sort( (a, b) => a.description.localeCompare(b.description), ) as hotkey}
          <div class="">
            <div>
              {hotkey.description}
            </div>
            <div class="flex gap-1 justify-end">
              {#each hotkey.id.split("_") as key}
                <div
                  class={[
                    "bg-white text-black",
                    "rounded-sm text-sm px-1 content-center",
                  ]}
                >
                  {key}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div>
      <div class="text-2xl font-bold text-center mb-5">normals</div>
      <div class="flex flex-col gap-1">
        {#each hotkeyGroup.normars.sort( (a, b) => a.description.localeCompare(b.description), ) as hotkey}
          <div class="">
            <div>
              {hotkey.description}
            </div>
            <div class="flex justify-end">
              <div
                class={[
                  "bg-white text-black",
                  "rounded-sm text-sm px-1 content-center",
                ]}
              >
                {hotkey.id.replaceAll("_", " + ")}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
