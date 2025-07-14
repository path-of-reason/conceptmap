<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import HouseIcon from "@lucide/svelte/icons/house";
  import InboxIcon from "@lucide/svelte/icons/inbox";
  import SearchIcon from "@lucide/svelte/icons/search";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import type { Side } from "./ui/sidebar/types";
  import * as DropdownMenu from "./ui/dropdown-menu";

  type SidebarProps = {
    ctxKey: Side;
    collapsible: "none" | "offcanvas" | "icon";
    variant?: "sidebar" | "floating" | "inset";
  };
  let { ctxKey, variant = "sidebar", collapsible }: SidebarProps = $props();
  const sidebar = Sidebar.useSidebar(ctxKey);
  const open = $derived.by(() => sidebar.open);

  const routes = [
    {
      title: "Home",
      url: "/",
      icon: HouseIcon,
    },
    {
      title: "Editor",
      url: "/editor",
      icon: InboxIcon,
    },
    {
      title: "Blog",
      url: "/blog",
      icon: CalendarIcon,
    },
    {
      title: "Search",
      url: "/search",
      icon: SearchIcon,
    },
  ];
</script>

<Sidebar.Root {ctxKey} {variant} {collapsible}>
  {#if open}
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton {...props}>
                  Select Vault
                  <ChevronDown class="ml-auto" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
              <DropdownMenu.Item>
                <span>first vault</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <span>second vault</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
  {/if}
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each routes as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props }: { props: Record<string, unknown> })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  {#if open}
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  Username
                  <ChevronUp class="ml-auto" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              side="top"
              class="w-(--bits-dropdown-menu-anchor-width)"
            >
              <DropdownMenu.Item>
                <span>Account</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <span>Billing</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <span>Sign out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  {/if}
</Sidebar.Root>
