<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import LeftSidebar from "$lib/components/leftSidebar.svelte";
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";
  import Main from "./Main.svelte";
  let { children } = $props();
  const sideLeft = "left";
  const sideRight = "right";
</script>

<ModeWatcher />
<Sidebar.Provider ctxKey={sideLeft}>
  <LeftSidebar ctxKey={sideLeft} variant="floating" collapsible="icon" />
  <Sidebar.Provider ctxKey={sideRight}>
    <Main>
      {@render children?.()}
    </Main>
    <!-- 이거 새로 만들어서 변경할것 <RightSidebar></RightSidebar> -->
    <LeftSidebar ctxKey={sideRight} variant="floating" collapsible="offcanvas" />
  </Sidebar.Provider>
</Sidebar.Provider>
