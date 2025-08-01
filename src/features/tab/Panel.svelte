<script>
  import { slide } from "svelte/transition";

  let { name, children } = $props();
  let expand = $state(false);
</script>

<div class="panel">
  <button onclick={() => (expand = !expand)}>
    {name}
  </button>

  {#if expand}
    <div class="contents" transition:slide>
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .panel {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 8px;
  }

  .contents {
    padding: 8px;
    margin-top: 16px;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
