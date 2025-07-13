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
  pendingKeys: string[]; // ✨ 리더 모드에서 입력 중인 키 시퀀스를 저장
};
type RegisteredHotkey = {
  id: number; // 고유 ID로 등록/해제 관리
  sequence: string[]; // ✨ 예: ['Space', 'KeyT', 'KeyF']와 같이 전체 키 시퀀스 저장
  keys: string[]; // ex: ['KeyS']
  modifiers: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  callback: HotkeyCallback;
  options: HotkeyOptions;
};

// --- 전역 상태 및 변수 ---
// 현재 눌린 키를 추적하는 Set
const pressedKeys = new Set<string>();
// 등록된 핫키 목록
const registeredHotkeys: RegisteredHotkey[] = [];
let nextHotkeyId = 0;
// 전역 이벤트 리스너가 이미 등록되었는지 확인
let isListenersAttached = false;
// ✨ 현재 키 입력 모드 상태 ($state로 반응성 추가)
// Svelte의 $state를 사용하여 반응성을 확보합니다.
const keyState = $state<KeyState>({
  pressedKeys: "",
  currentMode: "normal",
});

// ✨ 리더 모드 타이머 ID
// 리더 모드의 자동 복귀를 위한 타이머를 관리합니다.
let leaderModeTimeoutId: ReturnType<typeof setTimeout> | null = null;
const LEADER_MODE_TIMEOUT_MS = 700; // 리더 모드가 자동으로 해제되기까지의 대기 시간 (밀리초)

// --- 리더 모드 관리 함수 ---

/**
 * 리더 모드 타이머를 초기화하고 필요한 경우 모드를 'normal'로 되돌립니다.
 */
function resetLeaderMode(): void {
  // 현재 설정된 리더 모드 타이머가 있다면 취소합니다.
  if (leaderModeTimeoutId) {
    clearTimeout(leaderModeTimeoutId);
    leaderModeTimeoutId = null;
  }
  // 현재 모드가 'leader'라면 'normal'로 전환합니다.
  if (keyState.currentMode === "leader") {
    console.log("Leader mode timed out or reset. Returning to normal.");
    keyState.currentMode = "normal"; // 반응형 상태 업데이트
  }
}

/**
 * 리더 모드 타이머를 새로 설정하여 대기 시간을 연장합니다.
 * 이 함수는 리더 모드에서 추가 키 입력이 감지되었을 때 호출됩니다.
 */
function extendLeaderModeTimeout(): void {
  // 기존 타이머가 있다면 취소하고 새로운 타이머를 설정하여 대기 시간을 연장합니다.
  if (leaderModeTimeoutId) {
    clearTimeout(leaderModeTimeoutId);
  }
  leaderModeTimeoutId = setTimeout(resetLeaderMode, LEADER_MODE_TIMEOUT_MS);
}

// --- 이벤트 리스너 관리 함수 ---

/**
 * 전역 키 이벤트 리스너를 DOM에 부착합니다.
 * 리스너는 한 번만 부착되도록 보장합니다.
 */
function attachListeners(): void {
  if (isListenersAttached) return; // 이미 부착되어 있다면 건너뛰m

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  isListenersAttached = true;
}

/**
 * 모든 핫키가 해제되었을 경우 전역 키 이벤트 리스너를 DOM에서 제거합니다.
 */
function detachListeners(): void {
  // 등록된 핫키가 없고, 리스너가 부착되어 있을 때만 제거합니다.
  if (registeredHotkeys.length === 0 && isListenersAttached) {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    isListenersAttached = false;
  }
}

// --- 이벤트 핸들러 ---

/**
 * 'keydown' 이벤트를 처리하는 메인 함수입니다.
 * 키 입력에 따른 핫키 매칭 및 모드 전환 로직을 포함합니다.
 */
function handleKeyDown(event: KeyboardEvent): void {
  // 입력 필드(`input`, `textarea`) 또는 편집 가능한 요소(`contenteditable`) 여부 확인
  const target = event.target as HTMLElement;
  const isInput =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  // ✨ ESC 키가 눌리면 리더 모드 즉시 종료
  if (event.code === "Escape" && keyState.currentMode === "leader") {
    event.preventDefault(); // 기본 동작 방지 (예: 브라우저 뒤로 가기 등)
    event.stopPropagation(); // 이벤트 전파 중단
    resetLeaderMode(); // 리더 모드 종료 및 타이머 리셋
    return; // ESC 키는 핫키 매칭을 시도하지 않고 모드 전환만 합니다.
  }

  // ✨ Leader 모드 전환 로직: Space 키가 'normal' 모드에서 눌렸을 때
  // 입력 필드에서는 Space 키가 일반 입력으로 처리되도록 무시합니다.
  if (event.code === "Space" && keyState.currentMode === "normal" && !isInput) {
    event.preventDefault(); // Space 키의 기본 스크롤 동작 방지
    event.stopPropagation(); // 이벤트 전파 중단
    keyState.currentMode = "leader"; // 모드를 'leader'로 변경
    // 리더 모드 진입 시 타이머를 시작하여 일정 시간 내 다음 입력이 없으면 복귀시킵니다.
    leaderModeTimeoutId = setTimeout(resetLeaderMode, LEADER_MODE_TIMEOUT_MS);
    return; // Space 키는 자체적으로 핫키 액션을 실행하지 않고 모드 전환만 합니다.
  }

  // ✨ Leader 모드에서 다음 키 입력 처리 (타이머 연장)
  // 현재 'leader' 모드이고 Space 키가 다시 눌렸다면, 타이머를 연장합니다.
  // 또는 'leader' 모드에서 Space가 아닌 다른 키가 눌렸다면, 타이머를 연장합니다.
  if (keyState.currentMode === "leader") {
    if (event.code === "Space") {
      extendLeaderModeTimeout();
      // Space 키가 리더 모드에서도 특정 핫키로 등록될 수 있으므로,
      // 여기서는 모드 연장만 하고 핫키 매칭 루프로 진행되도록 return 하지 않습니다.
    } else {
      // Space가 아닌 다른 키가 눌렸을 때도 타이머 연장
      extendLeaderModeTimeout();
    }
  }

  // 현재 눌린 키를 `Set`에 추가하여 동시 입력 상태를 추적합니다.
  pressedKeys.add(event.code);
  // 디버깅 및 UI 표시를 위해 현재 눌린 키 목록을 문자열로 업데이트합니다.
  keyState.pressedKeys = Array.from(pressedKeys).join(" ");
  // console.log("pressedKeys", pressedKeys); // 디버그 로그
  // console.log(registeredHotkeys); // 디버그 로그

  let hotkeyExecuted = false; // 이번 `keydown` 이벤트로 핫키가 실행되었는지 여부 플래그

  // 등록된 핫키 목록을 순회하며 현재 입력과 일치하는 핫키를 찾습니다.
  for (const hotkey of registeredHotkeys) {
    // 핫키 옵션에 따라 입력 필드에서는 무시합니다.
    if (hotkey.options.ignoreInInputs && isInput) continue;

    // ✨ 현재 모드와 핫키의 모드가 일치하는지 확인합니다.
    // console.log("mode", hotkey.options.mode, keyState.currentMode); // 디버그 로그
    if (hotkey.options.mode !== keyState.currentMode) continue;

    // 핫키에 등록된 모든 필수 키가 `pressedKeys` Set에 포함되어 있는지 확인합니다.
    // console.log("", pressedKeys, hotkey.keys); // 디버그 로그
    const allKeysPressed = hotkey.keys.every((key) => pressedKeys.has(key));
    if (!allKeysPressed) continue;

    // 수식어 키(Ctrl, Shift, Alt, Meta)의 일치 여부를 확인합니다.
    // `undefined`는 해당 수식어 키가 필수가 아님을 의미합니다.
    const modifiersMatch =
      (hotkey.modifiers.ctrl === undefined ||
        hotkey.modifiers.ctrl === event.ctrlKey) &&
      (hotkey.modifiers.shift === undefined ||
        hotkey.modifiers.shift === event.shiftKey) &&
      (hotkey.modifiers.alt === undefined ||
        hotkey.modifiers.alt === event.altKey) &&
      (hotkey.modifiers.meta === undefined ||
        hotkey.modifiers.meta === event.metaKey);

    if (!modifiersMatch) continue;

    // TODO: (고급) hotkey.keys에 명시되지 않은 다른 키가 pressedKeys에 있는지 추가 확인 로직 (더 엄격한 매칭)

    // 일치하는 핫키가 발견되면 콜백 함수를 실행합니다.
    hotkey.callback(event);
    hotkeyExecuted = true; // 핫키가 실행되었음을 표시

    // 핫키 옵션에 따라 이벤트의 기본 동작을 방지하거나 전파를 중단합니다.
    if (hotkey.options.preventDefault) event.preventDefault();
    if (hotkey.options.stopPropagation) event.stopPropagation();

    // ✨ 예약된 핫키가 실행되었으므로 리더 모드 종료
    if (keyState.currentMode === "leader") {
      resetLeaderMode();
    }

    // 첫 번째 일치하는 핫키만 실행하려면 여기서 루프를 중단합니다.
    return;
  }

  // ✨ 핫키 실행 결과에 따른 리더 모드 상태 최종 처리
  // 리더 모드였는데, 유효한 핫키가 실행되지 않았다면(즉, 유효하지 않은 다음 키를 입력했다면)
  // 리더 모드를 종료하고 'normal' 모드로 복귀시킵니다.
  if (keyState.currentMode === "leader" && !hotkeyExecuted) {
    console.log("Invalid key in leader mode. Returning to normal.");
    keyState.currentMode = "normal"; // 'normal' 모드로 복귀
    resetLeaderMode(); // 리더 모드 타이머도 확실히 정리
  }
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
 * 새로운 핫키 조합을 등록합니다.
 * @param keys - 핫키로 사용할 키 조합 문자열 또는 문자열 배열 (예: 's', ['control', 's'])
 * @param callback - 핫키가 눌렸을 때 실행될 콜백 함수
 * @param options - 핫키의 동작을 제어하는 옵션 (모드, preventDefault 등)
 * @returns 등록된 핫키의 고유 ID
 */
function registerHotkey(
  keys: string | string[], // 's' 또는 ['control', 's']
  callback: HotkeyCallback,
  options: HotkeyOptions = { mode: "normal" }, // 기본 옵션 설정
): number {
  // 입력된 키 문자열을 파싱하여 `KeyboardEvent.code` 형태의 키 배열과 수식어를 분리합니다.
  const parsedKeys = Array.isArray(keys)
    ? keys.map((k) => k.toLowerCase())
    : [keys.toLowerCase()];

  const actualKeys: string[] = [];
  const modifiers: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  } = {};

  // 파싱 로직: 키보드 이벤트 코드와 수식어 분리
  for (const k of parsedKeys) {
    if (k === "control" || k === "ctrl") modifiers.ctrl = true;
    else if (k === "shift") modifiers.shift = true;
    else if (k === "alt") modifiers.alt = true;
    else if (k === "meta" || k === "command") modifiers.meta = true;
    else {
      // 일반 키는 `KeyboardEvent.code` 형태로 변환합니다.
      // 예: 's' -> 'KeyS', 'space' -> 'Space'
      // 이 부분은 실제 키보드 레이아웃과 `event.code` 사양에 맞춰 더 정교하게 매핑되어야 합니다.
      actualKeys.push(`Key${k.toUpperCase()}`); // 현재는 대략적인 매핑
    }
  }

  // 새로운 핫키 객체를 생성하고 목록에 추가합니다.
  const hotkey: RegisteredHotkey = {
    id: nextHotkeyId++,
    keys: actualKeys,
    modifiers: modifiers,
    callback: callback,
    options: {
      mode: options.mode,
      preventDefault: options.preventDefault ?? true, // 기본은 true로 설정
      stopPropagation: options.stopPropagation ?? false,
      ignoreInInputs: options.ignoreInInputs ?? true, // 기본은 입력 필드에서 무시
    },
  };
  registeredHotkeys.push(hotkey);
  // console.log("Register hotkey:", registeredHotkeys); // 디버그 로그

  // 첫 핫키 등록 시 전역 이벤트 리스너를 부착합니다.
  attachListeners();
  return hotkey.id;
}

/**
 * 이전에 등록된 핫키를 해제합니다.
 * @param hotkeyId - 해제할 핫키의 고유 ID
 */
function unregisterHotkey(hotkeyId: number): void {
  const index = registeredHotkeys.findIndex((h) => h.id === hotkeyId);
  if (index > -1) {
    registeredHotkeys.splice(index, 1);
  }
  // 모든 핫키가 해제되면 전역 리스너도 제거합니다.
  detachListeners();
}

// --- Public API 내보내기 ---
// Svelte 컴포넌트에서 임포트하여 사용할 수 있는 API들을 정의합니다.
export const hotkeys = {
  register: registerHotkey,
  unregister: unregisterHotkey,
  registeredHotkeys, // (디버깅용) 현재 등록된 핫키 목록을 노출
  keyState, // (반응형) 현재 키 입력 상태 (눌린 키, 모드)를 노출
};
