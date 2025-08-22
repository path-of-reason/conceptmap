# Svelte 5 스토어 작성 가이드

이 문서는 프로젝트의 일관성 있는 상태 관리를 위해 Svelte 5의 Rune을 활용하는 스토어 작성 패턴을 안내합니다.

## 핵심 원칙

1.  **API 객체 중심 (API-Centric):** 각 스토어는 관련된 상태, 상태 변경 함수, 파생 상태를 하나의 `...Api` 객체로 캡슐화하여 `export` 합니다.
2.  **중앙 집중 관리 (Centralized API):** 개별 스토어의 `...Api` 객체들은 `@src/lib/store/api.ts` 파일에서 하나의 `API` 객체로 통합하여, 애플리케이션 전역에서 일관된 방식으로 스토어에 접근할 수 있도록 합니다.
3.  **파일 명명 규칙:** 스토어 파일은 Svelte 5 Rune을 사용함을 명시하기 위해 `[기능명].svelte.ts` 형식으로 작성합니다.

---

## 스토어 작성 방법

`@src/lib/store/log.svelte.ts`를 예시로 스토어 작성 단계를 설명합니다.

### 1단계: 파일 생성 및 상태 정의 (`$state`)

-   `@src/lib/store/` 디렉터리에 `[기능명].svelte.ts` 파일을 생성합니다.
-   `$state` Rune을 사용하여 스토어의 핵심 상태를 정의합니다. 상태는 관련된 데이터를 그룹화한 단일 객체여야 합니다.

```typescript
// src/lib/store/log.svelte.ts

type LogMessage = {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  originalArgs?: any[];
};

// $state를 사용하여 반응적인 상태 객체 생성
const logState = $state<{
  logs: LogMessage[];
  filterLevel: 'all' | 'log' | 'warn' | 'error' | 'info';
  searchText: string;
}>({
  logs: [],
  filterLevel: 'all',
  searchText: '',
});
```

### 2단계: 상태 변경 함수 작성

-   `logState`를 직접 변경하는 함수들을 작성합니다. 이 함수들은 스토어 상태를 변경할 수 있는 유일한 통로 역할을 합니다.

```typescript
// src/lib/store/log.svelte.ts

const addLog = (level: LogMessage['level'], ...args: any[]) => {
  // ... (메시지 생성 로직)
  const newLog: LogMessage = { timestamp, level, message, originalArgs: args };
  logState.logs.push(newLog);

  if (logState.logs.length > MAX_LOG_ENTRIES) {
    logState.logs.shift();
  }
};

const clearLogs = () => {
  logState.logs = [];
};

const setFilterLevel = (level: LogMessage['level'] | 'all') => {
  logState.filterLevel = level;
};

const setSearchText = (text: string) => {
  logState.searchText = text;
};
```

### 3단계: 파생 상태 정의 (`$derived`)

-   `$derived` Rune을 사용하여 원본 상태(`logState`)에 의존하는 계산된 값을 정의합니다.
-   파생 상태는 원본 상태가 변경될 때만 자동으로 재계산되므로 효율적입니다.

```typescript
// src/lib/store/log.svelte.ts

const filteredLogs = $derived.by(() => {
  let logs = logState.logs;

  if (logState.filterLevel !== 'all') {
    logs = logs.filter(log => log.level === logState.filterLevel);
  }

  if (logState.searchText) {
    const searchLower = logState.searchText.toLowerCase();
    logs = logs.filter(log => log.message.toLowerCase().includes(searchLower));
  }
  return logs;
});
```

### 4단계: API 객체로 캡슐화 및 `export`

-   지금까지 만든 상태, 함수, 파생 상태를 `LogApi` 라는 이름의 단일 객체로 묶어 `export` 합니다.
-   이는 스토어의 공개 인터페이스 역할을 하며, 외부에서는 이 객체를 통해서만 스토어에 접근하게 됩니다.

```typescript
// src/lib/store/log.svelte.ts

export const LogApi = {
  state: logState, // 원본 상태
  addLog,
  clearLogs,
  setFilterLevel,
  setSearchText,
  filteredLogs, // 파생 상태
  // 편의를 위한 추가 메서드
  log: (...args: any[]) => addLog('log', ...args),
  info: (...args: any[]) => addLog('info', ...args),
  warn: (...args: any[]) => addLog('warn', ...args),
  error: (...args: any[]) => addLog('error', ...args),
};
```

### 5단계: 중앙 API (`api.ts`)에 등록

-   작성한 스토어의 `...Api` 객체를 `@src/lib/store/api.ts` 파일로 가져와 `API` 객체에 추가합니다.
-   이를 통해 애플리케이션의 모든 스토어는 `API`라는 단일 네임스페이스를 통해 접근할 수 있습니다.

```typescript
// src/lib/store/api.ts

import { ViewApi } from "./view.svelte";
import { HotkeyApi } from "./hotkey.svelte";
// ... 다른 Api 임포트

// 4단계에서 만든 LogApi를 임포트합니다.
import { LogApi } from "./log.svelte.ts";


export const API = {
  // window
  section: SectionApi,
  view: ViewApi,
  // ...

  // log
  log: LogApi, // 새로 만든 LogApi를 API 객체에 추가합니다.

  // command
  command: CommandApi,
  hotkey: HotkeyApi,
  context: ContextApi,
  commandHistory: CommandHistoryApi,
};
```

## 기대 효과

이 패턴을 따름으로써 프로젝트의 상태 관리는 다음과 같은 장점을 갖습니다.

-   **일관성:** 모든 스토어가 동일한 구조를 가져 코드 이해가 쉽습니다.
-   **명확한 데이터 흐름:** 상태 변경은 오직 API 객체가 제공하는 함수를 통해서만 일어나므로 데이터 흐름을 추적하기 용이합니다.
-   **쉬운 접근성:** 중앙 `API` 객체를 통해 어떤 컴포넌트에서든 원하는 스토어의 상태나 함수에 쉽게 접근할 수 있습니다.
-   **캡슐화:** 스토어의 내부 구현을 숨기고 공개된 API만을 노출하여 안정성을 높입니다.
