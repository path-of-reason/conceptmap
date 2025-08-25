<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { page } from "$app/state";
  import { tick, onMount } from "svelte";
  import { slide2 } from "$lib/utils/transition";

  type Props = {
    isCallapsed?: boolean;
  };
  let { isCallapsed } = $props();

  let current = $derived(page.url.pathname);

  const routes = [
    { title: "Home", url: "/", icon: Icons.House },
    { title: "Editor", url: "/editor", icon: Icons.Inbox },
    { title: "Project Luman", url: "/luman", icon: Icons.NotebookPen },
    { title: "Logs", url: "/logs", icon: Icons.ScrollText },
  ];

  // 현재 포커스된 인덱스(초기엔 active 라우트 위치)
  let focusedIndex = $derived(
    routes.findIndex((route) => route.url === current) ?? 0,
  );

  // on tab/arrow 이동 처리
  async function handleKeydown(event: KeyboardEvent, i: number) {
    if (event.key === "ArrowDown") {
      const next = (i + 1) % routes.length;
      focusedIndex = next;
      await tick();
      document.getElementById(`sidebar-link-${next}`)?.focus();
      event.preventDefault();
    }
    if (event.key === "ArrowUp") {
      const prev = (i - 1 + routes.length) % routes.length;
      focusedIndex = prev;
      await tick();
      document.getElementById(`sidebar-link-${prev}`)?.focus();
      event.preventDefault();
    }
  }

  // 첫 mount시 active항목 포커스(옵션)
  onMount(async () => {
    await tick();
    document.getElementById(`sidebar-link-${focusedIndex}`)?.focus();
  });
</script>

<nav
  class="w-full bg-[#170f23] py-3 h-full transition-all duration-200"
  aria-label="Left sidebar"
>
  <div class="flex flex-col space-y-1">
    {#each routes as route, i (route.url)}
      {@const Icon = route.icon}
      <a
        id={"sidebar-link-" + i}
        href={route.url}
        class="flex items-center gap-2.5 text-[#ced3db] px-5 py-2.5 rounded-lg transition
                hover:bg-blue-700/20 hover:text-white
                focus:bg-blue-700/30 focus:outline-none
                w-full
                {current === route.url
          ? 'bg-blue-700/30 text-white font-bold'
          : ''}
                {isCallapsed ? 'justify-center' : ''}"
        aria-label={route.title}
        title={route.title}
        aria-current={current === route.url ? "page" : undefined}
        tabindex="0"
        onkeydown={(e) => handleKeydown(e, i)}
      >
        <Icon size={24} />
        {#if !isCallapsed}
          <span class="ml-2 truncate">{route.title}</span>
        {/if}
      </a>
    {/each}
  </div>
</nav>
