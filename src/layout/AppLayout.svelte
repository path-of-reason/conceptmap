<script lang="ts">
  import { fade } from "svelte/transition";
  import Pane from "./resizable-pane/Pane.svelte";
  import PaneGroup from "./resizable-pane/PaneGroup.svelte";
  import Resizer from "./resizable-pane/Resizer.svelte";
  import { sectionVisible } from "./resizable-pane/sectionStore.svelte";
  import { onMount } from "svelte";
  import { LAYOUT } from "./constant";
  import Headerbar from "./components/Headerbar.svelte";
  import Statusbar from "./components/Statusbar.svelte";
  import LeftSidebar from "./components/LeftSidebar.svelte";
  import Main from "./components/Main.svelte";
  import RightSidebar from "./components/RightSidebar.svelte";
  // import Searchbar from "./components/Searchbar.svelte";
  import "./init"

  let { children } = $props();
  let appVisible = $state(false);

  onMount(() => {
    appVisible = true;
  });


  let mainClass = $derived.by(()=>{
    let className = ""
    const map = sectionVisible().map
    if (map[LAYOUT.STATUS_BAR] !== undefined) {
      map[LAYOUT.HEADER_BAR] ? className += "" : className += " pt-1"
      map[LAYOUT.STATUS_BAR] ? className += "" : className += " pb-1"
    }
    return className
  })
</script>

{#if appVisible}
  <div class="w-screen h-screen" transition:fade>
    <PaneGroup direction="horizontal" class={"transition-colors rounded-lg "}>
      <Pane
        id={LAYOUT.HEADER_BAR}
        class="shrink-0 box-border"
        collapsedClass="blur-lg"
        toggleKey={["space", "t"]} keyMode="leader"
      >
        <Headerbar />
      </Pane>
      <PaneGroup
        direction="vertical"
        class={"relative pt-1 overflow-hidden"+ mainClass}>
        <Pane
          id={LAYOUT.LEFT_SIDEBAR}
          class="shrink-0 text-nowrap box-border absolute top-0 left-0"
          collapsedClass="blur-lg -translate-x-10"
          innerClass="pl-1"
          toggleKey={["space", "e"]} keyMode="leader"
        >
          <LeftSidebar />
        </Pane>
        <Resizer id={LAYOUT.LEFT_SIDEBAR} />
        <PaneGroup direction="horizontal">
          <Main>
            {@render children?.()}
          </Main>
        </PaneGroup>
        <Resizer
          id={LAYOUT.RIGHT_SIDEBAR}
          prev={true}
        />
        <Pane
          id={LAYOUT.RIGHT_SIDEBAR}
          class="shrink-0 overflow-hidden text-nowrap box-border"
          collapsedClass="blur-lg translate-x-10"
          innerClass="pr-1"
          toggleKey={["space", "r"]}
          keyMode="leader"
        >
          <RightSidebar />
        </Pane>
      </PaneGroup>
      <Pane
        id={LAYOUT.STATUS_BAR}
        class="shrink-0 box-border"
        toggleKey={["space", "b"]}
        keyMode="leader"
      >
        <Statusbar  />
      </Pane>
    </PaneGroup>
  </div>
{/if}
