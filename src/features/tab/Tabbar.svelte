<script>
  import { utils } from "swapy";
  import { useTabs } from "./useTabs.svelte";
  import { Button } from "$lib/components/ui/button";
  import XIcon from "@lucide/svelte/icons/x";
  const { tabStore: store, removeTab, useSwapy } = useTabs();

  let slottedItems = $derived(
    utils.toSlottedItems(store.tabItems, "slotId", store.slotItemMap),
  );
</script>

<div
  class="w-full flex gap-1 justify-start overflow-x-scroll hide-scrollbar"
  use:useSwapy
>
  {#each slottedItems as { slotId, itemId, item }}
    {#key slotId}
      <div
        class="slot rounded-md bg-black/10 min-w-fit w-full h-fit transition-colors"
        data-swapy-slot={slotId}
      >
        {#if item}
          {#key itemId}
            <div
              class={[
                "item content-center text-center rounded-md h-full w-full px-6",
                "data-[state=active]:bg-white/50 data-[state=active]:text-black/60 ",
                "dark:data-[state=active]:text-foreground bg-black/10 ",
                item.active ? "bg-white text-black" : "bg-black text-white",
                "relative group transition-[width,height,background]",
              ]}
              data-swapy-item={itemId}
            >
              <span> {item.title.toUpperCase()} </span>
              <Button
                aria-label="delete"
                data-swapy-no-drag
                class={[
                  "delete absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 rounded-full hover:bg-transparent ",
                  "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                ]}
                onclick={removeTab(item)}
                variant="ghost"
                size="icon"
              >
                <XIcon />
                <span class="sr-only">close tab</span>
              </Button>
            </div>
          {/key}
        {/if}
      </div>
    {/key}
  {/each}
</div>
