import { layoutState } from "../views/ViewApi.svelte";
import { SectionConfig } from "./sectionConfig";
import {
  type SectionState,
  type BaseSectionState,
  type Direction,
  type HorizontalSectionState,
  type VerticalSectionState,
  type LayoutType,
} from "../types.d";

// ------------ state
const mouseState = {
  startX: 0,
  startY: 0,
};
const sectionStateMap = new Map<LayoutType, SectionState>();
const getSectionState = <D extends Direction>(
  id: LayoutType,
): D extends "vertical" ? VerticalSectionState : HorizontalSectionState => {
  if (sectionStateMap.has(id))
    return sectionStateMap.get(id) as D extends "vertical"
      ? VerticalSectionState
      : HorizontalSectionState;
  else return initSectionState(id);
};
const setSectionState = (id: LayoutType, state: SectionState) =>
  sectionStateMap.set(id, state);
const initSectionState = <D extends Direction>(
  id: LayoutType,
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

// # util functions ---------------------------------
/**
 * # use svelte script
 * - let visibleLayoutList = $derived.by(()=>sectionVisible().list)
 * - let visibleLayoutMap = $derived.by(()=>sectionVisible().map)
 */
export function sectionVisible() {
  const map: Record<string, boolean> = {};
  const list: {
    id: LayoutType;
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
export function collapseSection(id: LayoutType, bool: boolean) {
  const sectionState = getSectionState(id);
  const config = SectionConfig.get(id);
  sectionState.collapsed = bool;
  if (isVertical(sectionState))
    sectionState.w = bool ? config.min : config.default;
  else sectionState.h = bool ? config.min : config.default;
}
export function isVertical(state: SectionState): state is VerticalSectionState {
  return state.direction === "vertical";
}
export function layoutIds() {
  return Array.from(sectionStateMap.keys());
}
export function focusById(id: LayoutType) {
  return sectionStateMap.forEach(
    (sectionState, key) => (sectionState.isFocused = key === id ? true : false),
  );
}
export function toggleZenMode() {
  let zenMode = true;
  for (const [id, sectionState] of sectionStateMap)
    if (sectionState.collapsed === false) {
      zenMode = false;
      break;
    }

  if (zenMode)
    sectionStateMap.forEach((sectionState, id) => {
      const config = SectionConfig.get(id);
      sectionState.collapsed = false;
      if (isVertical(sectionState)) sectionState.w = config.default;
      else sectionState.h = config.default;
    });
  else
    sectionStateMap.forEach((sectionState, id) => {
      const config = SectionConfig.get(id);
      sectionState.collapsed = true;
      if (isVertical(sectionState)) sectionState.w = config.min;
      else sectionState.h = config.min;
    });
}

export function useSectionStore<D extends Direction>({
  id,
  prevResizer = false,
}: {
  id: LayoutType;
  prevResizer?: boolean;
}) {
  const sectionState = getSectionState<D>(id);
  const config = SectionConfig.get(id);

  const toggleCollapsed = () => collapseSection(id, !sectionState.collapsed);

  const onResize = (e: MouseEvent) => {
    sectionState.isResize = true;
    layoutState.isResize = true;
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
    layoutState.isResize = false;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onResizeMove);
    document.removeEventListener("mouseup", onResizeEnd);
  };
  const setFocus = () => focusById(id);

  return {
    direction: config.direction,
    sectionState,
    layoutState,
    toggleCollapsed,
    onResize,
    setFocus,
  };
}
