<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { fade, slide } from "svelte/transition";
  let {} = $props();

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
      title: "Editor/hello-world",
      url: "/editor/hello-world",
      icon: Icons.IceCream,
    },
    {
      title: "Webview",
      url: "/webview/hello",
      icon: Icons.Calendar,
    },
    {
      title: "Search",
      url: "/search",
      icon: Icons.Search,
    },
    {
      title: "Google",
      url: "/webview/www.google.com",
      icon: Icons.Search,
    },
    {
      title: "Google2",
      url: "https://www.google.com",
      icon: Icons.Search,
    },
  ];
</script>

<div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
  {#each routes as route (route.url)}
    {@const Icon = route.icon}
    <a class="flex" href={route.url}>
      <Icon />
      <span class="title">{route.title}</span>
    </a>
  {/each}
</div>
