<script lang="ts">
  import { API } from "$lib/store/api";

  let { children } = $props();
</script>

<main
  class={[
    "w-full h-full rounded-md overflow-y-scroll",
    "bg-black/20 text-white/50",
    API.layout.state.isSectionResize && "select-none",
  ]}
>
  {@render children?.()}
</main>
