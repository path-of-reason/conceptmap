# API를 활용한 커맨드 및 핫키 등록 가이드

이 문서는 애플리케이션 내에서 특정 동작(커맨드)을 정의하고, 이를 키보드 단축키(핫키)와 연결하여 활용하는 방법을 안내합니다. `API.command`와 `API.hotkey` 스토어를 중심으로 설명합니다.

## 핵심 개념

1.  **커맨드 (Command)**: 애플리케이션에서 수행할 수 있는 특정 동작을 추상화한 단위입니다. (예: 확대, 축소, 사이드바 토글).
2.  **핫키 (Hotkey)**: 정의된 커맨드를 실행하기 위한 키보드 단축키입니다.
3.  **`CMDKEYS`**: 커맨드의 고유한 문자열 식별자를 정의하는 상수 파일(`$lib/constant/commandKey`)입니다. 핫키와 커맨드를 연결하는 핵심 역할을 합니다.
4.  **`API.command`**: 애플리케이션 내의 모든 커맨드를 등록하고 관리하는 스토어입니다.
5.  **`API.hotkey`**: 키보드 이벤트를 감지하고, 정의된 핫키 시퀀스에 따라 연결된 커맨드를 실행하는 스토어입니다.

---

## 1. 커맨드 등록 (`API.command`)

커맨드는 애플리케이션이 수행할 수 있는 동작을 정의합니다. `initCommands.ts` 파일에서 `API.command.addCommandList`를 사용하여 커맨드를 등록합니다.

### 1단계: `CMDKEYS` 정의

-   각 커맨드에 대한 고유한 `key`를 `CMDKEYS` 객체에 정의합니다. 이는 핫키와 커맨드를 연결하는 데 사용됩니다.

```typescript
// $lib/constant/commandKey.ts (예시)
export const CMDKEYS = {
  LAYOUT: {
    ZOOM: {
      IN: "layout.zoom.in",
      OUT: "layout.zoom.out",
    },
    TOGGLE: {
      ZEN: "layout.toggle.zen",
    },
  },
  KUZU: {
    TEST: "kuzu.test",
  },
  // ...
};
```

### 2단계: 커맨드 객체 생성

-   `key`, `description`, `action` 속성을 포함하는 커맨드 객체를 생성합니다.
    -   `key`: `CMDKEYS`에서 정의한 고유 식별자.
    -   `description`: 사용자에게 표시될 커맨드에 대한 설명.
    -   `action`: 커맨드가 실행될 때 호출될 함수. 일반적으로 `API` 스토어의 특정 함수를 직접 연결합니다.

```typescript
// src/lib/store/initials/initCommands.ts (예시)

import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";

const zoomInCommand = {
  key: CMDKEYS.LAYOUT.ZOOM.IN,
  description: "LAYOUT: zoom in",
  action: API.layout.zoomIn, // API 스토어의 함수를 직접 연결
};

const toggleZenModeCommand = {
  key: CMDKEYS.LAYOUT.TOGGLE.ZEN,
  description: "LAYOUT: toggle zen mode",
  action: API.section.toggleZenMode,
};
```

### 3단계: `API.command.addCommandList`를 사용하여 커맨드 등록

-   생성한 커맨드 객체들을 배열 형태로 `API.command.addCommandList`에 전달하여 등록합니다.

```typescript
// src/lib/store/initials/initCommands.ts (예시)

export const initCommand = () => {
  API.command.addCommandList([
    {
      key: CMDKEYS.LAYOUT.ZOOM.IN,
      description: "LAYOUT: zoom in",
      action: API.layout.zoomIn,
    },
    {
      key: CMDKEYS.LAYOUT.ZOOM.OUT,
      description: "LAYOUT: zoom out",
      action: API.layout.zoomOut,
    },
    // ... 다른 레이아웃 커맨드들
  ]);

  API.command.addCommandList([
    {
      key: CMDKEYS.LAYOUT.TOGGLE.ZEN,
      description: "LAYOUT: toggle zen mode",
      action: API.section.toggleZenMode,
    },
    // ... 다른 섹션 커맨드들
  ]);
};
```

### 비동기 커맨드 처리

-   `TauriApi` 호출과 같이 비동기 작업을 수행하는 커맨드의 경우, `action` 함수 내에서 `Effect.runPromise`를 사용하여 비동기 `Effect`를 실행하고 결과를 처리합니다.

```typescript
// src/lib/store/initials/initCommands.ts (예시)

import { TauriApi } from "$lib/tauri/api";
import { Effect } from "effect";

const kuzuTestAction = () => {
  const effect = TauriApi.kuzu.kuzuTest(); // Tauri API 호출 (Effect 반환)
  Effect.runPromise(effect) // Effect 실행
    .then((result: string[]) => {
      console.log("Kuzu Test Success:", result);
    })
    .catch((error) => {
      console.error("Kuzu Test Failed:", error);
    });
};

API.command.addCommandList([
  {
    key: CMDKEYS.KUZU.TEST,
    description: "KUZU: run kuzu test command",
    action: kuzuTestAction, // 비동기 액션 연결
  },
]);
```

## 2. 핫키 등록 (`API.hotkey`)

핫키는 정의된 커맨드를 키보드 단축키를 통해 실행할 수 있도록 연결합니다. `initHotkeys.ts` 파일에서 `API.hotkey.registerAll` 또는 `API.hotkey.register`를 사용하여 핫키를 등록합니다.

### 1단계: 핫키 객체 생성

-   `hotkeySequence`, `commandKey`, `options` 속성을 포함하는 핫키 객체를 생성합니다.
    -   `hotkeySequence`: 키 조합을 나타내는 문자열 배열 (예: `["meta", "="]`, `["space", "z"]`).
    -   `commandKey`: 이 핫키가 실행할 커맨드의 `CMDKEYS` 값.
    -   `options`: 핫키의 동작 모드(`mode`)와 활성화될 컨텍스트(`context`)를 정의합니다.
        -   `mode`: `"normal"` (일반적인 단축키), `"leader"` (리더 키 시퀀스).
        -   `context`: 핫키가 활성화될 UI 컨텍스트 (예: `"global"`, `"leftSidebar"`, `"workspace"`).

```typescript
// src/lib/store/initials/initHotkeys.ts (예시)

import { CMDKEYS } from "$lib/constant/commandKey";

const zoomInHotkey = {
  hotkeySequence: ["meta", "="],
  commandKey: CMDKEYS.LAYOUT.ZOOM.IN,
  options: { mode: "normal", context: "global" },
};

const toggleZenModeHotkey = {
  hotkeySequence: ["space", "z"], // "space"를 누른 후 "z"를 누르는 리더 키 시퀀스
  commandKey: CMDKEYS.LAYOUT.TOGGLE.ZEN,
  options: { mode: "leader", context: "global" },
};
```

### 2단계: `API.hotkey.registerAll` 또는 `API.hotkey.register` 사용

-   생성한 핫키 객체들을 배열 형태로 `API.hotkey.registerAll`에 전달하여 등록합니다. 단일 핫키는 `API.hotkey.register`를 사용할 수 있습니다.

```typescript
// src/lib/store/initials/initHotkeys.ts (예시)

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
    // ... 다른 전역 핫키들
  ]);

  // 특정 컨텍스트 핫키 등록
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "shift", "["],
      commandKey: CMDKEYS.LEFTSIDEBAR.PREV,
      options: { mode: "normal", context: "leftSidebar" },
    },
    // ...
  ]);

  // 직접 액션을 실행하는 핫키 (커맨드 키 연결 없이)
  API.hotkey.register(
    ["enter"],
    () => console.log("Hello from right sidebar context!"),
    "test: right sidebar context",
    { mode: "normal", context: "rightSidebar" },
  );
};
```

## 결론

이 커맨드 및 핫키 시스템은 애플리케이션의 동작을 명확하게 정의하고, 사용자에게 유연한 키보드 단축키 경험을 제공합니다. 커맨드와 핫키를 분리함으로써, 동일한 동작을 여러 방식으로 트리거하거나, 핫키 조합을 쉽게 변경할 수 있는 확장성 있는 구조를 갖게 됩니다.

## 실무/고도화 조언
- 다국어화/설명 텍스트 분리
    description이 하드코딩되어 있지만, 추후 다국어 지원이 필요할 경우 별도의 리소스/번역 DB와 연결하는 패턴을 추가할 수 있음
- 핫키 충돌방지/가이드 API
    대규모 앱에선 핫키 중복 등록, 충돌 탐지, 동적 해제/교체 등 진단 툴 내장도 고려해보면 좋음
- 커맨드/핫키 enabled 조건
    “현재 상태에서 실행 가능 여부” 체크(예: readOnly 상태/disabling 체크)를 커맨드/핫키 layer에 기본옵션으로 추가하면 UX가 개선됨
- 유닛테스트/로깅 연동
    모든 커맨드/핫키 trigger시 로그 기록(옵션), 테스트용으로 “커맨드 강제실행” API를 제공하면 대규모 프로젝트에 더욱 적합
- 의존성 분리/DI 전략
    ‘API’ 계층이 직접적으로 핸들러와 연결될 경우, 테스트나 플러그인 아키텍처에서 handler 바꿔치기가 필요할 수 있으므로 DI(의존성 주입) 또는 registration-factory 패턴 확장을 고려해볼 수 있음
