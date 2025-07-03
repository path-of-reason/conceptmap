<script lang="ts">
  import * as Draggable from "@shopify/draggable";

  const useDraggable = (container: HTMLUListElement) => {
    const draggableInstance = new Draggable.Sortable(container, {
      draggable: "li",
    });

    // the node has been mounted in the DOM

    $effect(() => {
      // setup goes here

      return () => {
        draggableInstance.destroy();
      };
    });
  };
</script>

<ul use:useDraggable class="flex flex-col gap-1">
  <li class="rounded-lg bg-amber-300 text-center w-full">아이템 1</li>
  <li class="rounded-lg bg-amber-300 text-center w-full">아이템 2</li>
  <li class="rounded-lg bg-amber-300 text-center w-full">아이템 3</li>
</ul>
