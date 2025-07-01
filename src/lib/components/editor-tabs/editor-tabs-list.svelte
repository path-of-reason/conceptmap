<script lang="ts">
  import { Tabs as TabsPrimitive } from "bits-ui";
  import { cn } from "$lib/utils/index.js";

  type Props = TabsPrimitive.ListProps;
  let { children, class: className, ...rest }: Props = $props();
</script>

<TabsPrimitive.List
  class={cn("flex items-center border-b", className)}
  {...rest}
>
  {@render children?.()}
</TabsPrimitive.List>
