<script lang="ts">
  import { slide } from "svelte/transition";

  // type Props = {
  //   api: {
  //     useLayoutStore: any;
  //   };
  // };
  // let { api } = $props();

  // const { sectionState } = api.useLayoutStore({
  //   id: "leftSidebar",
  // });

  // const { sectionState } = api.useLayoutStore<"vertical">({
  //   id: "leftSidebar",
  // });
</script>

<div class="rounded-lg overflow-hidden bg-amber-400 w-full h-full">
  <!-- {#if !sectionState.collapsed} -->
  <div transition:slide class="w-full text-center bg-emerald-400 text-nowrap">
    high
  </div>
  <!-- {/if} -->
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
</div>
