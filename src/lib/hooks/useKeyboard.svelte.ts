// --- 타입 정의 ---
type HotkeyMode = "normal" | "leader";
type HotkeyOptions = {
  mode: HotkeyMode;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInInputs?: boolean;
};
type HotkeyCallback = (event: KeyboardEvent) => void;
type KeyState = {
  pressedKeys: string;
  currentMode: HotkeyMode;
  pendingKeys: string[];
  registeredHotkeys: RegisteredHotkey[];
};
export type RegisteredHotkey = {
  id: string;
  sequence: string[];
  callback: HotkeyCallback;
  description: string;
  options: HotkeyOptions;
};
type RegistHotkey = {
  hotkeySequence: string | string[];
  callback: HotkeyCallback;
  description: string;
  options: HotkeyOptions;
};

// --- 전역 상태 및 변수 ---
// 현재 눌린 키를 추적하는 Set (UI 표시 및 동시 입력 확인용)
const pressedKeys = new Set<string>();
// 등록된 핫키 목록
const registeredHotkeys: RegisteredHotkey[] = [];
// 전역 이벤트 리스너가 이미 등록되었는지 확인
let isListenersAttached = false;
// ✨ 현재 키 입력 모드 상태 ($state로 반응성 추가)
// Svelte의 $state를 사용하여 반응성을 확보합니다.
const keyState = $state<KeyState>({
  pendingKeys: [], // ✨ pendingKeys 추가 및 초기화
  pressedKeys: "",
  currentMode: "normal",
  registeredHotkeys: [],
});

// --- 리더 모드 관리 함수 ---

/**
 * 리더 모드를 'normal'로 되돌리고, 현재 처리 중인 키 시퀀스를 초기화합니다.
 */
function resetLeaderMode(): void {
  // ✨ 타이머 관련 로직은 모두 제거되었습니다.
  if (keyState.currentMode === "leader") {
    keyState.currentMode = "normal";
    keyState.pendingKeys = []; // pendingKeys 초기화
  }
}

// ✨ extendLeaderModeTimeout 함수는 더 이상 사용하지 않으므로 제거되었습니다.

// --- 이벤트 리스너 관리 함수 ---

/**
 * 전역 키 이벤트 리스너를 DOM에 부착합니다.
 * 리스너는 한 번만 부착되도록 보장합니다.
 */
function attachListeners(): void {
  if (isListenersAttached) return;
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  isListenersAttached = true;
}

/**
 * 모든 핫키가 해제되었을 경우 전역 키 이벤트 리스너를 DOM에서 제거합니다.
 */
function detachListeners(): void {
  if (registeredHotkeys.length === 0 && isListenersAttached) {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    isListenersAttached = false;
  }
}
// --- 핫키 매칭 유틸리티 ---
/**
 * 주어진 키 입력 상태에 따라 등록된 핫키 중에서 일치하는 핫키를 찾습니다.
 * @param event - 현재 KeyboardEvent 객체
 * @param isInput - 현재 입력 필드에 포커스되어 있는지 여부
 * @param currentMode - 현재 핫키 시스템 모드 ('normal' 또는 'leader')
 * @param pendingKeys - 리더 모드일 경우 현재까지 입력된 키 시퀀스
 * @param pressedKeysSet - 현재 물리적으로 눌린 모든 키 Set (KeyboardEvent.code)
 * @returns {matchedHotkey: RegisteredHotkey | null, hasPotentialMatch: boolean} 일치하는 핫키와 잠재적 매치 여부
 */
function findMatchingHotkey(
  event: KeyboardEvent,
  isInput: boolean,
  currentMode: HotkeyMode,
  pendingKeys: string[],
  pressedKeysSet: Set<string>,
): { matchedHotkey: RegisteredHotkey | null; hasPotentialMatch: boolean } {
  let matchedHotkey: RegisteredHotkey | null = null;
  let hasPotentialMatch = false;

  for (const hotkey of registeredHotkeys) {
    if (hotkey.options.ignoreInInputs && isInput) continue;
    if (hotkey.options.mode !== currentMode) continue;

    if (currentMode === "leader") {
      // 리더 모드 매칭 로직: pendingKeys와 hotkey.sequence 비교 (이전과 동일)
      const isPartialMatch =
        hotkey.sequence.length >= pendingKeys.length &&
        pendingKeys.every((key, index) => hotkey.sequence[index] === key);

      if (isPartialMatch && hotkey.sequence.length === pendingKeys.length) {
        matchedHotkey = hotkey;
        break;
      }

      if (isPartialMatch && hotkey.sequence.length > pendingKeys.length) {
        hasPotentialMatch = true;
      }
    } else {
      // currentMode === "normal"
      // Normal 모드 매칭 로직 개선: 수식어 키와 일반 키를 분리하여 매칭

      const requiredNonModifiers = hotkey.sequence.filter(
        (key) =>
          !(
            key.startsWith("Control") ||
            key.startsWith("Shift") ||
            key.startsWith("Alt") ||
            key.startsWith("Meta")
          ),
      );

      // 1. 필요한 비-수식어 키가 현재 눌린 키인지 확인 (예: 'S'가 눌렸는지)
      const nonModifierKeysMatch =
        requiredNonModifiers.length === 1 &&
        requiredNonModifiers[0] === event.code;
      // 수식어만으로 구성된 핫키 (예: 'Ctrl')의 경우 이 조건은 false가 되어야 함.
      // 또는 핫키가 여러 개의 비-수식어 키를 포함하는 경우 (이는 현재 시스템 설계에서 지원 안함)

      // 핫키가 순수하게 수식어로만 구성된 경우 (예: 'Ctrl')
      const isPureModifierHotkey = requiredNonModifiers.length === 0;

      // 현재 이벤트의 `code`가 핫키 시퀀스에 있는 수식어 키 중 하나인지 확인
      const isEventCodeModifier =
        event.code.startsWith("Control") ||
        event.code.startsWith("Shift") ||
        event.code.startsWith("Alt") ||
        event.code.startsWith("Meta");

      // 핫키가 순수 수식어이고, 현재 이벤트의 키가 수식어일 경우
      if (isPureModifierHotkey && !isEventCodeModifier) {
        // 순수 수식어 핫키인데, 일반 키가 눌렸다면 매칭되지 않음
        continue;
      }
      if (!isPureModifierHotkey && !nonModifierKeysMatch) {
        // 일반 키를 포함하는 핫키인데, 현재 눌린 키가 그 일반 키가 아니라면 매칭되지 않음
        continue;
      }
      // TODO: 만약 `Ctrl+Shift+S`처럼 여러 일반 키와 수식어 키가 섞인 복합 핫키가 있다면, 이 `nonModifierKeysMatch` 로직은 더 복잡해져야 합니다.
      // 현재는 하나의 일반 키와 여러 수식어 키 조합을 가정합니다.

      // 2. 수식어 키 상태 확인 (KeyboardEvent 속성 사용)
      const modifiersMatch =
        (hotkey.sequence.includes("ControlLeft")
          ? event.ctrlKey
          : !event.ctrlKey) &&
        (hotkey.sequence.includes("ShiftLeft")
          ? event.shiftKey
          : !event.shiftKey) &&
        (hotkey.sequence.includes("AltLeft") ? event.altKey : !event.altKey) &&
        (hotkey.sequence.includes("MetaLeft") ? event.metaKey : !event.metaKey);

      if (!modifiersMatch) continue;

      // 3. 다른 불필요한 키가 눌렸는지 확인 (옵션, 더 엄격한 매칭)
      // `pressedKeysSet`에 `hotkey.sequence`에 없는 비-수식어 키가 있다면 매칭되지 않음
      const anyUnexpectedNonModifierKeys = Array.from(pressedKeysSet).some(
        (pressedKey) =>
          !hotkey.sequence.includes(pressedKey) &&
          !mapAliasToKeyCode(pressedKey).startsWith("Control") && // mapAliasToKeyCode의 결과를 사용하여 수식어 키를 더 정확히 판단
          !mapAliasToKeyCode(pressedKey).startsWith("Shift") &&
          !mapAliasToKeyCode(pressedKey).startsWith("Alt") &&
          !mapAliasToKeyCode(pressedKey).startsWith("Meta"),
      );
      if (anyUnexpectedNonModifierKeys) continue;

      matchedHotkey = hotkey;
      break;
    }
  }

  return { matchedHotkey, hasPotentialMatch };
}
// --- 이벤트 핸들러 ---

/**
 * 'normal' 모드에서 키다운 이벤트를 처리합니다.
 */
function handleNormalModeKeyDown(event: KeyboardEvent, isInput: boolean): void {
  // ✨ Space 키가 'normal' 모드에서 눌렸을 때 (리더 모드 진입)
  if (event.code === "Space" && !isInput) {
    event.preventDefault();
    event.stopPropagation();
    keyState.currentMode = "leader"; // 모드를 'leader'로 변경
    keyState.pendingKeys = ["Space"]; // pendingKeys를 'Space'로 초기화
    return; // Space 키는 자체적으로 핫키 액션을 실행하지 않고 모드 전환만 합니다.
  }
  const { matchedHotkey } = findMatchingHotkey(
    event,
    isInput,
    "normal",
    [], // normal 모드에서는 pendingKeys를 사용하지 않음
    pressedKeys, // 현재 눌린 키 Set
  );

  if (matchedHotkey) {
    matchedHotkey.callback(event);
    if (matchedHotkey.options.preventDefault) event.preventDefault();
    if (matchedHotkey.options.stopPropagation) event.stopPropagation();
    return;
  }
}

/**
 * 'leader' 모드에서 키다운 이벤트를 처리합니다.
 */
function handleLeaderModeKeyDown(event: KeyboardEvent, isInput: boolean): void {
  // ✨ ESC 키가 눌리면 리더 모드 즉시 종료
  if (event.code === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    resetLeaderMode();
    return;
  }

  // 현재 입력된 키를 pendingKeys에 추가
  if (
    !(
      event.code === "Space" &&
      keyState.pendingKeys.length === 1 &&
      keyState.pendingKeys[0] === "Space"
    )
  ) {
    keyState.pendingKeys.push(event.code);
  }
  // console.log("Current pendingKeys:", keyState.pendingKeys); // 디버그 로그

  const { matchedHotkey, hasPotentialMatch } = findMatchingHotkey(
    event,
    isInput,
    "leader",
    keyState.pendingKeys, // leader 모드에서는 pendingKeys를 사용
    pressedKeys,
  );

  if (matchedHotkey) {
    matchedHotkey.callback(event);
    if (matchedHotkey.options.preventDefault) event.preventDefault();
    if (matchedHotkey.options.stopPropagation) event.stopPropagation();
    resetLeaderMode();
    return;
  } else if (hasPotentialMatch) {
    event.preventDefault();
    event.stopPropagation();
    return;
  } else {
    // console.log("Invalid key sequence in leader mode. Returning to normal.");
    resetLeaderMode();
    return;
  }
}

/**
 * 'keydown' 이벤트를 처리하는 메인 함수입니다.
 * 키 입력에 따른 핫키 매칭 및 모드 전환 로직을 포함합니다.
 */
function handleKeyDown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement;
  const isInput =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  pressedKeys.add(event.code);
  keyState.pressedKeys = Array.from(pressedKeys).join(" ");

  if (keyState.currentMode === "leader")
    handleLeaderModeKeyDown(event, isInput);
  if (keyState.currentMode === "normal")
    handleNormalModeKeyDown(event, isInput);
}

/**
 * 'keyup' 이벤트를 처리합니다.
 * 키를 떼면 `pressedKeys` Set에서 해당 키를 제거합니다.
 */
function handleKeyUp(event: KeyboardEvent): void {
  pressedKeys.delete(event.code); // 키를 떼면 Set에서 제거
  keyState.pressedKeys = Array.from(pressedKeys).join(" "); // 디버깅용 UI 업데이트
}

// --- 핫키 등록/해제 API ---

/**
 * 사용자 친화적인 키 별칭을 KeyboardEvent.code 값으로 매핑합니다.
 * @param alias - 키 별칭 (예: 'ctrl', 'shift', 'space', 's')
 * @returns 해당 키의 KeyboardEvent.code 값 또는 원본 별칭 (매핑되지 않은 경우)
 */
function mapAliasToKeyCode(alias: string): string {
  const lowerAlias = alias.toLowerCase();
  switch (lowerAlias) {
    // 수식어 키 (매칭 로직에서 좌우 모두 고려할 수 있도록 일반적인 명칭 사용)
    case "control":
    case "ctrl":
      return "ControlLeft"; // ControlRight도 이 키에 매핑되도록 처리
    case "shift":
      return "ShiftLeft"; // ShiftRight도 이 키에 매핑되도록 처리
    case "alt":
      return "AltLeft"; // AltRight도 이 키에 매핑되도록 처리
    case "meta":
    case "command": // Mac의 Command 키
    case "windows": // Windows의 Windows 키
      return "MetaLeft"; // MetaRight도 이 키에 매핑되도록 처리

    // 특수 키
    case "escape":
    case "esc":
      return "Escape";
    case "space":
      return "Space";
    case "enter":
      return "Enter";
    case "tab":
      return "Tab";
    case "backspace":
      return "Backspace";
    case "delete":
      return "Delete";
    case "arrowup":
      return "ArrowUp";
    case "arrowdown":
      return "ArrowDown";
    case "arrowleft":
      return "ArrowLeft";
    case "arrowright":
      return "ArrowRight";
    case "home":
      return "Home";
    case "end":
      return "End";
    case "pageup":
      return "PageUp";
    case "pagedown":
      return "PageDown";
    case "capslock":
      return "CapsLock";
    case "numlock":
      return "NumLock";
    case "scrolllock":
      return "ScrollLock";
    case "pause":
    case "break":
      return "Pause";
    case "printscreen":
      return "PrintScreen";
    case "insert":
      return "Insert";

    // 기능 키 (F1-F12)
    case "f1":
      return "F1";
    case "f2":
      return "F2";
    case "f3":
      return "F3";
    case "f4":
      return "F4";
    case "f5":
      return "F5";
    case "f6":
      return "F6";
    case "f7":
      return "F7";
    case "f8":
      return "F8";
    case "f9":
      return "F9";
    case "f10":
      return "F10";
    case "f11":
      return "F11";
    case "f12":
      return "F12";
    // ... 필요한 경우 F13-F24 추가

    // 숫자 키패드
    case "numpad0":
      return "Numpad0";
    case "numpad1":
      return "Numpad1";
    case "numpad2":
      return "Numpad2";
    case "numpad3":
      return "Numpad3";
    case "numpad4":
      return "Numpad4";
    case "numpad5":
      return "Numpad5";
    case "numpad6":
      return "Numpad6";
    case "numpad7":
      return "Numpad7";
    case "numpad8":
      return "Numpad8";
    case "numpad9":
      return "Numpad9";
    case "numpadmultiply":
      return "NumpadMultiply";
    case "numpadadd":
      return "NumpadAdd";
    case "numpadsubtract":
      return "NumpadSubtract";
    case "numpaddecimal":
      return "NumpadDecimal";
    case "numpaddivide":
      return "NumpadDivide";

    // 일반 문자/숫자 키
    default:
      if (lowerAlias.length === 1 && /[a-z]/.test(lowerAlias)) {
        return `Key${lowerAlias.toUpperCase()}`;
      } else if (lowerAlias.length === 1 && /[0-9]/.test(lowerAlias)) {
        return `Digit${lowerAlias}`;
      } else if (lowerAlias === "plus" || lowerAlias === "+") {
        // + 기호 매핑
        return "Equal"; // 키보드마다 다를 수 있음
      } else if (lowerAlias === "minus" || lowerAlias === "-") {
        // - 기호 매핑
        return "Minus";
      } else if (lowerAlias === "equals" || lowerAlias === "=") {
        return "Equal";
      }
      // TODO: 기타 특수 문자 ([], {}, ', ", ;, :, <, >, ,, ., /, ?, \, |, ` 등) 추가 매핑
      // 예를 들어, `[` -> `BracketLeft`, `]` -> `BracketRight` 등

      // 매핑되지 않은 경우 경고 후 원본 별칭 반환
      console.warn(`Unknown key alias: ${alias}. Using as is.`);
      return alias;
  }
}
/**
 * 새로운 핫키 조합을 등록합니다.
 * @param hotkeySequence - 핫키로 사용할 키 조합 문자열 또는 문자열 배열 (예: 's', ['control', 's'], ['space', 't', 'f'])
 * @param callback - 핫키가 눌렸을 때 실행될 콜백 함수
 * @param options - 핫키의 동작을 제어하는 옵션 (모드, preventDefault 등)
 * @returns 등록된 핫키의 고유 ID
 */
function registerHotkey(
  hotkeySequence: string | string[],
  callback: HotkeyCallback,
  description: string,
  options: HotkeyOptions = { mode: "normal" },
): string {
  const parsedInputKeys = Array.isArray(hotkeySequence)
    ? hotkeySequence.map((k) => k.toLowerCase())
    : [hotkeySequence.toLowerCase()];

  const sequence: string[] = [];
  for (const k of parsedInputKeys) sequence.push(mapAliasToKeyCode(k));

  // ✨ 핫키 ID 생성: sequence를 underscore로 연결한 문자열
  const hotkeyId = sequence.join("_");
  // ✨ 중복 ID 검사
  const existingHotkey = registeredHotkeys.find((h) => h.id === hotkeyId);
  if (existingHotkey) {
    // console.log(
    //   `Hotkey "${hotkeyId}" (description: "${existingHotkey.description || "N/A"}") is already registered.`,
    // );
    return hotkeyId;
  }

  // 리더 모드 핫키는 반드시 'Space'로 시작해야 한다는 규칙을 여기에 추가할 수 있습니다.
  if (
    options.mode === "leader" &&
    (sequence[0] !== "Space" || sequence.length < 2)
  ) {
    console.warn(
      "Leader mode hotkeys must start with 'Space' and have at least one follow-up key. This hotkey might not work as intended:",
      hotkeySequence,
    );
    // 필요하다면 throw new Error(...) 로 등록을 막을 수도 있습니다.
  }

  const hotkey: RegisteredHotkey = {
    id: hotkeyId,
    sequence: sequence,
    callback: callback,
    description: description,
    options: {
      mode: options.mode,
      preventDefault: options.preventDefault ?? true,
      stopPropagation: options.stopPropagation ?? false,
      ignoreInInputs: options.ignoreInInputs ?? true,
    },
  };
  registeredHotkeys.push(hotkey);
  keyState.registeredHotkeys.push(hotkey);

  attachListeners();
  return hotkeyId;
}
function registerHotKeyList(registHotkeys: RegistHotkey[]) {
  registHotkeys.forEach((hotkey) => {
    registerHotkey(
      hotkey.hotkeySequence,
      hotkey.callback,
      hotkey.description,
      hotkey.options,
    );
  });
}

/**
 * 이전에 등록된 핫키를 해제합니다.
 * @param hotkeyId - 해제할 핫키의 고유 ID
 */
function unregisterHotkey(hotkeyId: string): void {
  const index = registeredHotkeys.findIndex((h) => h.id === hotkeyId);
  if (index > -1) {
    registeredHotkeys.splice(index, 1);
    keyState.registeredHotkeys.splice(index, 1);
  }
  detachListeners();
}
function unregisterHotkeyList(hotkeyIds: string[]): void {
  hotkeyIds.forEach((hotkeyId) => {
    unregisterHotkey(hotkeyId);
  });
}

// --- Public API 내보내기 ---
export const hotkeys = {
  register: registerHotkey,
  registers: registerHotKeyList,
  unregister: unregisterHotkey,
  unregisters: unregisterHotkeyList,
  keyState,
};
