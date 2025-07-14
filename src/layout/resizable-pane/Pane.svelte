<script lang="ts">
  import { pluginApi } from "$lib/plugin/api";
  import { useLayoutStore } from "./layoutStore.svelte";

  type PaneProps = {
    id:string
    // viewId?: string
    class?: string
    collapsedClass?: string
    children?: any
  };
  let {id, class: className, collapsedClass, children }: PaneProps = $props();

  const { sectionState , isVerticalSectionState} = useLayoutStore({id});

  // const currentViewComponent = $derived(viewId ? pluginApi.getView(viewId)?.component : undefined);

  const styles = $derived(
    isVerticalSectionState(sectionState) ? `width: ${sectionState.w}px; height: 100%;` : `height: ${sectionState.h}px; width: 100%;`
  )
</script>

<div
  style={styles}
  class={[
  "overflow-hidden relative",
  sectionState.collapsed && collapsedClass,
  !sectionState.isResize && "transition-all duration-200",
  className]}>

  <!-- {#if currentViewComponent}
    {@const Component = currentViewComponent}
    <Component/>
  {:else} -->
    {@render children?.()}
  <!-- {/if} -->

  {#if sectionState.isFocused}
    <div class="absolute top-2 right-2 text-white bg-white rounded-full w-2 h-2"></div>
  {/if}
</div>
