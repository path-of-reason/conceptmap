import { nanoid } from "nanoid";
import type { Tab, GridCell, WorkspaceLayout } from "$lib/types/workspace";

const initialTabs: Tab[] = [
  {
    id: nanoid(),
    title: "Welcome.md",
    type: "file",
    content: "path/to/welcome.md",
  },
  {
    id: nanoid(),
    title: "App.svelte",
    type: "file",
    content: "path/to/App.svelte",
  },
  {
    id: nanoid(),
    title: "Terminal 1",
    type: "terminal",
    content: "terminal-session-1",
  },
];

// 초기 그리드 레이아웃 (예시: 1행 2열, 왼쪽은 파일, 오른쪽은 터미널)
const initialWorkspaceLayout: WorkspaceLayout = {
  id: nanoid(),
  rows: 1, // 1행
  cols: 1, // 2열
  rowSizes: ["1fr"], // 행 높이는 전체 공간을 1fr로 차지
  colSizes: ["1fr"], // 열 너비는 1:1 비율로 분할
  cells: [
    {
      id: nanoid(),
      row: 0,
      col: 0,
      rowspan: 1,
      colspan: 1,
      type: "leaf",
      color: "#f00",
      activeTabId: initialTabs[0].id, // 첫 번째 셀에 'Welcome.md' 할당
    },
  ],
  focusedCellId: null, // 초기에는 포커스된 셀 없음
  mode: "grid",
};

// 그리드 레이아웃의 현재 상태
export const workspaceStore = $state({
  layout: initialWorkspaceLayout,
  tabs: initialTabs,
});

// tab actions
function addTab(tab: Tab) {
  return workspaceStore.tabs.push(tab);
}
function removeTab(tabId: string) {
  return () =>
    (workspaceStore.tabs = workspaceStore.tabs.filter(
      (tab) => tab.id !== tabId,
    ));
}
function getTabById(tabId: string): Tab | undefined {
  return workspaceStore.tabs.find((tab) => tab.id === tabId);
}
// cell actions
function assignTabToCell(tabId: string | null, cellId: string) {
  const cell = workspaceStore.layout.cells.find((c) => c.id === cellId);
  if (cell) {
    cell.activeTabId = tabId;
    cell.type = "leaf";
  }
}
function createNewTab() {
  const newTabId = nanoid();
  addTab({
    id: newTabId,
    title: `New Tab ${workspaceStore.tabs.length + 1}`,
    type: "file",
    content: `Content for new tab ${workspaceStore.tabs.length + 1}`,
  });
  // 새로 생성된 탭을 현재 포커스된 셀에 자동으로 할당합니다.
  if (workspaceStore.layout.focusedCellId) {
    assignTabToCell(newTabId, workspaceStore.layout.focusedCellId);
  } else if (workspaceStore.layout.cells.length > 0) {
    // 포커스된 셀이 없으면 첫 번째 셀에 할당
    assignTabToCell(newTabId, workspaceStore.layout.cells[0].id);
    focusCell(workspaceStore.layout.cells[0].id); // 첫 번째 셀에 포커스
  }
}

function handleTabClick(tabId: string) {
  if (workspaceStore.layout.focusedCellId) {
    assignTabToCell(tabId, workspaceStore.layout.focusedCellId);
  } else if (workspaceStore.layout.cells.length > 0) {
    assignTabToCell(tabId, workspaceStore.layout.cells[0].id);
    focusCell(workspaceStore.layout.cells[0].id);
  }
}

/**
 * 특정 행의 크기를 조절합니다.
 * @param rowIndex 크기를 조절할 행의 인덱스 (0부터 시작). 이 행과 다음 행의 비율이 변경됩니다.
 * @param newFrValue 해당 rowIndex의 행이 가질 새로운 fr 값.
 */
function resizeCellHeight(rowIndex: number, newFrValue: number) {
  const currentFrValues = workspaceStore.layout.rowSizes.map((s) =>
    parseFloat(s.toString()),
  );

  // 유효성 검사: 인덱스가 배열 범위 내에 있고, 다음 행이 존재하는지 확인
  if (rowIndex < 0 || rowIndex >= currentFrValues.length - 1) {
    console.warn(
      `[resizeCellHeight] Invalid row index: ${rowIndex}. Must be within 0 to ${currentFrValues.length - 2}.`,
    );
    return;
  }

  const oldFr1 = currentFrValues[rowIndex];
  const oldFr2 = currentFrValues[rowIndex + 1];
  const sumOfAffectedFr = oldFr1 + oldFr2; // 영향을 받는 두 행의 fr 합계 (고정)

  // 유효성 검사: 새로운 fr 값이 0보다 크고, 두 행의 합계보다 작은지 확인
  if (newFrValue <= 0 || newFrValue >= sumOfAffectedFr) {
    console.warn(
      `[resizeCellHeight] New FR value (${newFrValue}) out of bounds for sum ${sumOfAffectedFr}.`,
    );
    return;
  }

  const newFr1 = newFrValue;
  const newFr2 = sumOfAffectedFr - newFr1; // 다음 행의 fr 값은 합계에서 현재 행 값을 뺀 값

  workspaceStore.layout.rowSizes[rowIndex] = `${newFr1}fr`;
  workspaceStore.layout.rowSizes[rowIndex + 1] = `${newFr2}fr`;

  // $state는 배열 요소 변경을 감지하지만, 배열 자체를 교체하면 더 확실하게 Svelte의 반응성을 트리거할 수 있습니다.
  workspaceStore.layout.rowSizes = [...workspaceStore.layout.rowSizes];
  console.log(
    `[resizeCellHeight] Row ${rowIndex} resized to ${newFr1}fr, Row ${rowIndex + 1} to ${newFr2}fr.`,
  );
}

/**
 * 특정 열의 크기를 조절합니다.
 * @param colIndex 크기를 조절할 열의 인덱스 (0부터 시작). 이 열과 다음 열의 비율이 변경됩니다.
 * @param newFrValue 해당 colIndex의 열이 가질 새로운 fr 값.
 */
function resizeCellWidth(colIndex: number, newFrValue: number) {
  const currentFrValues = workspaceStore.layout.colSizes.map((s) =>
    parseFloat(s.toString()),
  );

  // 유효성 검사
  if (colIndex < 0 || colIndex >= currentFrValues.length - 1) {
    console.warn(
      `[resizeCellWidth] Invalid col index: ${colIndex}. Must be within 0 to ${currentFrValues.length - 2}.`,
    );
    return;
  }

  const oldFr1 = currentFrValues[colIndex];
  const oldFr2 = currentFrValues[colIndex + 1];
  const sumOfAffectedFr = oldFr1 + oldFr2;

  // 유효성 검사
  if (newFrValue <= 0 || newFrValue >= sumOfAffectedFr) {
    console.warn(
      `[resizeCellWidth] New FR value (${newFrValue}) out of bounds for sum ${sumOfAffectedFr}.`,
    );
    return;
  }

  const newFr1 = newFrValue;
  const newFr2 = sumOfAffectedFr - newFr1;

  workspaceStore.layout.colSizes[colIndex] = `${newFr1}fr`;
  workspaceStore.layout.colSizes[colIndex + 1] = `${newFr2}fr`;

  // Svelte 반응성 트리거
  workspaceStore.layout.colSizes = [...workspaceStore.layout.colSizes];
}
function resizeGridCol(colIndex: number, deltaFr: number) {
  const currentFrValues = workspaceStore.layout.colSizes.map((s) =>
    parseFloat(s.toString()),
  );
  const totalFr = currentFrValues.reduce((sum, val) => sum + val, 0);

  if (colIndex < 0 || colIndex >= currentFrValues.length) {
    console.warn(`[resizeGridCol] Invalid col index: ${colIndex}.`);
    return;
  }

  let newFrForTarget = currentFrValues[colIndex] + deltaFr;

  // 최소/최대 너비 제한 (예: 최소 0.1fr)
  if (newFrForTarget < 0.1) newFrForTarget = 0.1;

  // 변화량 (실제로 적용된 변화량)
  const actualDelta = newFrForTarget - currentFrValues[colIndex];

  // 나머지 fr 값들을 조정하여 전체 합계를 유지
  const remainingFrCount = currentFrValues.length - 1;
  const oldRemainingFrSum = totalFr - currentFrValues[colIndex];
  const newRemainingFrSum = totalFr - newFrForTarget;

  if (remainingFrCount > 0) {
    // 나머지 패널들의 fr 값을 비례적으로 조정
    for (let i = 0; i < currentFrValues.length; i++) {
      if (i === colIndex) {
        workspaceStore.layout.colSizes[i] = `${newFrForTarget}fr`;
      } else {
        // 기존 나머지 값에 대한 비율을 새로운 나머지 합계에 적용
        const ratio = currentFrValues[i] / oldRemainingFrSum;
        let adjustedFr = ratio * newRemainingFrSum;
        if (adjustedFr < 0.1) adjustedFr = 0.1; // 최소값 제한
        workspaceStore.layout.colSizes[i] = `${adjustedFr}fr`;
      }
    }
  } else {
    // 열이 하나뿐인 경우
    workspaceStore.layout.colSizes[colIndex] = `${newFrForTarget}fr`;
  }

  workspaceStore.layout.colSizes = [...workspaceStore.layout.colSizes];
}

function focusCell(cellId: string | null) {
  return (workspaceStore.layout.focusedCellId = cellId);
}
function toggleLayoutMode() {
  const { mode } = workspaceStore.layout;
  workspaceStore.layout.mode = mode === "grid" ? "bookmark" : "grid";
}
/**
 * 특정 패널을 기준으로 새로운 빈 패널을 특정 방향에 추가합니다.
 * 기존 패널의 크기를 조정하지 않고, 새로운 행/열을 삽입하여 새 패널을 만듭니다.
 * @param targetCellId 기준이 될 셀의 ID. 이 셀의 위치를 기반으로 새 패널이 추가됩니다.
 * @param direction 'left', 'right', 'above', 'below' - 새 패널을 추가할 방향.
 * @param newTabId 새로 생성될 패널에 할당할 탭 ID (선택 사항).
 */
function addPanel(
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
function removePanel(cellId: string, direction: "vertical" | "horizontal") {
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

function moveFocus(direction: "up" | "down" | "left" | "right") {
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

const CellActions = {
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
const CellUtil = {
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

export const WorkspaceApi = {
  store: workspaceStore,
  addTab,
  createNewTab,
  removeTab,
  getTabById,
  handleTabClick,
  assignTabToCell,
  focusCell,
  toggleLayoutMode,
  CellActions,
  CellUtil,
};
