<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { LAYOUT } from "$lib/constant/layout";
  import { API } from "$lib/store/api";
  type Props = {
    class?: string;
  };

  let { class: className }: Props = $props();

  const { toggleCollapsed: rightCollapse, sectionState: rightState } =
    API.section.useSectionStore<"vertical">({
      id: LAYOUT.RIGHT_SIDEBAR,
    });
</script>

<button
  onclick={rightCollapse}
  class={["rounded-sm shrink-0 hover:bg-zinc-900", className]}
>
  {#if rightState.collapsed}
    <Icons.PanelLeftClose class="w-4 h-4" />
  {:else}
    <Icons.PanelLeftOpen class="w-4 h-4" />
  {/if}
</button>
