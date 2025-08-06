<script lang="ts">
  import { API } from "$lib/store/api";
  import { fade } from "svelte/transition";

  const { state: modalState, closeModal } = API.modal;

  // 모달이 열리면 포커스를 잡고, 닫히면 포커스를 복구하는 로직
  // ... (이전 코드에서 설명한 포커스 트랩 로직을 여기에 구현)

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
    class={[
      "absolut top-0 left-0 w-full h-full z-50 bg-black/30 rounded-lg overflow-hidden relative",
      "text-white",
    ]}
    transition:fade={{ duration: 100 }}
    onclick={closeModal}
  >
    {API.modal.state.currentModalId}
    {Modal === undefined}
    {#if Modal}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        onclick={(e) => e.stopPropagation()}
        class={[
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-52",
        ]}
      >
        hello modal
        <Modal />
      </div>
      <!-- <div -->
      <!--   class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" -->
      <!-- > -->
      <!--   <div -->
      <!--     role="dialog" -->
      <!--     aria-modal="true" -->
      <!--     class="bg-white p-6 rounded-lg" -->
      <!--   ></div> -->
      <!-- </div> -->
    {/if}
  </div>
{/if}
