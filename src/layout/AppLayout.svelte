<script lang="ts">
  import { fade } from "svelte/transition";
  import Pane from "./resizable-pane/Pane.svelte";
  import PaneGroup from "./resizable-pane/PaneGroup.svelte";
  import Resizer from "./resizable-pane/Resizer.svelte";
  import {
    setSectionConfig,
    layoutIds,
    focusById,
  } from "./resizable-pane/layoutStore.svelte";
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
  import { onMount } from "svelte";
  import { LAYOUT } from "./constant";
  import Headerbar from "./Headerbar.svelte";
  import Statusbar from "./Statusbar.svelte";
  import RightSidebar from "./RightSidebar.svelte";
  import LeftSidebar from "./LeftSidebar.svelte";
  import "$lib/hooks/initHotkeys";

  let { children } = $props();
  let appVisible = $state(false);

  onMount(() => {
    appVisible = true;
    // console.log("left sidebar compo", LeftSidebar)
  });

  setSectionConfig([
    { id: LAYOUT.LEFT_SIDEBAR },
    { id: LAYOUT.RIGHT_SIDEBAR },
    {
      id: LAYOUT.HEADER_BAR,
      config: { direction: "horizontal", default: 40, min: 0, max: 500 },
    },
    {
      id: LAYOUT.STATUS_BAR,
      config: { direction: "horizontal", default: 40, min: 0, max: 500 },
    },
  ]);

  let focusIndex = 0;

  hotkeys.register(
    ["space", "n"],
    () => {
      const ids = layoutIds();
      focusById(ids[focusIndex]);
      focusIndex++;
      if (focusIndex >= ids.length) {
        focusIndex = 0;
      }
    },
    "next layout focus",
    { mode: "leader" },
  );
</script>

{#if appVisible}
  <div class="w-screen h-screen" transition:fade>
    <PaneGroup direction="vertical">
      <Pane
        id={LAYOUT.LEFT_SIDEBAR}
        class="text-nowrap box-border shrink-0"
        collapsedClass="blur-lg -translate-x-10"
      >
        <div class="p-1 pr-0 w-full h-full">
          <LeftSidebar />
        </div>
      </Pane>
      <Resizer id="leftSidebar" toggleKey={["space", "e"]} keyMode="leader" />
      <PaneGroup direction="horizontal">
        <Pane
          id={LAYOUT.HEADER_BAR}
          class="flex-none shrink-0 box-border"
          collapsedClass="blur-lg"
        >
          <div class="w-full h-full pt-1">
            <Headerbar />
          </div>
        </Pane>
        <Resizer
          id={LAYOUT.HEADER_BAR}
          toggleKey={["space", "t"]}
          keyMode="leader"
        />
        <main class="w-full h-full rounded-lg bg-green-400 overflow-y-scroll">
          {#each hotkeys.keyState.registeredHotkeys as hotkey}
            <div>
              {hotkey.id}: {hotkey.description}
            </div>
          {/each}
          {@render children?.()}
        </main>
        <Resizer
          id={LAYOUT.STATUS_BAR}
          prev={true}
          toggleKey={["space", "b"]}
          keyMode="leader"
        />
        <Pane id={LAYOUT.STATUS_BAR} class="flex-none shrink-0 box-border">
          <div class="pb-1 w-full h-full">
            <Statusbar />
          </div>
        </Pane>
      </PaneGroup>
      <Resizer
        id={LAYOUT.RIGHT_SIDEBAR}
        toggleKey={["space", "r"]}
        keyMode="leader"
        prev={true}
      />
      <Pane
        id={LAYOUT.RIGHT_SIDEBAR}
        class="overflow-hidden text-nowrap box-border shrink-0"
      >
        <div class="p-1 pl-0 w-full h-full">
          <RightSidebar />
        </div>
      </Pane>
    </PaneGroup>
  </div>
{/if}
