<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { LAYOUT } from "$lib/constant/layout";
  import { API } from "$lib/store/api";
  type Props = {
    class?: string;
  };

  let { class: className }: Props = $props();

  const { toggleCollapsed: leftCollapse, sectionState: leftState } =
    API.section.useSectionStore<"vertical">({
      id: LAYOUT.LEFT_SIDEBAR,
    });
</script>

<button
  onclick={leftCollapse}
  class={["rounded-sm hover:bg-zinc-900", className]}
>
  {#if leftState.collapsed}
    <Icons.PanelLeftOpen class="w-4 h-4 " />
  {:else}
    <Icons.PanelLeftClose class="w-4 h-4" />
  {/if}
</button>
