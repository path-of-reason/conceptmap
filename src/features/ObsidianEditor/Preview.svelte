<script lang="ts">
  import { marked } from "marked";

  let { markdownText, scrollElement } = $props<{
    markdownText: string;
    scrollElement?: HTMLDivElement; // Add scrollElement prop
  }>();

  let htmlContent = $derived(marked.parse(markdownText));
</script>

<div
  class="markdown-rendered-content max-w-none h-full w-full overflow-y-auto"
  bind:this={scrollElement}
>
  {@html htmlContent}
</div>

