<script lang="ts">
  // import { PluginApi } from "$lib/plugin/api";
  // import { load } from "$lib/plugin/pluginLoadStore.svelte";
  // import type { SvelteComponent } from "svelte";
  import { isVertical, useSectionStore } from "./sectionStore.svelte";
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
    import type { LayoutType } from "../types";

  type ToggleKey = string[];

  /**
   * innerClass : 내부 래퍼 클래스
   */
  type PaneProps = {
    id:LayoutType
    toggleKey?: ToggleKey;
    keyMode?: "normal" | "leader";
    class?: string
    innerClass?: string
    collapsedClass?: string
    children?: any
  };
  let {id,
    toggleKey,
    keyMode,
    class: className,
    innerClass,
    collapsedClass, children }: PaneProps = $props();

  const { sectionState, toggleCollapsed} = useSectionStore({id});

  if (toggleKey && keyMode) {
    const regId = hotkeys.register(
      toggleKey,
      toggleCollapsed,
      "toggle layout " + id,
      {
        mode: keyMode,
      },
    );
  }

  const styles = $derived(
    isVertical(sectionState) ? `width: ${sectionState.w}px; height: 100%;` : `height: ${sectionState.h}px; width: 100%;`
  )
</script>

<div
  style={styles}
  class={[
  "overflow-hidden relative",
  sectionState.collapsed && collapsedClass,
  sectionState.isResize ? "select-none" : "transition-all duration-200",
  className]}>
    <div class={["w-full h-full", innerClass]}>
      {@render children?.()}
    </div>
  {#if sectionState.isFocused}
    <div class="absolute top-2 right-2 text-white bg-white rounded-full w-2 h-2"></div>
  {/if}
</div>
