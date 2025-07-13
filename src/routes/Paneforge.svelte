<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";

  let paneOne: ReturnType<typeof Pane>;
  let paneTwo: ReturnType<typeof Pane>;
  let resize = $state(false);
  let leftCollapsed = $state(false);
  let rightCollapsed = $state(false);
  const togglePaneOne = () => {
    if (leftCollapsed) paneOne?.expand();
    else paneOne?.collapse();
  };
  const togglePaneTwo = () => {
    if (rightCollapsed) paneTwo?.expand();
    else paneTwo?.collapse();
  };
  const offResizerAnimation = () => {
    resize = true;
    document.addEventListener("mouseup", onResizerAnimation);
  };
  const onResizerAnimation = () => {
    resize = false;
    document.removeEventListener("mouseup", onResizerAnimation);
  };
</script>

<PaneGroup
  direction="horizontal"
  class="w-full h-full rounded-lg overflow-hidden"
>
  <button onclick={togglePaneOne}> Expand left </button>
  <button onclick={togglePaneTwo}> Expand right </button>
  <Pane
    defaultSize={50}
    collapsedSize={5}
    collapsible={true}
    minSize={15}
    bind:this={paneOne}
    onCollapse={() => (leftCollapsed = true)}
    onExpand={() => (leftCollapsed = false)}
    class={["bga-white", resize ? "" : "transition-all duration-700"]}
  >
    left sidebar
  </Pane>
  <PaneResizer class="w-1 bg-gray-300" onmousedown={offResizerAnimation} />
  <Pane defaultSize={50}>
    <PaneGroup direction="vertical">
      <Pane defaultSize={50} class="bag-red-500">pane2</Pane>
      <PaneResizer class="h-1 bg-gray-300" />
      <Pane defaultSize={50} class="bag-sky-500">pane3</Pane>
    </PaneGroup>
  </Pane>
  <PaneResizer class="w-1 bg-gray-300" onmousedown={offResizerAnimation} />
  <Pane
    defaultSize={50}
    collapsedSize={0}
    collapsible={true}
    minSize={0}
    bind:this={paneTwo}
    onCollapse={() => (rightCollapsed = true)}
    onExpand={() => (rightCollapsed = false)}
    class={["bga-white", resize ? "" : "transition-all"]}
  >
    right sidebar
  </Pane>
</PaneGroup>
