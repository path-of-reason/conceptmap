import type { Tab } from "$lib/types/workspace";
import { nanoid } from "nanoid";
import { workspaceStore } from "./store.svelte";
import { focusCell } from "./focus";
import { CellUtil } from "./utils"; // New import

// tab actions
export function addTab(tab: Tab) {
  return workspaceStore.tabs.push(tab);
}
export function removeTab(tabId: string) {
  return () =>
    (workspaceStore.tabs = workspaceStore.tabs.filter(
      (tab) => tab.id !== tabId,
    ));
}
export function getTabById(tabId: string): Tab | undefined {
  return workspaceStore.tabs.find((tab) => tab.id === tabId);
}

// cell actions
export function assignTabToCell(tabId: string | null, cellId: string) {
  const cell = workspaceStore.layout.cells.find((c) => c.id === cellId);
  if (cell) {
    cell.activeTabId = tabId;
    cell.type = "leaf";
  }
}
export function createNewTab() {
  const newTabId = nanoid();
  addTab({
    id: newTabId,
    title: `아주 긴 한글로 테스트 해보자. 파일 제목이 긴게 상당히 많거든 인용문을 사용하니까 뉴 탭 ${workspaceStore.tabs.length + 1}`,
    type: "file",
    content: `한글로 테스트 해보자 뉴 탭 ${workspaceStore.tabs.length + 1}`,
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

export function handleTabClick(tabId: string) {
  if (workspaceStore.layout.focusedCellId) {
    assignTabToCell(tabId, workspaceStore.layout.focusedCellId);
  } else if (workspaceStore.layout.cells.length > 0) {
    assignTabToCell(tabId, workspaceStore.layout.cells[0].id);
    focusCell(workspaceStore.layout.cells[0].id);
  }
}

export function nextTab() {
  const focusedCell = CellUtil.getFocusedCell();
  if (!focusedCell) return;

  const currentTabId = focusedCell.activeTabId;
  const tabs = workspaceStore.tabs;

  if (!currentTabId || tabs.length === 0) {
    if (tabs.length > 0) {
      assignTabToCell(tabs[0].id, focusedCell.id);
    }
    return;
  }

  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  if (currentIndex === -1) {
    if (tabs.length > 0) {
      assignTabToCell(tabs[0].id, focusedCell.id);
    }
    return;
  }

  const nextIndex = (currentIndex + 1) % tabs.length;
  assignTabToCell(tabs[nextIndex].id, focusedCell.id);
}

export function prevTab() {
  const focusedCell = CellUtil.getFocusedCell();
  if (!focusedCell) return;

  const currentTabId = focusedCell.activeTabId;
  const tabs = workspaceStore.tabs;

  if (!currentTabId || tabs.length === 0) {
    if (tabs.length > 0) {
      assignTabToCell(tabs[tabs.length - 1].id, focusedCell.id);
    }
    return;
  }

  const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
  if (currentIndex === -1) {
    if (tabs.length > 0) {
      assignTabToCell(tabs[tabs.length - 1].id, focusedCell.id);
    }
    return;
  }

  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  assignTabToCell(tabs[prevIndex].id, focusedCell.id);
}