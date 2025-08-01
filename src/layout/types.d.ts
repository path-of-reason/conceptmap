import type { Component, SvelteComponent } from "svelte";

export type LayoutType =
  | "leftSidebar"
  | "rightSidebar"
  | "headerBar"
  | "searchBar"
  | "statusBar"
  | "mainContent";
export type Direction = "vertical" | "horizontal";
export type Config = {
  direction: Direction;
  default: number;
  min: number;
  max: number;
  collapsed?: boolean;
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
  isResize: boolean;
  leftSidebarViewId: string | null;
  mainPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
export type LayoutView = {
  id: string; // 뷰의 고유 식별자 (예: 'my-plugin/todo-list')
  name: string; // 사용자에게 표시될 이름 (예: '할 일 목록')
  type: LayoutType;
  component: Component<any, {}, "">;
  icon?: Component<any, {}, "">;
  // icon?: string;
};
