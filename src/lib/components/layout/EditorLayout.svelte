<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable";
  import TabbedPane from "./TabbedPane.svelte";
  import TabControls from "./TabControls.svelte";
  import { useLayout } from "./layout.store.svelte";

  const { tabs, activeTabId, closeTab, setActiveTab } = useLayout();

  const mainTabs = $derived(tabs.filter((t) => t.location === "main"));
  const sidebarTabs = $derived(tabs.filter((t) => t.location === "sidebar"));
</script>

<Resizable.PaneGroup
  direction="horizontal"
  class="h-full w-full rounded-lg border"
>
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <TabbedPane tabs={sidebarTabs} {activeTabId} {closeTab} {setActiveTab} />
      <TabControls />
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>
    <div class="flex h-full items-center justify-center p-6">
      <TabbedPane tabs={mainTabs} {activeTabId} {closeTab} {setActiveTab} />
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
