import { workspaceStore } from "./store.svelte";
import {
  addTab,
  assignTabToCell,
  createNewTab,
  getTabById,
  handleTabClick,
  removeTab,
  nextTab,
  prevTab,
} from "./tab";
import { focusCell } from "./focus";
import { toggleLayoutMode } from "./panel";
import { CellActions } from "./actions";
import { CellUtil } from "./utils";

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
  nextTab,
  prevTab,
};

