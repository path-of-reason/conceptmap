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
    setActiveLeftSidebarView,
  } = API.view;
  const { sectionState } = API.section.useSectionStore<"vertical">({
    id: LAYOUT.LEFT_SIDEBAR,
  });

  const registeredViews = getRegisteredViews().filter(
    (v) => v.type === LAYOUT.LEFT_SIDEBAR,
  );

  // viewId변경되면 자동으로 view를 업데이트한다.
  const activeView = $derived.by(() => {
    if (viewState.leftSidebarViewId && hasView(viewState.leftSidebarViewId)) {
      const view = getView(viewState.leftSidebarViewId)!;
      return view;
    }
    return null;
  });

  onMount(() => {
    if (!viewState.leftSidebarViewId)
      setActiveLeftSidebarView(registeredViews[0]?.id);
  });

  function sidebarClick(viewId: string) {
    if (viewState.leftSidebarViewId === viewId) setActiveLeftSidebarView(null);
    else setActiveLeftSidebarView(viewId);
  }
</script>

<div
  class={[
    "rounded-md overflow-hidden w-full h-full ",
    "flex flex-col",
    "bg-black/20 text-white/70",
  ]}
>
  {#if !sectionState.collapsed}
    <div transition:slide class={["text-center bg-black/30 text-nowrap"]}>
      space
      <button onclick={() => API.section.saveCurrentSizeAsDefault(LAYOUT.LEFT_SIDEBAR)}>Save Size</button>
    </div>
  {/if}
  <div class="grow w-full h-full flex flex-col">
    {#if activeView}
      {@const Compo = activeView.component}
      <Compo isCallapsed={sectionState.collapsed} />
    {:else}
      <p class="p-2">사이드바 뷰를 선택해주세요.</p>
    {/if}
  </div>
  {#if !sectionState.collapsed}
    <div transition:slide class="flex-none">
      <div class={["text-center bg-green-700/20 text-nowrap"]}>user</div>
      <div class="flex justify-around bg-black/30 text-nowrap p-1">
        {#each registeredViews as view (view.id)}
          <button
            class={[
              "w-full flex justify-center",
              "h-5 p-px rounded-xs hover:bg-black/50 transition-colors",
              viewState.leftSidebarViewId === view.id
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