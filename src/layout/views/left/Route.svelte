<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { fade } from "svelte/transition";

  type Props = {
    isCallapsed?: boolean;
  };
  let { isCallapsed } = $props();

  const routes = [
    {
      title: "Home",
      url: "/",
      icon: Icons.House,
    },
    {
      title: "Editor",
      url: "/editor",
      icon: Icons.Inbox,
    },
    {
      title: "Project Luman",
      url: "/luman",
      icon: Icons.NotebookPen,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: Icons.ScrollText,
    },
  ];
</script>

<div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
  {#each routes as route (route.url)}
    {@const Icon = route.icon}
    <a tabindex={isCallapsed === true ? -1 : 0} class="flex" href={route.url}>
      <Icon />
      <span class="title">{route.title}</span>
    </a>
  {/each}
</div>
