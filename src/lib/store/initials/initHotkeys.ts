import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";

export const initHotkey = () => {
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
  ]);
  API.hotkey.registerAll([
    {
      hotkeySequence: ["space", "h", "b"],
      commandKey: CMDKEYS.LEFTSIDEBAR.PREV,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "h", "n"],
      commandKey: CMDKEYS.LEFTSIDEBAR.NEXT,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "l", "b"],
      commandKey: CMDKEYS.RIGHTSIDEBAR.PREV,
      options: { mode: "leader", context: "global" },
    },
    {
      hotkeySequence: ["space", "l", "n"],
      commandKey: CMDKEYS.RIGHTSIDEBAR.NEXT,
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
    {
      hotkeySequence: ["ctrl", "h"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.LEFT,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["ctrl", "j"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.DOWN,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["ctrl", "k"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.UP,
      options: { mode: "normal", context: "global" },
    },
    {
      hotkeySequence: ["ctrl", "l"],
      commandKey: CMDKEYS.WORKSPACE.CELL.FOCUS.RIGHT,
      options: { mode: "normal", context: "global" },
    },
  ]);

  // for test
  API.hotkey.register(
    ["arrowleft"],
    () => alert("Hello from left sidebar context!"),
    "test: left sidebar context",
    { mode: "normal", context: "leftSidebar" },
  );
};

// {
//   hotkeySequence: ["space", "n"],
//   callback: () => {
//     const ids = API.section.layoutIds();
//     API.section.focusById(ids[focusIndex]);
//     focusIndex++;
//     if (focusIndex >= ids.length) {
//       focusIndex = 0;
//     }
//   },
//   description: "next layout focus",
//   options: { mode: "leader" },
// },
// let focusIndex = 0;
