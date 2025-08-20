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

const openModal = () => {
  modalState.isOpen = true;
  API.context.enter("modal");
};
const closeModal = () => {
  modalState.isOpen = false;
  API.context.leave("modal");
};
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
