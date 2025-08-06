export type TabType = "file" | "terminal" | "settings" | "custom";
export type Tab = {
  id: string;
  title: string;
  type: TabType;
  content: string;
};

export type GridCell = {
  id: string;
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  type: "leaf" | "empty";
  color: string;
  activeTabId?: string | null;
};

export type WorkspaceLayout = {
  id: string;
  rows: number;
  cols: number;
  rowSizes: (string | number)[];
  colSizes: (string | number)[];
  cells: GridCell[];
  focusedCellId?: string | null;
  mode: "grid" | "bookmark";
};
