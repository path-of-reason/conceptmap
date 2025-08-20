import type { Component } from "svelte";

export type SectionType =
  | "leftSidebar"
  | "rightSidebar"
  | "headerBar"
  | "searchBar"
  | "statusBar";

export type ModalType =
  | "leftModal"
  | "rightModal"
  | "topModal"
  | "bottomModal"
  | "centerModal"
  | "fullModal";

export type Direction = "vertical" | "horizontal";
export type Config = {
  direction: Direction;
  default: number;
  min: number;
  max: number;
  collapsed?: boolean;
  isHotkeyContext?: boolean;
};
export type BaseSectionState = {
  collapsed: boolean;
  direction: Direction;
  isResize: boolean;
  isFocused: boolean;
};
export type VerticalSectionState = BaseSectionState & {
  w: number;
  startW: number;
};
export type HorizontalSectionState = BaseSectionState & {
  h: number;
  startH: number;
};
export type SectionState = VerticalSectionState | HorizontalSectionState;

export type LayoutState = {
  isSectionResize: boolean;
  zoomLevel: number;
};

export type ViewState = {
  leftSidebarViewId: string | null;
  rightSidebarViewId: string | null;
};

export type LayoutView = {
  id: string; // 뷰의 고유 식별자 (예: 'my-plugin/todo-list')
  name: string; // 사용자에게 표시될 이름 (예: '할 일 목록')
  type: SectionType;
  component: Component<any, {}, "">;
  icon?: Component<any, {}, "">;
};
