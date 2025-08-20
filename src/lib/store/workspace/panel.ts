import type { GridCell } from "$lib/types/workspace";
import { nanoid } from "nanoid";
import { workspaceStore } from "./store.svelte";
import { focusCell, moveFocus } from "./focus";

/**
 * 특정 패널을 기준으로 새로운 빈 패널을 특정 방향에 추가합니다.
 * 기존 패널의 크기를 조정하지 않고, 새로운 행/열을 삽입하여 새 패널을 만듭니다.
 * @param targetCellId 기준이 될 셀의 ID. 이 셀의 위치를 기반으로 새 패널이 추가됩니다.
 * @param direction 'left', 'right', 'above', 'below' - 새 패널을 추가할 방향.
 * @param newTabId 새로 생성될 패널에 할당할 탭 ID (선택 사항).
 */
export function addPanel(
  targetCellId: string,
  direction: "right" | "below",
  newTabId?: string,
) {
  const targetCell = workspaceStore.layout.cells.find(
    (c) => c.id === targetCellId,
  );
  if (!targetCell) {
    console.warn(`[addPanel] Target cell not found: ${targetCellId}`);
    return;
  }

  const newCells: GridCell[] = [];

  switch (direction) {
    case "right":
      workspaceStore.layout.cols++;
      workspaceStore.layout.colSizes.splice(
        targetCell.col + targetCell.colspan,
        0,
        "1fr",
      );
      workspaceStore.layout.cells.forEach((cell) => {
        if (cell.col >= targetCell.col + 1) cell.col++;
      });
      for (let i = 0; i < workspaceStore.layout.rows; i++) {
        const currentCol = targetCell.col + targetCell.colspan;
        const newCell: GridCell = {
          id: nanoid(),
          row: i,
          col: currentCol,
          rowspan: targetCell.rowspan,
          colspan: 1,
          type: "empty",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          activeTabId: newTabId || null,
        };
        newCells.push(newCell);
      }
      break;

    case "below":
      // if (workspaceStore.layout.rows > 8) break;
      workspaceStore.layout.rows++;
      workspaceStore.layout.rowSizes.splice(
        targetCell.row + targetCell.rowspan,
        0,
        "1fr",
      );
      workspaceStore.layout.cells.forEach((cell) => {
        if (cell.row >= targetCell.row + 1) cell.row++;
      });
      for (let i = 0; i < workspaceStore.layout.cols; i++) {
        const currentRow = targetCell.row + targetCell.rowspan;
        const newCell: GridCell = {
          id: nanoid(),
          row: currentRow,
          col: i,
          rowspan: 1,
          colspan: targetCell.colspan,
          type: "empty",
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          activeTabId: newTabId || null,
        };
        newCells.push(newCell);
      }
      break;

    default:
      console.warn(`[addPanel] Invalid direction: ${direction}`);
      return;
  }

  // 모든 셀 (업데이트된 기존 셀 + 새 셀)을 재할당
  workspaceStore.layout.cells = [...workspaceStore.layout.cells, ...newCells];

  // GridCells 배열 정렬 (그리드 렌더링 순서에 영향)
  workspaceStore.layout.cells.sort((a, b) => a.row - b.row || a.col - b.col);

  // Reactivity 트리거
  workspaceStore.layout.rowSizes = [...workspaceStore.layout.rowSizes];
  workspaceStore.layout.colSizes = [...workspaceStore.layout.colSizes];

  // 새로 추가된 셀에 포커스
  focusCell(newCells[0].id);
}
/**
 * 패널 삭제 (병합 기능으로 구현)
 * 이 함수는 mergeCells의 역할로 구현될 예정입니다.
 * 현재는 스텁으로 유지됩니다.
 */
export function removePanel(
  cellId: string,
  direction: "vertical" | "horizontal",
) {
  const targetCell = workspaceStore.layout.cells.find((c) => c.id === cellId);
  if (!targetCell) return;

  if (direction === "vertical" && workspaceStore.layout.cols > 1) {
    const currentCol = targetCell.col + targetCell.colspan;
    moveFocus("left");
    workspaceStore.layout.cols--;
    workspaceStore.layout.colSizes = workspaceStore.layout.colSizes.filter(
      (_, i) => i !== targetCell.col,
    );
    workspaceStore.layout.cells = workspaceStore.layout.cells.filter(
      (cell) => cell.col !== targetCell.col,
    );
    workspaceStore.layout.cells.forEach((cell) => {
      if (cell.col >= currentCol) cell.col--;
    });
  }
  if (direction === "horizontal" && workspaceStore.layout.rows > 1) {
    const currentRow = targetCell.row + targetCell.rowspan;
    moveFocus("up");
    workspaceStore.layout.rows--;
    workspaceStore.layout.rowSizes = workspaceStore.layout.rowSizes.filter(
      (_, i) => i !== targetCell.row,
    );
    workspaceStore.layout.cells = workspaceStore.layout.cells.filter(
      (cell) => cell.row !== targetCell.row,
    );
    workspaceStore.layout.cells.forEach((cell) => {
      if (cell.row >= currentRow) cell.row--;
    });
  }
  workspaceStore.layout.cells.sort((a, b) => a.row - b.row || a.col - b.col);
}

export function toggleLayoutMode() {
  const { mode } = workspaceStore.layout;
  workspaceStore.layout.mode = mode === "grid" ? "bookmark" : "grid";
}
