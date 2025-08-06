<script lang="ts">
  import Grid from "@/layout/work-space/Grid.svelte";
  import Bookmark from "@/layout/work-space/Bookmark.svelte";
  import { API } from "$lib/store/api";
</script>

<div class="h-full w-full overflow-hidden">
  {#if API.workspace.store.layout.mode === "grid"}
    <Grid />
  {:else if API.workspace.store.layout.mode === "bookmark"}
    <Bookmark />
  {/if}
</div>
