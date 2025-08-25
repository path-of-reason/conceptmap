import { writable } from 'svelte/store';

interface EditorContentState {
  content: string;
  currentFilePath: string | null;
  hasUnsavedChanges: boolean;
  isSavingFile: boolean;
}

const initialState: EditorContentState = {
  content: '',
  currentFilePath: null,
  hasUnsavedChanges: false,
  isSavingFile: false,
};

const { subscribe, set, update } = writable(initialState);

const editorContentStore = {
  subscribe,
  set,
  update,
  // Actions
  setContent: (newContent: string) => update(state => ({ ...state, content: newContent, hasUnsavedChanges: true })),
  setCurrentFile: (path: string | null, content: string) => set({ content, currentFilePath: path, hasUnsavedChanges: false, isSavingFile: false }),
  setHasUnsavedChanges: (value: boolean) => update(state => ({ ...state, hasUnsavedChanges: value })),
  setIsSavingFile: (value: boolean) => update(state => ({ ...state, isSavingFile: value })),

  // Mock save function for now
  saveCurrentFile: async (): Promise<boolean> => {
    editorContentStore.setIsSavingFile(true);
    console.log("Mock saving file...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
    editorContentStore.setHasUnsavedChanges(false);
    editorContentStore.setIsSavingFile(false);
    console.log("Mock file saved.");
    return true;
  },

  // Helper to get current state (for non-reactive contexts)
  getState: () => {
    let currentState: EditorContentState;
    editorContentStore.subscribe(value => { currentState = value; })();
    return currentState!;
  }
};

export { editorContentStore };
