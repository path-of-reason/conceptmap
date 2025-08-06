<script lang="ts">
  import "$lib/store/initials"
  import "../app.css";
  import AppLayout from "@/layout/AppLayout.svelte";

  let { children } = $props();

</script>

<div class="w-screen h-screen bg-transparent">
  <AppLayout>
    {@render children?.()}
  </AppLayout>
</div>
