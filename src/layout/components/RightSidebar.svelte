<script lang="ts">
  import { slide } from "svelte/transition";
  import { API } from "$lib/store/api";
  import { onMount } from "svelte";
  import { LAYOUT } from "$lib/constant/layout";
  const {
    viewState,
    hasView,
    getView,
    getRegisteredViews,
    setActiveRightSidebarView,
  } = API.view;

  const { sectionState } = API.section.useSectionStore<"vertical">({
    id: LAYOUT.RIGHT_SIDEBAR,
  });

  const registeredViews = getRegisteredViews().filter(
    (v) => v.type === LAYOUT.RIGHT_SIDEBAR,
  );

  // viewId변경되면 자동으로 view를 업데이트한다.
  const activeView = $derived.by(() => {
    if (viewState.rightSidebarViewId && hasView(viewState.rightSidebarViewId)) {
      return getView(viewState.rightSidebarViewId)!;
    }
    return null;
  });

  onMount(() => {
    if (!viewState.rightSidebarViewId)
      setActiveRightSidebarView(registeredViews[0]?.id);
  });

  const sidebarClick = (viewId: string) =>
    setActiveRightSidebarView(
      viewState.rightSidebarViewId === viewId ? null : viewId,
    );
</script>

<div
  class={[
    "rounded-md overflow-hidden w-full h-full ",
    "flex flex-col",
    "bg-black/20 text-white/70",
  ]}
>
  <div class="grow w-full h-full flex flex-col overflow-hidden">
    {#if activeView}
      {@const Compo = activeView.component}
      <Compo />
    {:else}
      <p class="p-2">사이드바 뷰를 선택해주세요.</p>
    {/if}
  </div>
  {#if !sectionState.collapsed}
    <div transition:slide class="flex-none">
      <div class="flex justify-around bg-black/30 text-nowrap p-1">
        {#each registeredViews as view (view.id)}
          <button
            class={[
              "w-full flex justify-center",
              "h-5 p-px rounded-xs hover:bg-black/50 transition-colors",
              viewState.rightSidebarViewId === view.id
                ? "text-white"
                : "text-zinc-500",
            ]}
            onclick={() => sidebarClick(view.id)}
            aria-label={view.name}
          >
            {#if view.icon}
              {@const Icon = view.icon}
              <Icon class="w-4 h-4" />
            {:else}
              {view.name.substring(0, 1)}
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>