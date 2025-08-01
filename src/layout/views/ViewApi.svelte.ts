import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
import { mount } from "svelte";
import { useSectionStore } from "../resizable-pane/sectionStore.svelte";
import type { LayoutState, LayoutView } from "../types";

// 등록된 모든 뷰를 관리하는 Map
const viewMap = new Map<string, LayoutView>();
/**
 * 플러그인이 새로운 뷰를 시스템에 등록합니다.
 * @param view - 등록할 LayoutView 객체
 */
export const layoutState = $state<LayoutState>({
  isResize: false,
  leftSidebarViewId: null,
  // rightSidebarViewId // 각 레이아웃에 어떤 뷰가 열려있는지
  mainPosition: {
    // 이건 왜만들었더라, 아 메인화면 추적해서 웹브라우져처럼 사용해볼려고 만들었다 실패한 흔적이네
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
});

function setMainPosition(x: number, y: number, width: number, height: number) {
  layoutState.mainPosition = { x, y, width, height };
}
/**
 * 왼쪽 사이드바에 표시할 뷰를 설정합니다.
 * @param viewId - 활성화할 뷰의 ID 또는 null (비활성화)
 */
function setActiveLeftSidebarView(viewId: string | null): void {
  if (viewId !== null && !viewMap.has(viewId)) {
    console.warn(
      `Attempted to activate unregistered view: "${viewId}". Setting to null.`,
    );
    layoutState.leftSidebarViewId = null;
    return;
  }
  layoutState.leftSidebarViewId = viewId;
  // console.log(`Left sidebar view set to: ${viewId || "none"}`);
}

function registerView(view: LayoutView): void {
  if (viewMap.has(view.id)) {
    console.warn(
      `View with ID "${view.id}" is already registered. Overwriting.`,
    );
  }
  // const div = document.createElement("div");
  // mount(component, options);
  viewMap.set(view.id, view);
  // console.log(`View "${view.name}" (${view.id}) registered.`);
}
function registerViewList(viewList: LayoutView[]): void {
  viewList.forEach((view) => registerView(view));
}

/**
 * 등록된 모든 뷰 목록을 가져옵니다.
 * @returns LayoutView[]
 */
function getRegisteredViews(): LayoutView[] {
  return Array.from(viewMap.values());
}

/**
 * ID로 특정 뷰를 가져옵니다.
 * @param viewId - 뷰의 고유 ID
 * @returns LayoutView | undefined
 */
function getView(viewId: string): LayoutView | undefined {
  return viewMap.get(viewId);
}
function hasView(viewId: string): boolean {
  return viewMap.has(viewId);
}

function nextView() {
  const views = getRegisteredViews();
  const currentIndex =
    views.findIndex((view) => view.id === layoutState.leftSidebarViewId) ?? 0;
  const nextIndex = (currentIndex + 1) % views.length;
  setActiveLeftSidebarView(views[nextIndex].id);
}
function prevView() {
  const views = getRegisteredViews();
  const currentIndex =
    views.findIndex((view) => view.id === layoutState.leftSidebarViewId) ?? 0;
  const prevIndex = (currentIndex - 1 + views.length) % views.length;
  setActiveLeftSidebarView(views[prevIndex].id);
}

hotkeys.registers([
  {
    hotkeySequence: ["space", "l", "i"],
    callback: () => {
      getRegisteredViews().forEach((view) => {
        console.log(view.id);
      });
    },
    description: "left sidebar info",
    options: { mode: "leader" },
  },
  {
    hotkeySequence: ["space", "l", "b"],
    callback: prevView,
    description: "left sidebar previous view",
    options: { mode: "leader" },
  },
  {
    hotkeySequence: ["space", "l", "n"],
    callback: nextView,
    description: "left sidebar next view",
    options: { mode: "leader" },
  },
]);

export const ViewApi = {
  mount,
  hotkeys,
  useSectionStore,
  viewMap,
  registerView,
  registerViewList,
  getRegisteredViews,
  setActiveLeftSidebarView,
  setMainPosition,
  getView,
  hasView,
};
