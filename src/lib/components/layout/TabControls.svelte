<script lang="ts">
  import { useLayout } from "./layout.store.svelte";

  const { openTab } = useLayout();

  function openDoc1() {
    openTab({ id: 'doc-1', title: 'Document 1' });
  }

  function openDoc2() {
    openTab({ id: 'doc-2', title: 'Document 2' });
  }
</script>

<div class="p-4 border-t">
  <h3 class="font-bold mb-2">Tab Controls</h3>
  <div class="flex gap-2">
    <button onclick={openDoc1} class="p-2 border rounded">Open Doc 1</button>
    <button onclick={openDoc2} class="p-2 border rounded">Open Doc 2</button>
  </div>
</div>
