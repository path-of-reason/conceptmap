import { hotkeys } from "./useKeyboard.svelte";

// console.log("auto log: hotkey registers from 'src/lib/hooks/initHotkeys.ts'");
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
]);
