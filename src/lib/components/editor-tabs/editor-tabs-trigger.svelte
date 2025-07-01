<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils/index.js";

  type $Props = TabsPrimitive.TriggerProps;
  let {children, value, class: className, ...rest }: $Props = $props();
</script>

<TabsPrimitive.Trigger
  {value}
  class={cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-t-md border-x border-t border-transparent px-4 py-2 text-sm font-medium ring-offset-background transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=active]:-mb-px data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</TabsPrimitive.Trigger>
