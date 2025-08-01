<script lang="ts">
  import {
    DndContext,
    useDraggable,
    useDroppable,
    type DragEndEvent,
  } from "@dnd-kit-svelte/core";

  const { isOver, node: droppableNode } = useDroppable({ id: "droppable" });
  const {
    attributes,
    listeners,
    transform,
    node: draggableNode,
  } = useDraggable({ id: "draggable" });

  let isDropped = $state(false);
  const onDragEnd = (e: DragEndEvent) => {
    if (e.over && e.over.id === "droppable") {
      isDropped = true;
    }
  };
</script>

<DndContext {onDragEnd}>
  {#if !isDropped}
    <button
      bind:this={draggableNode.current}
      {...listeners.current}
      {...attributes.current}
      class={[
        "bg-blue-400 rounded-md px-2 text-blue-800 font-bold border-blue-500 border-2",
        transform.current &&
          `translate-x-[${transform.current.x}px] translate-y-[${transform.current.y}px]`,
      ]}
    >
      drag button
    </button>
  {/if}
  <div
    bind:this={droppableNode.current}
    class={[
      "w-1/2 h-32 text-green-800 rounded-lg px-2 font-bold",
      isOver ? "bg-green-400" : "bg-gray-400",
    ]}
  >
    droppable
    {#if isDropped}
      <button
        bind:this={draggableNode.current}
        {...listeners.current}
        {...attributes.current}
        draggable
        class={[
          "bg-blue-400 rounded-md px-2 text-blue-800 font-bold border-blue-500 border-2",
          transform.current &&
            `translate-x-[${transform.current.x}px] translate-y-[${transform.current.y}px]`,
        ]}
      >
        drag button
      </button>
    {:else}
      <div>drop here</div>
    {/if}
  </div>
</DndContext>
