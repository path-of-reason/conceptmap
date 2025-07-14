<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import ModeToggle from "$lib/components/mode-toggle.svelte";
  import { Button } from "$lib/components/ui/button";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import {useTabs} from "./useTabs.svelte"
  let {children} = $props()

  const { newTab } = useTabs()

  // let tabContainer:HTMLElement|null = null
  // function scrollToLastTab() {
  //   console.log(tabContainer)
  //   if (tabContainer) {
  //     tabContainer.scrollTo({
  //       left: tabContainer.scrollWidth,
  //       behavior: "smooth"
  //     });
  //   }
  // }
  //

  import { getCurrentWindow } from '@tauri-apps/api/window';
  import Tabbar from "./Tabbar.svelte";
  const handleMouseDown = (e:MouseEvent) => {
    if (e.buttons === 1) {
      const appWindow = getCurrentWindow();
      e.detail === 2
        ? appWindow.toggleMaximize() // Maximize on double click
        : appWindow.startDragging(); // Else start dragging
    }
  }
</script>

<main class="grow rounded-lg h-full w-full bg-sky-400 p-2 flex flex-col gap-0 overflow-hidden" >
  <div class="w-full flex-none flex gap-1 justify-between items-center" >
    <Sidebar.Trigger side="left" class="flex-none" />
    <Tabbar/>
    <div class="grow">
      <!-- empty -->
    </div>
    <Button
      class="w-7 h-7 flex-none"
      onclick={()=>{
        newTab();
      }} variant="ghost" size="icon">
      <PlusIcon />
      <span class="sr-only">add new tab</span>
    </Button>
    <ModeToggle class="flex-none"/>
    <Sidebar.Trigger side="right"  class="flex-none"/>
  </div>
  <div class="flex-1 h-full rounded-lg overflow-scroll">
    {@render children?.()}
  </div>
</main>


<style>
  :global(.slot[data-swapy-highlighted]) {
    background: lightblue;
  }
  :global(.item[data-swapy-dragging]) {
    background: white !important;
  }
</style>
