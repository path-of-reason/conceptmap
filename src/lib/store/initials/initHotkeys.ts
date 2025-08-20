import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";

const initGlobalHotkeys = () => {
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "="],
      commandKey: CMDKEYS.LAYOUT.ZOOM.IN,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["meta", "-"],
      commandKey: CMDKEYS.LAYOUT.ZOOM.OUT,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["space", "z"],
      commandKey: CMDKEYS.LAYOUT.TOGGLE.ZEN,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "m"],
      commandKey: CMDKEYS.LAYOUT.TOGGLE.MODAL,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "tab"],
      commandKey: CMDKEYS.WORKSPACE.TOGGLE.LAYOUTMODE,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["meta", "shift", "-"],
      commandKey: CMDKEYS.WORKSPACE.CELL.DECREASE.WIDTH,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["meta", "shift", "="],
      commandKey: CMDKEYS.WORKSPACE.CELL.INCREASE.WIDTH,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["space", "s", "v"],
      commandKey: CMDKEYS.WORKSPACE.CELL.SPLIT.VERTICAL,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "d", "v"],
      commandKey: CMDKEYS.WORKSPACE.CELL.REMOVE.VERTICAL,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "s", "h"],
      commandKey: CMDKEYS.WORKSPACE.CELL.SPLIT.HORIZONTAL,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "d", "h"],
      commandKey: CMDKEYS.WORKSPACE.CELL.REMOVE.HORIZONTAL,
      options: { mode: "leader", context: "global" },
    },
  ]);
};

const initLeftSidebarHotkeys = () => {
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "shift", "["],
      commandKey: CMDKEYS.LEFTSIDEBAR.PREV,
      options: { mode: "normal", context: "leftSidebar" },
    },
    {
      hotkeySequence: ["meta", "shift", "]"],
      commandKey: CMDKEYS.LEFTSIDEBAR.NEXT,
      options: { mode: "normal", context: "leftSidebar" },
    },
  ]);
};

const initRightSidebarHotkeys = () => {
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "shift", "["],
      commandKey: CMDKEYS.RIGHTSIDEBAR.PREV,
      options: { mode: "normal", context: "rightSidebar" },
    },
    {
      hotkeySequence: ["meta", "shift", "]"],
      commandKey: CMDKEYS.RIGHTSIDEBAR.NEXT,
      options: { mode: "normal", context: "rightSidebar" },
    },
  ]);
};

const initWorkspaceHotkeys = () => {
  API.hotkey.registerAll([
    {
      hotkeySequence: ["ctrl", "h"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.LEFT,
      options: { mode: "normal", context: "workspace" },
    },
    {
      hotkeySequence: ["ctrl", "j"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.DOWN,
      options: { mode: "normal", context: "workspace" },
    },
    {
      hotkeySequence: ["ctrl", "k"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.UP,
      options: { mode: "normal", context: "workspace" },
    },
    {
      hotkeySequence: ["ctrl", "l"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.RIGHT,
      options: { mode: "normal", context: "workspace" },
    },
  ]);
};

export const initHotkey = () => {
  initGlobalHotkeys();
  initLeftSidebarHotkeys();
  initRightSidebarHotkeys();
  initWorkspaceHotkeys();

  // for test
  API.hotkey.register(
    ["arrowleft"],
    () => console.log("Hello from right sidebar context!"),
    "test: right sidebar context",
    { mode: "normal", context: "rightSidebar" },
  );
};
