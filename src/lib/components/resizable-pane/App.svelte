<script lang="ts">
  import { slide } from "svelte/transition";
  import Button from "../ui/button/button.svelte";
  import Pane from "./Pane.svelte";
  import PaneGroup from "./PaneGroup.svelte";
  import Resizer from "./Resizer.svelte";
  import {
    useLayoutStore,
    setLayoutConfig,
    layoutIds,
    focusById,
  } from "./layoutStore.svelte";
  import { onMount } from "svelte";
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";

  setLayoutConfig([
    { id: "l1" },
    { id: "r1" },
    { id: "r2" },
    {
      id: "h1",
      option: { direction: "horizontal", default: 40, min: 0, max: 500 },
    },
    {
      id: "h3",
      option: { direction: "horizontal", default: 40, min: 0, max: 500 },
    },
  ]);

  onMount(() => {
    // console.log(layoutMapVisible());
  });

  const { sectionState, toggleCollapsed } = useLayoutStore<"vertical">({
    id: "l1",
  });
  let focusIndex = 0;
  hotkeys.register(["meta", "a"], () => console.log("hello"));
  hotkeys.register(
    "n",
    () => {
      const ids = layoutIds();
      focusById(ids[focusIndex]);
      focusIndex++;
      if (focusIndex >= ids.length) {
        focusIndex = 0;
      }
    },
    { mode: "leader" },
  );
</script>

<div class="w-screen h-screen">
  <PaneGroup direction="vertical">
    <Pane
      id="l1"
      class="text-nowrap box-border shrink-0"
      collapsedClass="blur-lg -translate-x-10"
    >
      <div class="p-1 pr-0 w-full h-full">
        <div class="rounded-lg overflow-hidden bg-amber-400 w-full h-full">
          {#if !sectionState.collapsed}
            <div
              transition:slide
              class="w-full text-center bg-emerald-400 text-nowrap"
            >
              high
            </div>
          {/if}
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
        </div>
      </div>
    </Pane>
    <Resizer id="l1" toggleKey={["leader", "e"]} />
    <PaneGroup direction="horizontal">
      <Pane
        id="h1"
        class="flex-none shrink-0 box-border"
        collapsedClass="blur-lg"
      >
        <div class="w-full h-full pt-1">
          <div class="w-full h-full rounded-lg overflow-hidden bg-sky-400">
            <Button
              class="focus:bg-sky-400 "
              draggable
              onclick={toggleCollapsed}>LeftCollapsed</Button
            >
          </div>
        </div>
      </Pane>
      <Resizer id="h1" toggleKey={["leader", "t"]} />
      <div class="w-full h-full rounded-lg bg-green-400 overflow-y-scroll">
        main
        <div contenteditable="true">hello</div>
        {#each hotkeys.registeredHotkeys as hotkey}
          <div>
            {hotkey.id}: {hotkey.keys.join("+")}
            <!-- {JSON.stringify(hotkey.options)} -->
          </div>
        {/each}
      </div>
      <Resizer id="h3" prev={true} toggleKey={["leader", "b"]} />
      <Pane id="h3" class="flex-none shrink-0 box-border">
        <div class="pb-1 w-full h-full">
          <div
            class={[
              hotkeys.keyState.currentMode === "normal"
                ? "bg-red-400"
                : "bg-gray-400",
              "rounded-lg overflow-hidden w-full h-full content-center text-center",
            ]}
          >
            {hotkeys.keyState.currentMode}: ({hotkeys.keyState.pressedKeys})
          </div>
        </div>
      </Pane>
    </PaneGroup>
    <Resizer id="r1" toggleKey={["leader", "r"]} prev={true} />
    <Pane id="r1" class="overflow-hidden text-nowrap box-border shrink-0">
      <div class="p-1 pl-0 w-full h-full">
        <div class="rounded-lg overflow-hidden bg-purple-400 w-full h-full">
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
          <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
        </div>
      </div>
    </Pane>
  </PaneGroup>
</div>
