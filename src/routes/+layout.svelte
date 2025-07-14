<script lang="ts">
  import "../app.css";
  // import AppLayout from "./AppLayout.svelte";
  import AppLayout from "../layout/AppLayout.svelte"

  let { children } = $props();

  const origin = false
</script>

<div class="w-screen h-screen bg-transparent">
    <AppLayout>
      {@render children?.()}
    </AppLayout>
</div>
