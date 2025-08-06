<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import TrafficLights from "./header/TrafficLights.svelte";
  import ToggleLeftSidebarBtn from "./header/ToggleLeftSidebarBtn.svelte";
  import ToggleRightSidebarBtn from "./header/ToggleRightSidebarBtn.svelte";
  import TabUi from "./header/TabUI.svelte";
  import { API } from "$lib/store/api";
  import { CMDKEYS } from "$lib/constant/commandKey";

  const { createNewTab } = API.workspace;
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "t"],
      commandKey: CMDKEYS.WORKSPACE.TAB.NEW,
      options: { mode: "normal" },
    },
  ]);
</script>

<div
  class="w-full h-full rounded-t-lg overflow-hidden flex items-center text-white/70 bg-sky-600/30"
  data-tauri-drag-region
>
  <TrafficLights />
  <!-- <div class="w-18 h-full"></div> -->
  <div
    data-tauri-drag-region
    class="grow h-full flex items-center justify-center pr-2 gap-2 overflow-hidden"
  >
    <ToggleLeftSidebarBtn />
    <div data-tauri-drag-region class="grow w-full overflow-hidden">
      <TabUi />
    </div>
    <button onclick={createNewTab} class="rounded-sm hover:bg-zinc-900">
      <Icons.PlusCircle class="w-4 h-4" />
    </button>
    <ToggleRightSidebarBtn />
  </div>
</div>
