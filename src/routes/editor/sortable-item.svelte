<script lang="ts">
  import type { UniqueIdentifier } from "@dnd-kit-svelte/core";
  import { CSS, styleObjectToString } from "@dnd-kit-svelte/utilities";
  import { useSortable } from "@dnd-kit-svelte/sortable";

  interface Task {
    id: UniqueIdentifier;
    content: string;
  }

  let { task }: { task: Task } = $props();

  const {
    attributes,
    listeners,
    node,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: task.id,
  });

  const style = $derived(
    styleObjectToString({
      transform: CSS.Transform.toString(transform.current),
      transition: isSorting.current ? transition.current : undefined,
      zIndex: isDragging.current ? 1 : undefined,
    }),
  );
</script>

<div
  class="relative select-none"
  bind:this={node.current}
  {style}
  {...listeners.current}
  {...attributes.current}
>
  <div
    class={[
      "p-4 bg-white rounded-[18px] text-black ",
      { invisible: isDragging.current }, // 뒤에 있는것만 true
    ]}
  >
    {task.content}
  </div>

  {#if isDragging.current}
    <div
      class="absolute top-0 left-0 flex items-center justify-center abs inset-0"
    >
      <div
        class={[
          "bg-orange-500/10 rounded-[18px]",
          "border-3 border-orange-400 border-dashed",
          "w-full h-full flex items-center justify-center",
        ]}
      >
        <span class="text-orange-400">Moving: {task.content}</span>
      </div>
    </div>
  {/if}
</div>
