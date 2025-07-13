<script lang="ts">
  import { layoutConfig, useLayoutStore } from "./layoutStore.svelte";

  type PaneProps = {
    id:string
    class?: string;
    collapsedClass?: string
    children?: any;
  };
  let {id,  class: className, collapsedClass, children }: PaneProps = $props();

  const { sectionState , isVerticalSectionState} = useLayoutStore({id});

  const styles = $derived(
    isVerticalSectionState(sectionState) ? `width: ${sectionState.w}px; height: 100%;` : `height: ${sectionState.h}px; width: 100%;`
  )
</script>

<div
  style={styles}
  class={[
  "overflow-hidden relative",
  sectionState.collapsed && collapsedClass,
  !sectionState.isResize && "transition-all duration-100",
  className]}>
  {@render children?.()}
  {#if sectionState.isFocused}
  <div class="absolute top-2 right-2 text-white bg-white rounded-full w-2 h-2">
  </div>
  {/if}
</div>
