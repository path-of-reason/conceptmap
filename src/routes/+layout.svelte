<script lang="ts">
    import App from "$lib/components/resizable-pane/App.svelte";
  import "../app.css";
  import AppLayout from "./AppLayout.svelte";
    import Paneforge from "./Paneforge.svelte";
    import SplitPanes from "./SplitPanes.svelte";

  let { children } = $props();

  const origin = false
</script>

<div class="w-screen h-screen bg-transparent">
{#if origin}
    <AppLayout>
      {@render children?.()}
    </AppLayout>
  {:else}
  <!-- <SplitPanes/> -->
  <!-- <Paneforge/> -->
  <App/>
{/if}
</div>
