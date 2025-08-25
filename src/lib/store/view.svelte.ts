import type { LayoutView, ViewState } from "@/lib/types/layout";
import { LAYOUT } from "$lib/constant/layout";

// 등록된 모든 뷰를 관리하는 Map
const viewMap = new Map<string, LayoutView>();
/**
 * 플러그인이 새로운 뷰를 시스템에 등록합니다.
 * @param view - 등록할 LayoutView 객체
 */
export const viewState = $state<ViewState>({
  leftSidebarViewId: null,
  rightSidebarViewId: null,
});

/**
 * 왼쪽 사이드바에 표시할 뷰를 설정합니다.
 * @param viewId - 활성화할 뷰의 ID 또는 null (비활성화)
 */
function setActiveLeftSidebarView(viewId: string | null): void {
  if (viewId !== null && !viewMap.has(viewId)) {
    console.warn(
      `Attempted to activate unregistered view: "${viewId}". Setting to null.`,
    );
    viewState.leftSidebarViewId = null;
    return;
  }
  viewState.leftSidebarViewId = viewId;
}
function setActiveRightSidebarView(viewId: string | null): void {
  if (viewId !== null && !viewMap.has(viewId)) {
    console.warn(
      `Attempted to activate unregistered view: "${viewId}". Setting to null.`,
    );
    viewState.rightSidebarViewId = null;
    return;
  }
  viewState.rightSidebarViewId = viewId;
}

function registerView(view: LayoutView): void {
  if (viewMap.has(view.id)) {
    console.warn(`View with ID "${view.id}" is already registered.`);
    return;
  }
  viewMap.set(view.id, view);
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

function nextLeftView() {
  const views = getRegisteredViews().filter((v) => v.type === LAYOUT.LEFT_SIDEBAR);
  const currentIndex =
    views.findIndex((view) => view.id === viewState.leftSidebarViewId) ?? 0;
  const nextIndex = (currentIndex + 1) % views.length;
  setActiveLeftSidebarView(views[nextIndex].id);
}
function prevLeftView() {
  const views = getRegisteredViews().filter((v) => v.type === LAYOUT.LEFT_SIDEBAR);
  const currentIndex =
    views.findIndex((view) => view.id === viewState.leftSidebarViewId) ?? 0;
  const prevIndex = (currentIndex - 1 + views.length) % views.length;
  setActiveLeftSidebarView(views[prevIndex].id);
}

function nextRightView() {
  console.log("next right");
  const views = getRegisteredViews().filter((v) => v.type === LAYOUT.RIGHT_SIDEBAR);
  const currentIndex =
    views.findIndex((view) => view.id === viewState.rightSidebarViewId) ?? 0;
  const nextIndex = (currentIndex + 1) % views.length;
  setActiveRightSidebarView(views[nextIndex].id);
}
function prevRightView() {
  console.log("prev right");
  const views = getRegisteredViews().filter((v) => v.type === LAYOUT.RIGHT_SIDEBAR);
  const currentIndex =
    views.findIndex((view) => view.id === viewState.rightSidebarViewId) ?? 0;
  const prevIndex = (currentIndex - 1 + views.length) % views.length;
  setActiveRightSidebarView(views[prevIndex].id);
}

export const ViewApi = {
  viewMap,
  viewState,
  registerView,
  registerViewList,
  getRegisteredViews,
  setActiveLeftSidebarView,
  setActiveRightSidebarView,
  getView,
  hasView,
  prevLeftView,
  nextLeftView,
  prevRightView,
  nextRightView,
};