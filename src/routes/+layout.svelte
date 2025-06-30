<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/sidebar.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { ModeWatcher } from "mode-watcher";
  import ModeToggle from "$lib/components/mode-toggle.svelte";
  import "../app.css";

  let { children } = $props();
  const sideLeft = "left";
  const sideRight = "right";

  const tabList = [{ name: "editor" }, { name: "second" }];
</script>

<ModeWatcher />
<Sidebar.Provider ctxKey={sideLeft}>
  <AppSidebar ctxKey={sideLeft} variant="sidebar" collapsible="icon" />
  <Sidebar.Provider ctxKey={sideRight}>
    <main class="flex-1">
      <Tabs.Root value="account" class="w-full h-full ">
        <div class="flex justify-between items-center">
          <Sidebar.Trigger side="left" />
          <Tabs.List>
            {#each tabList as tab (tab.name)}
              <Tabs.Trigger value={tab.name}>
                {tab.name.toUpperCase()}
              </Tabs.Trigger>
            {/each}
          </Tabs.List>
          <div class="grow">
            <!-- empty -->
          </div>
          <ModeToggle />
          <Sidebar.Trigger side="right" />
        </div>
        {#each tabList as tab (tab.name)}
          <Tabs.Content value={tab.name} class="px-2 pb-2">
            {@render children?.()}
          </Tabs.Content>
        {/each}
      </Tabs.Root>
    </main>
    <AppSidebar ctxKey={sideRight} variant="floating" collapsible="offcanvas" />
  </Sidebar.Provider>
</Sidebar.Provider>
