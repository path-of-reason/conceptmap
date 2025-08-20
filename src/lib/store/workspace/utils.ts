import { focusCell } from "./focus";
import { workspaceStore } from "./store.svelte";
import { assignTabToCell } from "./tab";

export const CellUtil = {
  assignTabToCell,
  focusCell,
  getFocusedCell: () =>
    workspaceStore.layout.cells.find(
      (c) => c.id === workspaceStore.layout.focusedCellId,
    ),
  getLeftSideCells: () =>
    CellUtil.getFocusedCell()
      ? workspaceStore.layout.cells
          .filter(
            (cell) =>
              cell.col < CellUtil.getFocusedCell()!.col &&
              cell.row < workspaceStore.layout.rows,
          )
          .sort((a, b) => a.col - b.col || a.row - b.row)
      : [],
  getRightSideCells: () =>
    CellUtil.getFocusedCell()
      ? workspaceStore.layout.cells
          .filter(
            (cell) =>
              cell.col + cell.colspan >=
                CellUtil.getFocusedCell()!.col +
                  CellUtil.getFocusedCell()!.colspan &&
              cell.row < workspaceStore.layout.rows,
          )
          .sort((a, b) => a.col - b.col || a.row - b.row)
      : [],
};
