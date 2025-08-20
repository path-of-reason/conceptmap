import { workspaceStore } from "./store.svelte";

export function focusCell(cellId: string | null) {
  return (workspaceStore.layout.focusedCellId = cellId);
}

export function moveFocus(direction: "up" | "down" | "left" | "right") {
  const cells = workspaceStore.layout.cells;
  const currentFocusCellId = workspaceStore.layout.focusedCellId;
  const currentFocusCell = cells.find(
    (cell) => cell.id === currentFocusCellId,
  )!;
  if (!currentFocusCell) {
    workspaceStore.layout.focusedCellId = cells[0].id;
    return;
  }

  let nextCol = 0;
  let nextRow = 0;
  switch (direction) {
    case "right":
      if (currentFocusCell.col === workspaceStore.layout.cols - 1) nextCol = 0;
      else nextCol = currentFocusCell.col + 1;
      nextRow = currentFocusCell.row;
      break;
    case "left":
      if (currentFocusCell.col === 0) nextCol = workspaceStore.layout.cols - 1;
      else nextCol = currentFocusCell.col - 1;
      nextRow = currentFocusCell.row;
      break;
    case "down":
      if (currentFocusCell.row === workspaceStore.layout.rows - 1) nextRow = 0;
      else nextRow = currentFocusCell.row + 1;
      nextCol = currentFocusCell.col;
      break;
    case "up":
      if (currentFocusCell.row === 0) nextRow = workspaceStore.layout.rows - 1;
      else nextRow = currentFocusCell.row - 1;
      nextCol = currentFocusCell.col;
      break;
  }
  const nextCell = workspaceStore.layout.cells.find(
    (cell) => cell.col === nextCol && cell.row === nextRow,
  );
  if (!nextCell) return;
  focusCell(nextCell.id);
  return nextCell;
}
