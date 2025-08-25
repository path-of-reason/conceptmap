<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { slide2 } from "$lib/utils/transition";
  import * as Icons from "@lucide/svelte/icons";
  import { fade, slide } from "svelte/transition";

  type Props = {
    class?: string;
    isCallapsed?: boolean;
  };
  const { class: className }: Props = $props();

  type Tab = {
    id: string;
    title: string;
    content: string;
  };

  let tabList = $state<Tab[]>([
    {
      id: "tab1",
      title: "Tab 1",
      content: "Content for Tab 1",
    },
    {
      id: "tab2",
      title: "Tab 2",
      content: "Content for Tab 2",
    },
  ]);
</script>

<div>
  {#each tabList as tab}
    <div class="tab-item flex gap-1">
      <div class="tab-header">{tab.title}</div>
      <div class="tab-content">{tab.content}</div>
    </div>
  {/each}
</div>
