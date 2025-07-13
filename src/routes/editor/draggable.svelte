<script lang="ts">
  import * as Draggable from "@shopify/draggable";
  const useDraggable = (container: HTMLUListElement) => {
    const draggableInstance = new Draggable.Sortable(container, {
      draggable: "li",
      plugins: [Draggable.Plugins.ResizeMirror],
    });

    $effect(() => {
      draggableInstance.on("drag:start", (evt) => {
        const draggedElement = evt.originalEvent.target as HTMLElement;
        if (draggedElement) {
          draggedElement.classList.add(
            "opacity-75",
            "shadow-lg",
            "border-blue-500",
            "border",
          );
        }
      });

      draggableInstance.on("drag:stop", (evt) => {
        const draggedElement = evt.originalEvent.target as HTMLElement;
        if (draggedElement) {
          draggedElement.classList.remove(
            "opacity-75",
            "shadow-lg",
            "border-blue-500",
            "border",
          );
        }
      });

      return () => {
        draggableInstance.destroy();
      };
    });
  };

  const tabList = [
    { id: 1, title: "Tab 1" },
    { id: 2, title: "Tab 2" },
    { id: 3, title: "Tab 3" },
    { id: 4, title: "Tab 4" },
    { id: 5, title: "Tab 5" },
    { id: 6, title: "Tab 6" },
  ];
</script>

<ul
  use:useDraggable
  class="flex p-1 bg-gray-100 rounded-lg shadow-inner overflow-hidden min-w-[300px]"
>
  {#each tabList as item}
    <li
      class="
        flex-grow flex-shrink-0
        px-4 py-2
        rounded-md
        text-center text-sm font-medium
        cursor-grab
        active:cursor-grabbing
        transition-[width,height,background] duration-200 ease-in-out
        hover:bg-amber-400 hover:text-white
        bg-amber-300 text-gray-800
        whitespace-nowrap
        mx-0.5
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50
      "
    >
      {item.title}
    </li>
  {/each}
</ul>

<style>
  /* Draggable 라이브러리 내부 동작을 위한 CSS (전역 처리) */
  :global(.draggable--original) {
    opacity: 0 !important; /* 드래그 시 원본 요소를 숨깁니다. */
  }

  :global(.draggable-mirror) {
    /* 드래그되는 동안 보이는 복제 요소의 스타일입니다. */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    /* 아래는 Tailwind 유틸리티 클래스에 대응되는 값입니다. */
    background-color: #fbbf24; /* amber-400 */
    color: #ffffff; /* white */
    border-radius: 0.375rem; /* rounded-md */
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1); /* shadow-lg */
    padding: 0.5rem 1rem; /* px-4 py-2 (spacing.2, spacing.4) */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    min-width: 80px; /* 탭 아이템의 예상되는 최소 너비 */
  }
</style>
