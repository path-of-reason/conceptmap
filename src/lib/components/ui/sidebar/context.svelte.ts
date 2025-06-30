import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";
import { getContext, setContext } from "svelte";
import { SIDEBAR_BASE_CONTEXT_KEY, SIDEBAR_SHORTCUT } from "./constants.js";
import type { Side } from "./types.js";

type Getter<T> = () => T;

export type SidebarStateProps = {
  /**
   * A getter function that returns the current open state of the sidebar.
   * We use a getter function here to support `bind:open` on the `Sidebar.Provider`
   * component.
   */
  open: Getter<boolean>;

  /**
   * A function that sets the open state of the sidebar. To support `bind:open`, we need
   * a source of truth for changing the open state to ensure it will be synced throughout
   * the sub-components and any `bind:` references.
   */
  setOpen: (open: boolean) => void;
};

class SidebarState {
  readonly props: SidebarStateProps;
  ctxKey: Side;
  open = $derived.by(() => this.props.open());
  openMobile = $state(false);
  setOpen: SidebarStateProps["setOpen"];
  #isMobile: IsMobile;
  state = $derived.by(() => (this.open ? "expanded" : "collapsed"));

  constructor(props: SidebarStateProps, ctxKey: Side) {
    this.ctxKey = ctxKey;
    this.setOpen = props.setOpen;
    this.#isMobile = new IsMobile();
    this.props = props;
  }

  // Convenience getter for checking if the sidebar is mobile
  // without this, we would need to use `sidebar.isMobile.current` everywhere
  get isMobile() {
    return this.#isMobile.current;
  }

  // Event handler to apply to the `<svelte:window>`
  handleShortcutKeydown = (e: KeyboardEvent) => {
    const shortcut =
      this.ctxKey === "left" ? SIDEBAR_SHORTCUT.LEFT : SIDEBAR_SHORTCUT.RIGHT;
    if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggle();
    }
  };

  setOpenMobile = (value: boolean) => {
    this.openMobile = value;
  };

  toggle = () => {
    console.log("toggle", this.open);

    return this.#isMobile.current
      ? (this.openMobile = !this.openMobile)
      : this.setOpen(!this.open);
  };
}

/**
 * Instantiates a new `SidebarState` instance and sets it in the context.
 *
 * @param props The constructor props for the `SidebarState` class.
 * @returns  The `SidebarState` instance.
 */
export function setSidebar(
  props: SidebarStateProps,
  ctxKey = SIDEBAR_BASE_CONTEXT_KEY,
): SidebarState {
  const state = new SidebarState(props, ctxKey);
  return setContext(Symbol.for(ctxKey), state);
}

/**
 * Retrieves the `SidebarState` instance from the context. This is a class instance,
 * so you cannot destructure it.
 * @returns The `SidebarState` instance.
 */
export function useSidebar(ctxKey = SIDEBAR_BASE_CONTEXT_KEY): SidebarState {
  return getContext(Symbol.for(ctxKey));
}
