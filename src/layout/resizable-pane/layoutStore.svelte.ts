type Direction = "vertical" | "horizontal";
type Option = typeof defaultOption;
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
const defaultOption = {
  direction: "vertical" as Direction,
  default: 400,
  min: 0,
  max: 700,
};
export const layoutConfig = new Map<string, Option>();
export const setLayoutConfig = (configs: { id: string; option?: Option }[]) =>
  configs.forEach((o) => layoutConfig.set(o.id, o.option || defaultOption));
const getLayoutConfig = (id: string) => {
  if (!layoutConfig.has(id)) setLayoutConfig([{ id }]);
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
  const option = layoutConfig.get(id)!;
  if (layoutStateMap.has(id))
    return layoutStateMap.get(id) as D extends "vertical"
      ? VerticalSectionState
      : HorizontalSectionState;

  const baseState: BaseSectionState = {
    collapsed: false,
    direction: option.direction,
    isResize: false,
    isFocused: false,
  };
  const initialValue: SectionState =
    option.direction === "vertical"
      ? { ...baseState, w: option.default, startW: 0 }
      : { ...baseState, h: option.default, startH: 0 };

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
  const option = getLayoutConfig(id);

  const toggleCollapsed = () => {
    sectionState.collapsed = !sectionState.collapsed;
    if (isVerticalSectionState(sectionState))
      sectionState.w =
        sectionState.w > option.min ? option.min : option.default;
    else
      sectionState.h =
        sectionState.h > option.min ? option.min : option.default;
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
          option.min,
          Math.min(option.max, sectionState.startW - dx),
        );
        if (width === option.min) sectionState.collapsed = true;
        else sectionState.collapsed = false;
        sectionState.w = width;
      } else {
        const dy = (mouseState.startY - e.clientY) * r;
        const height = Math.max(
          option.min,
          Math.min(option.max, sectionState.startH - dy),
        );
        if (height === option.min) sectionState.collapsed = true;
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
    direction: option.direction,
    sectionState,
    toggleCollapsed,
    onResize,
    isVerticalSectionState,
    setFocus,
    setLayoutConfig,
  };
};

export const layoutMapVisible = () => {
  const visible: Record<string, boolean> = {};
  for (const [key, value] of layoutStateMap.entries())
    visible[key] = !value.collapsed;
  return visible;
};
export const layoutIds = () => Array.from(layoutStateMap.keys());
export const focusById = (id: string) =>
  layoutStateMap
    .keys()
    .forEach(
      (key) => (layoutStateMap.get(key)!.isFocused = key === id ? true : false),
    );
