<script lang="ts">
  import { onMount } from "svelte";
  import { useStore } from "./storetest.svelte";
  import { useTabs } from "../useTabs.svelte";
  import Swapy from "./swapy.svelte";
  import Draggable from "./draggable.svelte";
  import Sortable from "./sortable.svelte";
  import SplitPanes from "../SplitPanes.svelte";
  // import { appWindow } from "./webview";
  const { increase, pushList, store } = useStore();
  const { tabStore } = useTabs();

  onMount(() => {});
</script>

<div class="h-full overflow-scroll">
  <div>{store.count}</div>
  <div>{store.list.toString()}</div>
  <button onclick={increase}>increase</button>
  <button onclick={pushList}>pushList</button>
  <a href="https://google.com">Link</a>
  <div>
    {JSON.stringify(
      tabStore.tabItems.find((item) => item.slotId === tabStore.currentId),
    )}
  </div>
  <!-- <Draggable /> -->
  <!-- <Sortable>
    <div>hello inner</div>
  </Sortable> -->
  <SplitPanes />
</div>
