<script lang="ts">
  import {  untrack } from 'svelte'
  import {
    createSwapy,
    type SlotItemMapArray,
    type Swapy,
    utils,
  } from 'swapy'
  import { cn } from '$lib/utils';

  type Item = {
    id: string
    title: string
    active: boolean
  }

  const initialItems: Item[] = [
    { id: '1', title: '1', active:false },
    { id: '2', title: '2', active:false },
    { id: '3', title: '3', active:false }
  ]

  let items = $state(initialItems)
  let nextId = $state(4)
  let slotItemMap = $state(utils.initSlotItemMap(initialItems, 'id'))
  const slottedItems = $derived(utils.toSlottedItems(items, 'id', slotItemMap))

  const setSlotItemMap = (value: SlotItemMapArray) => (slotItemMap = value)


  const useSwapy = (container:HTMLElement)=>{
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
      items = items.map((item) => ({...item, active: item.id === event.draggingItem ? true : false}))
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
        items,
        'id',
        untrack(() => slotItemMap),
        setSlotItemMap )
    })

    $effect(()=>{
      return () => {
        swapy?.destroy()
      }
    })
  }
</script>

<div class="p-2 bg-amber-300" use:useSwapy>
  <div class="w-full flex gap-1">
    {#each slottedItems as { slotId, itemId, item }}
      {#key slotId}
        <div class="slot rounded-md min-w-10 w-full max-w-64 h-10"  data-swapy-slot={slotId}>
          {#if item}
            {#key itemId}
              <div
                class={cn("item content-center text-center rounded-md h-full w-full",
                  item.active ? "bg-green-700" : "bg-green-500",
                  "relative transition-[width,height,background]")}
                data-swapy-item={itemId}
              >
                <span>{item.title}</span>
                <button
                  aria-label="delete"
                  class={cn("delete absolute top-1 right-1  rounded-full bg-zinc-800 w-3 h-3 hover:bg-red-500"
                  )}
                  data-swapy-no-drag
                  onclick={() => {
                    items = items.filter((i) => i.id !== item.id)
                  }}
                >
                </button>
              </div>
            {/key}
          {/if}
        </div>
      {/key}
    {/each}
    <button
      class="rounded-lg border-5 border-blue-400 w-10 min-w-10 h-10"
      onclick={() => {
        const newItem: Item = { id: `${nextId}`, title: `${nextId}`, active: false }
        items.push(newItem)
        nextId++
      }}>+</button >
  </div>
</div>


<style>
  /* :global(.slot[data-swapy-highlighted]) {
    background: lightblue;
  }
  :global(.item[data-swapy-dragging]) {
    background: red !important;
    height: 200%;
  } */
</style>
