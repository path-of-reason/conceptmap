type Direction = "vertical" | "horizontal";
type Config = typeof defaultConfig;
type BaseSectionState = {
  collapsed: boolean;
  direction: Direction;
  isResize: boolean;
  isFocused: boolean;
};
type VerticalSectionState = BaseSectionState & {
  w: number;
  startW: number;
};
type HorizontalSectionState = BaseSectionState & {
  h: number;
  startH: number;
};
type SectionState = VerticalSectionState | HorizontalSectionState;
// ------------ config
const defaultConfig = {
  direction: "vertical" as Direction,
  default: 400,
  min: 0,
  max: 700,
};
export const layoutConfig = new Map<string, Config>();
export const setSectionConfig = (configs: { id: string; config?: Config }[]) =>
  configs.forEach(({ id, config }) =>
    layoutConfig.set(id, config || defaultConfig),
  );
const getSectionConfig = (id: string) => {
  if (!layoutConfig.has(id)) setSectionConfig([{ id }]);
  return layoutConfig.get(id)!;
};

// ------------ state
const mouseState = {
  startX: 0,
  startY: 0,
};
const layoutStateMap = new Map<string, SectionState>();
const isVerticalSectionState = (
  state: SectionState,
): state is VerticalSectionState => {
  return state.direction === "vertical";
};

const getSectionStore = <D extends Direction>(
  id: string,
): D extends "vertical" ? VerticalSectionState : HorizontalSectionState => {
  const config = layoutConfig.get(id)!;
  if (layoutStateMap.has(id))
    return layoutStateMap.get(id) as D extends "vertical"
      ? VerticalSectionState
      : HorizontalSectionState;

  const baseState: BaseSectionState = {
    collapsed: false,
    direction: config.direction,
    isResize: false,
    isFocused: false,
  };
  const initialValue: SectionState =
    config.direction === "vertical"
      ? { ...baseState, w: config.default, startW: 0 }
      : { ...baseState, h: config.default, startH: 0 };

  const state = $state<SectionState>(initialValue) as D extends "vertical"
    ? VerticalSectionState
    : HorizontalSectionState;

  layoutStateMap.set(id, state);
  return state;
};

export const useLayoutStore = <D extends Direction>({
  id,
  prevResizer = false,
}: {
  id: string;
  prevResizer?: boolean;
}) => {
  const sectionState = getSectionStore<D>(id);
  const config = getSectionConfig(id);

  const toggleCollapsed = () => {
    sectionState.collapsed = !sectionState.collapsed;
    if (isVerticalSectionState(sectionState))
      sectionState.w =
        sectionState.w > config.min ? config.min : config.default;
    else
      sectionState.h =
        sectionState.h > config.min ? config.min : config.default;
  };
  const onResize = (e: MouseEvent) => {
    sectionState.isResize = true;
    mouseState.startX = e.clientX;
    mouseState.startY = e.clientY;
    if (isVerticalSectionState(sectionState)) {
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
      if (isVerticalSectionState(sectionState)) {
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
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", onResizeMove);
    document.removeEventListener("mouseup", onResizeEnd);
  };
  const setFocus = () => focusById(id);

  return {
    mouseState,
    direction: config.direction,
    sectionState,
    toggleCollapsed,
    onResize,
    isVerticalSectionState,
    setFocus,
    setSectionConfig,
  };
};

export const layoutMapVisible = () => {
  const map: Record<string, boolean> = {};
  const list: {
    id: string;
    visible: boolean;
  }[] = [];
  for (const [key, value] of layoutStateMap.entries()) {
    map[key] = !value.collapsed;
    list.push({ id: key, visible: !value.collapsed });
  }
  return {
    map,
    list,
  };
};
export const layoutIds = () => Array.from(layoutStateMap.keys());
export const focusById = (id: string) =>
  layoutStateMap.forEach(
    (sectionState, key) => (sectionState.isFocused = key === id ? true : false),
  );
