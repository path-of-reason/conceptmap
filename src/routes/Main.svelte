<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import ModeToggle from "$lib/components/mode-toggle.svelte";
  import {
    createSwapy,
    type SlotItemMapArray,
    type Swapy,
    utils,
  } from 'swapy'
  import { cn } from '$lib/utils';
  import { untrack } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import XIcon from "@lucide/svelte/icons/x";
  let {children} = $props()

  type TabItem = {
    slotId: string;
    title: string;
    active: boolean;
  }
  const initialTabs:TabItem[] = [
    { slotId: "1", title: "filename1", active:false }
  ]
  let tabItems = $state(initialTabs)
  let nextSlotId = $state(2)
  let slotItemMap = $state(utils.initSlotItemMap(initialTabs, 'slotId'))
  const slottedItems = $derived(utils.toSlottedItems(tabItems, 'slotId', slotItemMap))


  const setSlotItemMap = (value: SlotItemMapArray) => (slotItemMap = value)
  const useSwapy = (container:HTMLElement) =>{
    let swapy = createSwapy(container, {
      // dragAxis: 'x',
      manualSwap: true
      // animation: 'dynamic'
      // autoScrollOnDrag: true,
      // swapMode: 'drop',
      // enabled: true,
      // dragOnHold: true
    })

    swapy.onSwapStart((event) => {
      // tabItems = tabItems.map((item) => ({...item, active: item.title === event.draggingItem ? true : false}))
    })

    swapy.onSwap((event) => {
      requestAnimationFrame(() => {
        slotItemMap = event.newSlotItemMap.asArray
      })
    })

    swapy.onSwapEnd((event) => {
      // console.log('end', event)
      // console.log("original data", items)
    })

    $effect(() => {
      utils.dynamicSwapy(
        swapy,
        tabItems,
        'slotId',
        untrack(() => slotItemMap),
        setSlotItemMap )

      return () => {
        swapy.destroy()
      }
    })
  }

  const newTab = ()=>{
    const newItem = { slotId: `${nextSlotId}`, title: `filename${nextSlotId}`, active: false }
    tabItems.push(newItem)
    nextSlotId++
  }
  const removeTab = (item:TabItem)=>()=>{
    tabItems = tabItems.filter((i) => i.slotId !== item.slotId)
  }

</script>

<main class="flex-1 rounded-lg h-full p-2" use:useSwapy>
  <Tabs.Root value="account" class="w-full h-full flex flex-col gap-0">
    <div class="w-full flex-none flex gap-1 justify-between items-center" >
      <Sidebar.Trigger side="left" />
      <Tabs.List class="w-full flex gap-1 justify-start overflow-x-scroll overflow-y-clip hide-scrollbar">
        {#each slottedItems as {slotId, itemId, item}}
          {#key slotId}
            <div class="slot rounded-md bg-black/10 min-w-fit w-full h-fit transition-colors"  data-swapy-slot={slotId}>
              {#if item}
                {#key itemId}
                  <div
                    class={cn("item content-center text-center rounded-md h-full w-full",
                      "relative group transition-[width,height,background]")}
                    data-swapy-item={itemId}
                  >
                    <Tabs.Trigger value={item.title}
                      class={cn(
                        "data-[state=active]:bg-white/50 data-[state=active]:text-black/60 text-white",
                        "dark:data-[state=active]:text-foreground bg-black/10 ",
                        "relative w-full px-6 transition-colors" )}>
                      {item.title.toUpperCase()}
                    </Tabs.Trigger>
                    <Button
                      aria-label="delete"
                      data-swapy-no-drag
                      class={cn("delete absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 rounded-full hover:bg-transparent ",
                        "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      )}
                      onclick={removeTab(item)} variant="ghost" size="icon">
                      <XIcon />
                      <span class="sr-only">add new tab</span>
                    </Button>
                  </div>
                {/key}
              {/if}
            </div>
          {/key}
        {/each}
      </Tabs.List>
      <div class="grow">
        <!-- empty -->
      </div>
      <Button
        class="w-7 h-7"
        onclick={newTab} variant="ghost" size="icon">
        <PlusIcon />
        <span class="sr-only">add new tab</span>
      </Button>
      <ModeToggle />
      <Sidebar.Trigger side="right" />
    </div>
    {#each tabItems as tab (tab.title)}
      <Tabs.Content value={tab.title} class="flex-1 h-full rounded-lg overflow-scroll">
        {@render children?.()}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</main>


<style>
  :global(.slot[data-swapy-highlighted]) {
    background: lightblue;
  }
  :global(.item[data-swapy-dragging]) {
    background: white !important;
  }
</style>
