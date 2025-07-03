<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import type { TabItem } from "./layout.store.svelte";

  let {
    tabs,
    activeTabId,
    closeTab,
    setActiveTab,
  }: {
    tabs: TabItem[];
    activeTabId: string;
    closeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
  } = $props();
</script>

{#key activeTabId}
<Tabs.Root value={activeTabId} onValueChange={(id) => { if (id) setActiveTab(id); }}>
  <Tabs.List>
    {#each tabs as tab (tab.id)}
      <Tabs.Trigger value={tab.id}>
        {tab.title}
        <button onclick={() => closeTab(tab.id)} class="ml-2">x</button>
      </Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each tabs as tab (tab.id)}
    <Tabs.Content value={tab.id}>
      <p>Content for {tab.title}</p>
    </Tabs.Content>
  {/each}
</Tabs.Root>
{/key}
