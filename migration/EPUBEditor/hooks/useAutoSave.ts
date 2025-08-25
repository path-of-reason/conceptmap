import { getCurrentWindow } from "@tauri-apps/api/window";
import { debounce } from "lodash-es";

interface UseAutoSaveProps {
  onSaveStart?: () => void;
  onSaveSuccess?: (timestamp: Date) => void;
  onSaveError?: (error: unknown) => void;
  debounceMs?: number;
}

interface UseAutoSaveReturn {
  isAutoSaving: boolean;
  lastAutoSaveTime: Date | null;
  forceSave: () => Promise<boolean>;
  handleContentChange: () => void; // Called by editor on content change
  handleBlur: () => void; // Called by editor on blur
}

const DEFAULT_DEBOUNCE_MS = 2000; // 2 seconds

export function useAutoSave({
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseAutoSaveProps): UseAutoSaveReturn {
  let isAutoSaving = $state(false);
  let lastAutoSaveTime = $state<Date | null>(null);
  let isSavingRef = false; // Use a simple boolean flag for internal lock

  // Reactive access to store state
  let { currentFilePath, hasUnsavedChanges, isSavingFile } = $state(
    editorContentStore.getState(),
  );
  // Subscribe to store changes to keep local reactive state updated
  $effect(() => {
    const unsubscribe = editorContentStore.subscribe((state) => {
      currentFilePath = state.currentFilePath;
      hasUnsavedChanges = state.hasUnsavedChanges;
      isSavingFile = state.isSavingFile;
    });
    return unsubscribe;
  });

  const performSave = async (reason: string): Promise<boolean> => {
    const latestState = editorContentStore.getState(); // Get latest state directly
    const activeCurrentFilePath = latestState.currentFilePath;
    const activeHasUnsavedChanges = latestState.hasUnsavedChanges;
    const activeIsStoreSavingFile = latestState.isSavingFile;

    if (!activeCurrentFilePath) {
      console.log(
        `[useAutoSave] performSave (${reason}): No current file path (read at execution). Skipping save.`,
      );
      return false;
    }
    if (!activeHasUnsavedChanges) {
      console.log(
        `[useAutoSave] performSave (${reason}): No unsaved changes (read at execution). Skipping save.`,
      );
      return true;
    }
    if (isSavingRef || activeIsStoreSavingFile) {
      console.log(
        `[useAutoSave] performSave (${reason}): Save already in progress (hook lock: ${isSavingRef}, store lock: ${activeIsStoreSavingFile}). Skipping.`,
      );
      return false;
    }

    console.log(
      `[useAutoSave] performSave (${reason}): Starting save for ${activeCurrentFilePath}`,
    );
    isSavingRef = true;
    isAutoSaving = true;
    onSaveStart?.();

    try {
      const success = await editorContentStore.saveCurrentFile();
      if (success) {
        const now = new Date();
        lastAutoSaveTime = now;
        onSaveSuccess?.(now);
        console.log(
          `[useAutoSave] performSave (${reason}): Save successful for ${activeCurrentFilePath} at ${now.toISOString()}`,
        );
      } else {
        console.warn(
          `[useAutoSave] performSave (${reason}): Save failed for ${activeCurrentFilePath} (store returned false).`,
        );
        onSaveError?.(new Error("Save operation returned false from store."));
      }
      return success;
    } catch (error) {
      console.error(
        `[useAutoSave] performSave (${reason}): Error during save for ${activeCurrentFilePath}:`,
        error,
      );
      onSaveError?.(error);
      return false;
    } finally {
      isSavingRef = false;
      isAutoSaving = false;
      console.log(
        `[useAutoSave] performSave (${reason}): Save attempt finished for ${activeCurrentFilePath}`,
      );
    }
  };

  const debouncedSave = debounce(() => {
    console.log("[useAutoSave] Debounced function triggered.");
    performSave("debounce");
  }, debounceMs);

  const handleContentChange = () => {
    console.log("[useAutoSave] handleContentChange: Content changed.");
    if (hasUnsavedChanges) {
      console.log(
        "[useAutoSave] handleContentChange: Unsaved changes detected, triggering debounced save.",
      );
      debouncedSave();
    } else {
      console.log(
        "[useAutoSave] handleContentChange: No unsaved changes (or changes were just saved). Debounced save not triggered.",
      );
    }
  };

  const handleBlur = () => {
    console.log("[useAutoSave] handleBlur: Editor blurred.");
    debouncedSave.cancel();

    const latestHasUnsavedChanges =
      editorContentStore.getState().hasUnsavedChanges;

    if (latestHasUnsavedChanges) {
      console.log(
        "[useAutoSave] handleBlur: Unsaved changes detected (read at execution), performing immediate save.",
      );
      performSave("blur");
    } else {
      console.log(
        "[useAutoSave] handleBlur: No unsaved changes (read at execution). Save not performed.",
      );
    }
  };

  const forceSave = async (): Promise<boolean> => {
    console.log("[useAutoSave] forceSave: Manual save triggered.");
    debouncedSave.cancel();
    return performSave("force");
  };

  // Effect for window close requested
  $effect(() => {
    const currentWindow = getCurrentWindow();
    const unlistenPromise = currentWindow.onCloseRequested(async (event) => {
      event.preventDefault();
      alert("[useAutoSave] currentWindow.onCloseRequested: Event triggered.");

      const latestState = editorContentStore.getState();
      const latestHasUnsavedChanges = latestState.hasUnsavedChanges;
      const latestIsStoreSavingFile = latestState.isSavingFile;

      if (isSavingRef || latestIsStoreSavingFile) {
        alert(
          "[useAutoSave] currentWindow.onCloseRequested: Save (local or store) in progress, preventing immediate close.",
        );
        event.preventDefault();
        return;
      }

      if (latestHasUnsavedChanges) {
        alert(
          "[useAutoSave] currentWindow.onCloseRequested: Unsaved changes detected. Attempting to save before close.",
        );
        event.preventDefault();

        const success = await performSave("app-close");
        if (!success) {
          alert(
            "[useAutoSave] currentWindow.onCloseRequested: Save failed. App will remain open as close was prevented.",
          );
        } else {
          alert(
            "[useAutoSave] currentWindow.onCloseRequested: Save successful. Now attempting to close window programmatically.",
          );
          await currentWindow.close();
        }
      } else {
        alert(
          "[useAutoSave] currentWindow.onCloseRequested: No unsaved changes. Allowing app to close normally.",
        );
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  });

  // Effect for debounced save cleanup on unmount or file path change
  $effect(() => {
    return () => {
      console.log(
        "[useAutoSave] $effect cleanup: Cancelling debounced save on unmount or file change for path:",
        currentFilePath,
      );
      debouncedSave.cancel();
    };
  });

  return {
    isAutoSaving,
    lastAutoSaveTime,
    forceSave,
    handleContentChange,
    handleBlur,
  };
}

