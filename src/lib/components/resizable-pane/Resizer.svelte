<script lang="ts">
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
  import { useLayoutStore } from "./layoutStore.svelte";

  type ToggleKey = ["normal" | "leader", string];
  type ResizerProps = {
    id: string;
    toggleKey?: ToggleKey;
    prev?: boolean;
    class?: string;
  };

  let {
    id,
    toggleKey,
    prev = false,
    class: className,
  }: ResizerProps = $props();

  const { sectionState, onResize, direction, toggleCollapsed } = useLayoutStore(
    { id, prevResizer: prev },
  );
  if (toggleKey) {
    const id = hotkeys.register(toggleKey[1], toggleCollapsed, {
      mode: toggleKey[0],
    });
    console.log("Registered hotkey:", id, toggleKey);
  }
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
    "transition-colors shrink-0 rounded-sm",
    className,
  ]}
  onmousedown={onResize}
  ondblclick={toggleCollapsed}
></div>
