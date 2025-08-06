<script lang="ts">
  import { API } from "$lib/store/api";
  import type { SectionType } from "$lib/types/layout";

  type ToggleKey = string[];
  type ResizerProps = {
    id: SectionType;
    toggleKey?: ToggleKey;
    keyMode?: "normal" | "leader";
    prev?: boolean;
    class?: string;
  };

  let { id, prev = false, class: className }: ResizerProps = $props();

  const { sectionState, onResize, direction, toggleCollapsed } =
    API.section.useSectionStore({ id, prevResizer: prev });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={[
    direction === "vertical" ? "w-1 h-full" : "w-full h-1",
    sectionState.isResize
      ? direction === "vertical"
        ? "cursor-ew-resize bg-gray-300"
        : "cursor-ns-resize bg-gray-300"
      : direction === "vertical"
        ? "hover:bg-gray-300/50 hover:cursor-ew-resize"
        : "hover:bg-gray-300/50 hover:cursor-ns-resize",
    "transition-colors shrink-0 rounded-sm select-none",
    className,
  ]}
  onmousedown={onResize}
  ondblclick={toggleCollapsed}
></div>
