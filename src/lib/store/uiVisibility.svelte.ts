import { writable } from 'svelte/store';

const uiVisibilityState = {
  isCommandPaletteOpen: false,
  isFileExplorerOpen: false,
};

const { subscribe, update } = writable(uiVisibilityState);

function toggleCommandPalette() {
  update(state => ({
    ...state,
    isCommandPaletteOpen: !state.isCommandPaletteOpen
  }));
}

function toggleFileExplorer() {
  update(state => ({
    ...state,
    isFileExplorerOpen: !state.isFileExplorerOpen
  }));
}

export const uiVisibilityStore = {
  subscribe,
  toggleCommandPalette,
  toggleFileExplorer,
};
