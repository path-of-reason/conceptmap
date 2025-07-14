<script lang="ts">
  type PaneGroupProps = {
    direction?: 'horizontal' | 'vertical'
    children: any
    class?: string
  };

  let {
    direction = 'horizontal',
    children,
    class: className = ''
  }: PaneGroupProps = $props();
</script>

<div class={["w-full h-full", direction !== 'horizontal' ? 'flex' : 'flex flex-col', className]}>
  {@render children?.()}
</div>
