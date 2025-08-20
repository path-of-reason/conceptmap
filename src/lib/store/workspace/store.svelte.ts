import { nanoid } from "nanoid";
import type { Tab, WorkspaceLayout } from "$lib/types/workspace";

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

export const workspaceStore = $state({
  layout: initialWorkspaceLayout,
  tabs: initialTabs,
});
