import { moveFocus } from "./focus";
import { addPanel, removePanel } from "./panel";
import { resizeCellHeight, resizeGridCol } from "./resize";
import { workspaceStore } from "./store.svelte";

export const CellActions = {
  splitVertical: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) addPanel(focusCellId, "right");
  },
  splitHorizontal: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) addPanel(focusCellId, "below");
  },
  removeVertical: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) removePanel(focusCellId, "vertical");
  },
  removeHorizontal: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) removePanel(focusCellId, "horizontal");
  },
  moveFocusRight: () => moveFocus("right"),
  moveFocusLeft: () => moveFocus("left"),
  moveFocusDown: () => moveFocus("down"),
  moveFocusUp: () => moveFocus("up"),
  decreaseCellWidth: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) {
      const focusedCell = workspaceStore.layout.cells.find(
        (c) => c.id === focusCellId,
      );
      if (
        focusedCell &&
        focusedCell.col !== undefined // 이제 마지막 열도 조작 가능하므로 이 조건은 필요없음: && workspaceStore.layout.colSizes.length > focusedCell.col + focusedCell.colspan
      ) {
        const delta = -0.1; // 조절할 크기 단위
        resizeGridCol(focusedCell.col, delta); // ✨ delta 값만 넘김
      }
    }
  },
  increaseCellWidth: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) {
      const focusedCell = workspaceStore.layout.cells.find(
        (c) => c.id === focusCellId,
      );
      if (
        focusedCell &&
        focusedCell.col !== undefined // 이제 마지막 열도 조작 가능하므로 이 조건은 필요없음: && workspaceStore.layout.colSizes.length > focusedCell.col + focusedCell.colspan
      ) {
        const delta = 0.1; // 조절할 크기 단위
        resizeGridCol(focusedCell.col, delta); // ✨ delta 값만 넘김
      }
    }
  },
  decreaseCellHeight: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) {
      const focusedCell = workspaceStore.layout.cells.find(
        (c) => c.id === focusCellId,
      );
      if (
        focusedCell &&
        focusedCell.row !== undefined &&
        workspaceStore.layout.rowSizes.length >
          focusedCell.row + focusedCell.rowspan
      ) {
        const currentFrValue = parseFloat(
          workspaceStore.layout.rowSizes[focusedCell.row].toString(),
        );
        const delta = -0.1;
        const newFrValue = currentFrValue + delta;
        resizeCellHeight(focusedCell.row, newFrValue);
      }
    }
  },
  increaseCellHeight: () => {
    const focusCellId = workspaceStore.layout.focusedCellId;
    if (focusCellId) {
      const focusedCell = workspaceStore.layout.cells.find(
        (c) => c.id === focusCellId,
      );
      if (
        focusedCell &&
        focusedCell.row !== undefined &&
        workspaceStore.layout.rowSizes.length >
          focusedCell.row + focusedCell.rowspan
      ) {
        const currentFrValue = parseFloat(
          workspaceStore.layout.rowSizes[focusedCell.row].toString(),
        );
        const delta = 0.1;
        const newFrValue = currentFrValue + delta;
        resizeCellHeight(focusedCell.row, newFrValue);
      }
    }
  },
};
