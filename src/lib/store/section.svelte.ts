import {
  type SectionState,
  type BaseSectionState,
  type Direction,
  type HorizontalSectionState,
  type VerticalSectionState,
  type SectionType,
} from "@/lib/types/layout";
import { LayoutApi } from "@/lib/store/layout.svelte";
import { SectionConfig } from "./sectionConfig";
import { ContextApi } from "./context.svelte";

/** for mouse resizing */
const mouseState = {
  startX: 0,
  startY: 0,
};
const sectionStateMap = new Map<SectionType, SectionState>();
const getSectionState = <D extends Direction>(
  id: SectionType,
): D extends "vertical" ? VerticalSectionState : HorizontalSectionState => {
  if (sectionStateMap.has(id))
    return sectionStateMap.get(id) as D extends "vertical"
      ? VerticalSectionState
      : HorizontalSectionState;
  else return initSectionState(id);
};
const setSectionState = (id: SectionType, state: SectionState) =>
  sectionStateMap.set(id, state);

const initSectionState = <D extends Direction>(
  id: SectionType,
): D extends "vertical" ? VerticalSectionState : HorizontalSectionState => {
  const config = SectionConfig.map.get(id)!;
  const baseState: BaseSectionState = {
    collapsed: config.collapsed || false,
    direction: config.direction,
    isResize: false,
    isFocused: false,
  };
  const initialValue: SectionState =
    config.direction === "vertical"
      ? {
          ...baseState,
          w: config.collapsed ? config.min : config.default,
          startW: 0,
        }
      : {
          ...baseState,
          h: config.collapsed ? config.min : config.default,
          startH: 0,
        };

  const state = $state<SectionState>(initialValue) as D extends "vertical"
    ? VerticalSectionState
    : HorizontalSectionState;

  setSectionState(id, state);
  return state;
};

const zenSnapshot: Record<SectionType, boolean> = {
  rightSidebar: false,
  leftSidebar: false,
  headerBar: false,
  statusBar: false,
  searchBar: false,
};

// # util functions ---------------------------------
/**
 * # use svelte script
 * - let visibleLayoutList = $derived.by(()=>sectionVisible().list)
 * - let visibleLayoutMap = $derived.by(()=>sectionVisible().map)
 */
function sectionVisible() {
  const map: Record<string, boolean> = {};
  const list: {
    id: SectionType;
    visible: boolean;
  }[] = [];
  for (const [key, value] of sectionStateMap.entries()) {
    map[key] = !value.collapsed;
    list.push({ id: key, visible: !value.collapsed });
  }
  return {
    map,
    list,
  };
}
function collapseSection(id: SectionType, bool: boolean) {
  const sectionState = getSectionState(id);
  const config = SectionConfig.get(id);
  sectionState.collapsed = bool;
  if (isVertical(sectionState))
    sectionState.w = bool ? config.min : config.default;
  else sectionState.h = bool ? config.min : config.default;
}
function isVertical(state: SectionState): state is VerticalSectionState {
  return state.direction === "vertical";
}
function sectionIds() {
  return Array.from(sectionStateMap.keys());
}
function focusById(id: SectionType) {
  return sectionStateMap.forEach(
    (sectionState, key) => (sectionState.isFocused = key === id ? true : false),
  );
}
function toggleZenMode() {
  // zen 상태 결정
  let zenMode = true;
  for (const [id, sectionState] of sectionStateMap)
    if (sectionState.collapsed === false) {
      zenMode = false;
      break;
    }

  if (!zenMode)
    sectionStateMap.forEach((sectionState, id) => {
      zenSnapshot[id] = sectionState.collapsed;
      const config = SectionConfig.get(id);
      sectionState.collapsed = true;
      if (isVertical(sectionState)) sectionState.w = config.min;
      else sectionState.h = config.min;
    });
  else
    sectionStateMap.forEach((sectionState, id) => {
      const config = SectionConfig.get(id);
      const collapsed = zenSnapshot[id];
      sectionState.collapsed = collapsed;
      if (isVertical(sectionState))
        sectionState.w = collapsed ? config.min : config.default;
      else sectionState.h = collapsed ? config.min : config.default;
    });
}

function toggleLayout(layoutType: SectionType) {
  const ss = sectionStateMap.get(layoutType);
  if (ss) {
    ss.collapsed = !ss.collapsed;
    if (ss.collapsed) {
      ContextApi.leave(layoutType);
      console.log(ContextApi.contextState.contextStack);
    } else {
      ContextApi.enter(layoutType);
      console.log(ContextApi.contextState.contextStack);
    }
  }
}
function toggleHeader() {
  toggleLayout("headerBar");
}
function toggleLeftSidebar() {
  toggleLayout("leftSidebar");
}
function toggleRightSidebar() {
  toggleLayout("rightSidebar");
}
function toggleStatusbar() {
  toggleLayout("statusBar");
}

function useSectionStore<D extends Direction>({
  id,
  prevResizer = false,
}: {
  id: SectionType;
  prevResizer?: boolean;
}) {
  const sectionState = getSectionState<D>(id);
  const config = SectionConfig.get(id);

  const toggleCollapsed = () => collapseSection(id, !sectionState.collapsed);

  const onResize = (e: MouseEvent) => {
    sectionState.isResize = true;
    LayoutApi.state.isSectionResize = true;
    mouseState.startX = e.clientX;
    mouseState.startY = e.clientY;
    if (isVertical(sectionState)) {
      sectionState.startW = sectionState.w;
      document.body.style.cursor = "ew-resize";
    } else {
      sectionState.startH = sectionState.h;
      document.body.style.cursor = "ns-resize";
    }
    document.addEventListener("mousemove", onResizeMove);
    document.addEventListener("mouseup", onResizeEnd);
  };
  const onResizeMove = (e: MouseEvent) => {
    const r = prevResizer ? -1 : 1;
    if (sectionState.isResize) {
      if (isVertical(sectionState)) {
        const dx = (mouseState.startX - e.clientX) * r;
        const width = Math.max(
          config.min,
          Math.min(config.max, sectionState.startW - dx),
        );
        if (width === config.min) sectionState.collapsed = true;
        else sectionState.collapsed = false;
        sectionState.w = width;
      } else {
        const dy = (mouseState.startY - e.clientY) * r;
        const height = Math.max(
          config.min,
          Math.min(config.max, sectionState.startH - dy),
        );
        if (height === config.min) sectionState.collapsed = true;
        else sectionState.collapsed = false;
        sectionState.h = height;
      }
    }
  };
  const onResizeEnd = (e: MouseEvent) => {
    sectionState.isResize = false;
    LayoutApi.state.isSectionResize = false;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onResizeMove);
    document.removeEventListener("mouseup", onResizeEnd);
  };
  const setFocus = () => focusById(id);

  return {
    direction: config.direction,
    sectionState,
    toggleCollapsed,
    onResize,
    setFocus,
  };
}

export const SectionApi = {
  useSectionStore,
  sectionVisible,
  collapseSection,
  isVertical,
  sectionIds,
  focusById,
  toggleZenMode,
  toggleHeader,
  toggleLeftSidebar,
  toggleRightSidebar,
  toggleStatusbar,
};
