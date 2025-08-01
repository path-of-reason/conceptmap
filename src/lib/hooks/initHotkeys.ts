import {
  focusById,
  layoutIds,
  toggleZenMode,
} from "../../layout/resizable-pane/sectionStore.svelte";
import { hotkeys } from "./useKeyboard.svelte";

hotkeys.registers([
  {
    hotkeySequence: ["space", "a", "a"],
    callback: () => {
      console.log("test Leader a a");
    },
    description: "grouping test",
    options: { mode: "leader" },
  },
  {
    hotkeySequence: ["ctrl", "c"],
    callback: () => {
      console.log("ctrl + c");
    },
    description: "normal shortcut test",
    options: { mode: "normal" },
  },
  {
    hotkeySequence: ["meta", "shift", "a"],
    callback: () => {
      console.log("cmd + shift + a");
    },
    description: "특수키 두개 조합",
    options: { mode: "normal", preventDefault: true },
  },
  {
    hotkeySequence: ["space", "n"],
    callback: () => {
      const ids = layoutIds();
      focusById(ids[focusIndex]);
      focusIndex++;
      if (focusIndex >= ids.length) {
        focusIndex = 0;
      }
    },
    description: "next layout focus",
    options: { mode: "leader" },
  },
  {
    hotkeySequence: ["space", "z"],
    callback: toggleZenMode,
    description: "toggle zen mode",
    options: { mode: "leader" },
  },
]);

let focusIndex = 0;
