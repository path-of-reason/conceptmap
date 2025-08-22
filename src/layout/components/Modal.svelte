<script lang="ts">
  import { API } from "$lib/store/api";
  import { fade } from "svelte/transition";

  const { state: modalState, closeModal } = API.modal;

  let modalContainer: HTMLDivElement | null = $state(null);
  let modalContent: HTMLDivElement | null = $state(null);
  let previouslyFocusedElement: HTMLElement | null = null;

  // Focus trapping logic
  $effect(() => {
    if (modalState.isOpen) {
      previouslyFocusedElement = document.activeElement as HTMLElement;
      if (modalContent) {
        const focusableElements = modalContent.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    } else {
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
        previouslyFocusedElement = null;
      }
    }
  });

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === "Tab" && modalContent) {
      const focusableElements = modalContent.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };

  let currentModalView = $derived.by(() => {
    if (!modalState.currentModalId) return null;
    return modalState.modalViews.find(
      (v) => v.id === modalState.currentModalId,
    );
  });
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "p"],
      description: "open command palette",
      callback: () => {
        API.modal.state.currentModalId = API.modal.state.modalViews[0].id;
        API.modal.state.isOpen = true;
      },
      options: { mode: "normal" },
    },
  ]);
</script>

{#if modalState.isOpen}
  {@const Modal = currentModalView?.component}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={modalContainer}
    onkeydown={handleTabKey}
    class={[
      "absolut top-0 left-0 w-full h-full z-50 bg-black/30 rounded-lg overflow-hidden relative",
      "text-black",
    ]}
    transition:fade={{ duration: 100 }}
    onclick={closeModal}
  >
    {#if Modal}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        bind:this={modalContent}
        onclick={(e) => e.stopPropagation()}
        class={["absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"]}
      >
        <Modal />
      </div>
    {/if}
  </div>
{/if}
