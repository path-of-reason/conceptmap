<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils";
  import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
  import PanelRightIcon from "@lucide/svelte/icons/panel-right";
  import type { ComponentProps } from "svelte";
  import { useSidebar } from "./context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    side = "left",
    onclick,
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
    side: "left" | "right";
  } = $props();

  const sidebar = useSidebar(side);
</script>

<Button
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  variant="ghost"
  size="icon"
  class={cn("size-7", className)}
  type="button"
  onclick={(e: MouseEvent) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  {...restProps}
>
  {#if side === "left"}
    <PanelLeftIcon />
  {:else}
    <PanelRightIcon />
  {/if}
  <span class="sr-only">Toggle Sidebar</span>
</Button>
