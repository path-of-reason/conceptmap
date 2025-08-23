import type { Component } from "svelte";
import { ContextApi } from "./context.svelte";

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

const openModal = (modalId?: string) => {
  if (modalId) modalState.currentModalId = modalId;
  if (!modalState.currentModalId || modalState.isOpen) return;
  modalState.isOpen = true;
  ContextApi.enter("modal");
};
const closeModal = () => {
  modalState.isOpen = false;
  ContextApi.leave("modal");
};
const toggleModal = () => {
  if (!modalState.currentModalId) return;
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
