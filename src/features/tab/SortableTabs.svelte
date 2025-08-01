<script lang="ts">
  import { useTabs } from "./useSortable.svelte";
  import { Button } from "$lib/components/ui/button";
  import XIcon from "@lucide/svelte/icons/x";

  const { tabStore: store, useSortable, removeTab, setActive } = useTabs();

  import { onMount } from "svelte";
  import Panel from "./Panel.svelte";

  let foo: HTMLElement, bar: HTMLElement;
</script>

<!-- 래퍼에 bind:this -->
<div
  use:useSortable
  class="w-full flex gap-1 justify-start overflow-x-auto hide-scrollbar"
>
  {#each store.tabItems as tab (tab.id)}
    <button
      onclick={setActive(tab.id)}
      class={[
        "tab-item content-center text-center rounded-md h-full select-none px-6 shrink-0",
        tab.active ? "bg-white text-black" : "bg-black text-white",
        "relative group transition-[width,height,background]",
      ]}
      data-id={tab.id}
    >
      <Button
        aria-label="delete"
        class={[
          "delete absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 rounded-full hover:bg-transparent ",
          tab.active ? "hover:text-black" : "hover:text-white",
          "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        ]}
        onclick={removeTab(tab)}
        variant="ghost"
        size="icon"
      >
        <XIcon />
        <span class="sr-only">close tab</span>
      </Button>
      <span>{tab.title.toUpperCase()}</span>
    </button>
  {/each}
</div>
