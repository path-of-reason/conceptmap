import type { Component } from "svelte";
type Modal = {
  id: string;
  type: "full" | "left" | "right" | "top" | "bottom";
  component: Component<any, {}, "">;
};
type ModalState = {
  isOpen: boolean;
  prevActiveElement: HTMLElement | null;
  currentModalId: string | null;
  modalViews: Modal[];
};
const modalState = $state<ModalState>({
  isOpen: false,
  prevActiveElement: null,
  currentModalId: null,
  modalViews: [],
});

const openModal = () => (modalState.isOpen = true);
const closeModal = () => (modalState.isOpen = false);
const toggleModal = () => {
  modalState.isOpen = !modalState.isOpen;
  console.log("toggle modal", modalState.isOpen);
};

const registerModalViewAll = (modalViewList: Modal[]) =>
  modalState.modalViews.push(...modalViewList);

export const ModalApi = {
  state: modalState,
  openModal,
  closeModal,
  toggleModal,
  registerModalViewAll,
};
