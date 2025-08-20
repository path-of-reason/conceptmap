# initHotkeys.ts

## 핵심 개념 (Core Concept)
애플리케이션의 기본 단축키(Hotkey)들을 설정하는 초기화 스크립트입니다. 특정 키 조합(`hotkeySequence`)과 `CMDKEYS`를 통해 정의된 명령어를 연결하여, `HotkeyApi`에 일괄적으로 등록하는 역할을 합니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
- **2025-08-20**: 왼쪽 사이드바, 오른쪽 사이드바, 워크스페이스 셀 포커스 관련 핫키들을 해당 컨텍스트(`leftSidebar`, `rightSidebar`, `workspace`)로 재할당했습니다. (요청: "글로벌 핫키 컨텍스트 변경")
- **2025-08-20**: 왼쪽 사이드바 뷰 변경 핫키(`CMDKEYS.LEFTSIDEBAR.PREV`, `CMDKEYS.LEFTSIDEBAR.NEXT`)를 `meta shift [` 및 `meta shift ]`로 수정했습니다. (요청: "leftsidebar 핫키 수정")
- **2025-08-20**: `initHotkeys.ts` 파일의 중복된 `API.hotkey.registerAll` 블록을 통합하고, 핫키 변경 사항을 적용했습니다. (요청: "initHotkeys.ts 코드 복구 및 핫키 변경 재적용")
- **2025-08-20**: `CMDKEYS.LEFTSIDEBAR.PREV` 및 `CMDKEYS.LEFTSIDEBAR.NEXT` 핫키의 모드를 `normal`로 변경하고, 시퀀스를 `BracketLeft`, `BracketRight`로 수정했습니다. (요청: "핫키 수정 및 문서화")
- **2025-08-20**: 핫키 등록 로직을 컨텍스트별 함수(`initGlobalHotkeys`, `initLeftSidebarHotkeys`, `initRightSidebarHotkeys`, `initWorkspaceHotkeys`)로 분리하여 코드의 가독성과 유지보수성을 향상시켰습니다. (요청: "컨텍스트별 함수 분리 리팩토링")
- **2025-08-20**: `rightSidebar` 컨텍스트에서 핫키 동작을 테스트하기 위한 `arrowleft` 테스트 핫키를 활성화하고 수정했습니다. (요청: "rightSidebar 핫키 테스트")
