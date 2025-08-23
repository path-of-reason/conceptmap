# initHotkeys.ts

## 핵심 개념 (Core Concept)
애플리케이션의 기본 단축키(Hotkey)들을 설정하는 초기화 스크립트입니다. 특정 키 조합(`hotkeySequence`)과 `CMDKEYS`를 통해 정의된 명령어를 연결하여, `HotkeyApi`에 일괄적으로 등록하는 역할을 합니다.



## 변경 이력 (Change History)
- **2025-08-23**: `meta + p` 핫키를 `CMDKEYS.MODAL.OPEN_PALETTE`에 연결하여 팔레트 호출 기능 추가. (의도: 플러그인 확장성을 고려한 모달 뷰 변경 방식에 맞춰 팔레트 호출 핫키를 개선.)
- **2025-08-20**: 워크스페이스 탭 이동(이전/다음)을 위한 `meta+shift+[` 및 `meta+shift+]` 핫키 등록. (요청: "핫키로 탭 이동 기능 추가")
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
- **2025-08-20**: 왼쪽 사이드바, 오른쪽 사이드바, 워크스페이스 셀 포커스 관련 핫키들을 해당 컨텍스트(`leftSidebar`, `rightSidebar`, `workspace`)로 재할당했습니다. (요청: "글로벌 핫키 컨텍스트 변경")
- **2025-08-20**: 왼쪽 사이드바 뷰 변경 핫키(`CMDKEYS.LEFTSIDEBAR.PREV`, `CMDKEYS.LEFTSIDEBAR.NEXT`)를 `meta shift [` 및 `meta shift ]`로 수정했습니다. (요청: "leftsidebar 핫키 수정")
- **2025-08-20**: `initHotkeys.ts` 파일의 중복된 `API.hotkey.registerAll` 블록을 통합하고, 핫키 변경 사항을 적용했습니다. (요청: "initHotkeys.ts 코드 복구 및 핫키 변경 재적용")
- **2025-08-20**: `CMDKEYS.LEFTSIDEBAR.PREV` 및 `CMDKEYS.LEFTSIDEBAR.NEXT` 핫키의 모드를 `normal`로 변경하고, 시퀀스를 `BracketLeft`, `BracketRight`로 수정했습니다. (요청: "핫키 수정 및 문서화")
- **2025-08-20**: 핫키 등록 로직을 컨텍스트별 함수(`initGlobalHotkeys`, `initLeftSidebarHotkeys`, `initRightSidebarHotkeys`, `initWorkspaceHotkeys`)로 분리하여 코드의 가독성과 유지보수성을 향상시켰습니다. (요청: "컨텍스트별 함수 분리 리팩토링")
- **2025-08-20**: `rightSidebar` 컨텍스트에서 핫키 동작을 테스트하기 위한 `arrowleft` 테스트 핫키를 활성화하고 수정했습니다. (요청: "rightSidebar 핫키 테스트")

## 메뉴얼
### 1. 커맨드 키 정의
애플리케이션 전체에서 사용될 고유한 커맨드 키를 `src/lib/constant/commandKey.ts` 파일에 추가합니다. 이는 커맨드의 고유 식별자 역할을 합니다.

**예시:**
```typescript
// src/lib/constant/commandKey.ts
export const CMDKEYS = {
  // ...
  WORKSPACE: {
    // ...
    TAB: {
      NEW: "workspace_add_new_tab",
      REMOVE: "workspace_remove_tab",
      NEXT: "workspace_next_tab", // 새로운 커맨드 키
      PREV: "workspace_prev_tab", // 새로운 커맨드 키
    },
    // ...
  },
};
```

### 2. 커맨드 함수 등록
정의된 커맨드 키에 실제 실행될 함수를 연결합니다. 이는 `src/lib/store/initials/initCommands.ts` 파일에서 `API.command.addCommandList`를 통해 이루어집니다.

**예시:**
```typescript
// src/lib/store/initials/initCommands.ts
import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";

export const initCommand = () => {
  // ...
  API.command.addCommandList([
    // ... 기존 커맨드들
    {
      key: CMDKEYS.WORKSPACE.TAB.NEXT,
      description: "WORKSPACE: next tab",
      action: API.workspace.nextTab, // 실제 실행될 함수
    },
    {
      key: CMDKEYS.WORKSPACE.TAB.PREV,
      description: "WORKSPACE: prev tab",
      action: API.workspace.prevTab, // 실제 실행될 함수
    },
  ]);
};
```

### 3. 단축키 등록
등록된 커맨드를 특정 키 조합과 연결하여 단축키로 활성화합니다. 이는 `src/lib/store/initials/initHotkeys.ts` 파일에서 `API.hotkey.registerAll`을 통해 이루어지며, 특정 컨텍스트(`context`)에 따라 단축키의 유효 범위가 결정됩니다.

**예시:**
```typescript
// src/lib/store/initials/initHotkeys.ts
import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";

const initWorkspaceHotkeys = () => {
  API.hotkey.registerAll([
    // ... 기존 핫키들
    {
      hotkeySequence: ["meta", "shift", "]"], // 단축키 키 조합
      commandKey: CMDKEYS.WORKSPACE.TAB.NEXT, // 연결할 커맨드 키
      options: { mode: "normal", context: "workspace" }, // 핫키 옵션 (컨텍스트 포함)
    },
    {
      hotkeySequence: ["meta", "shift", "["],
      commandKey: CMDKEYS.WORKSPACE.TAB.PREV,
      options: { mode: "normal", context: "workspace" },
    },
  ]);
};
```
