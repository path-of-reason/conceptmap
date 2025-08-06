export type HotkeyMode = "normal" | "leader";
export type HotkeyOptions = {
  mode: HotkeyMode;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInInputs?: boolean;
};
export type HotkeyCallback = (event: KeyboardEvent) => void;
export type KeyState = {
  pressedKeys: string;
  currentMode: HotkeyMode;
  pendingKeys: string[];
  registeredHotkeys: RegisteredHotkey[];
};
export type RegisteredHotkey = {
  id: string; // sequence.join("_");
  sequence: string[]; // ["space", "e"]
  callback: HotkeyCallback;
  description: string;
  options: HotkeyOptions;
};
// for regist hotkey
export type HotkeyWithCommand = {
  hotkeySequence: string | string[];
  commandKey: string;
  options: HotkeyOptions;
};

export type HotkeyWithCallback = {
  hotkeySequence: string | string[];
  description: string;
  callback: () => void;
  options: HotkeyOptions;
};

export type HotkeyDef = HotkeyWithCommand | HotkeyWithCallback;
