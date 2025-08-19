<script lang="ts">
  import { API } from "$lib/store/api";
  import type { SectionType } from "$lib/types/layout";

  type ToggleKey = string[];
  const { useSectionStore, isVertical } = API.section;

  /**
   * innerClass : 내부 래퍼 클래스
   */
  type PaneProps = {
    id: SectionType;
    toggleKey?: ToggleKey;
    keyMode?: "normal" | "leader";
    class?: string;
    innerClass?: string;
    collapsedClass?: string;
    children?: any;
    onfocusin?: () => void;
    onfocusout?: () => void;
  };
  let {
    id,
    toggleKey,
    keyMode,
    class: className,
    innerClass,
    collapsedClass,
    children,
    onfocusin,
    onfocusout,
  }: PaneProps = $props();

  const { sectionState, toggleCollapsed } = useSectionStore({ id });

  if (toggleKey && keyMode)
    API.hotkey.register(
      toggleKey,
      toggleCollapsed,
      "LAYOUT: toggle layout " + id,
      {
        mode: keyMode,
      },
    );

  const styles = $derived(
    isVertical(sectionState)
      ? `width: ${sectionState.w}px; height: 100%;`
      : `height: ${sectionState.h}px; width: 100%;`,
  );
</script>

<div
  style={styles}
  class={[
    "overflow-hidden relative",
    sectionState.collapsed && collapsedClass,
    sectionState.isResize ? "select-none" : "transition-all duration-200",
    className,
  ]}
  {onfocusin}
  {onfocusout}
>
  <div class={["w-full h-full", innerClass]}>
    {@render children?.()}
  </div>
  {#if sectionState.isFocused}
    <div
      class="absolute top-2 right-2 text-white bg-white rounded-full w-2 h-2"
    ></div>
  {/if}
</div>
