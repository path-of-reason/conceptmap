import type { Side } from "./types";

export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_SHORTCUT = {
  LEFT: "e",
  RIGHT: "r",
};
export const SIDEBAR_COOKIE_NAME = "sidebar:state";
// TODO: 쿠키이름 두개사용하거나, 한 쿠키에서 두개의 값을 다루거나
export const SIDEBAR_BASE_CONTEXT_KEY: Side = "left";
