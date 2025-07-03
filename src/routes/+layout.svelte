<script lang="ts">
  import "../app.css";
  import AppLayout from "./AppLayout.svelte";

  let { children } = $props();
</script>

<div class="w-screen h-screen bg-transparent">
  <AppLayout>
    {@render children?.()}
  </AppLayout>
</div>
