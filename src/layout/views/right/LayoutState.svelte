<script lang="ts">
  import { API } from "$lib/store/api";

  const list = $derived.by(() => {
    const { list } = API.section.sectionVisible();
    return list;
  });
  const { state } = API.modal;
</script>

{#each list as { id, visible }}
  <div class="flex gap-2 items-center">
    <div class="text-xl">{id}</div>
    <div class={[visible && "bg-red-600 rounded-md px-1"]}>{visible}</div>
  </div>
{/each}
<div class="flex gap-2 items-center">
  <div class="text-xl">Modal</div>
  <div class={[state.isOpen && "bg-red-600 rounded-md px-1"]}>
    {state.isOpen}
  </div>
</div>
