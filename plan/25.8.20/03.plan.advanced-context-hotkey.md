- [x] **1단계: 컨텍스트 히스토리 시스템 (`ContextApi`) 구현**
    - [x] `src/lib/store/context.svelte.ts` 파일을 생성합니다.
    - [x] `ContextApi`는 **'로컬' 컨텍스트의 히스토리만**을 스택으로 관리하도록 구현합니다. (`global`은 스택에 포함하지 않습니다.)
    - [x] `enter(context)`, `leave(context)`, `getActiveLocalContext()` 등의 제어 함수를 구현합니다.
    - [x] `src/lib/store/api.ts`에 `ContextApi`를 통합합니다.

- [x] **2단계: 핫키 타입 및 등록 로직 수정**
    - [x] `src/lib/types/hotkey.ts`의 `HotkeyOptions` 타입에 `context?: string` 속성을 추가합니다.
    - [x] `hotkey.svelte.ts`의 `register` 함수에서 `context` 옵션이 주어지지 않으면 `'global'`로 기본값을 설정하도록 수정합니다.
    - [x] `initHotkeys.ts`에서 기존 핫키들이 모두 `context: 'global'`을 갖도록 명시적으로 수정하여 하위 호환성을 보장합니다.

- [x] **3단계: 핵심 매칭 로직 (`findMatchingHotkey`) 재설계**
    - [x] `hotkey.svelte.ts`의 `findMatchingHotkey` 함수 로직을 다음의 **'현재 컨텍스트 -> 글로벌 -> 종료'** 규칙에 따라 완전히 재작성합니다.
        1. `ContextApi`를 통해 현재 활성화된 '로컬 컨텍스트'를 가져옵니다.
        2. 활성화된 로컬 컨텍스트가 있다면, **오직 해당 컨텍스트 내에서만** 핫키를 검색하고, 일치하는 것을 찾으면 즉시 반환하고 모든 검색을 종료합니다.
        3. 위에서 일치하는 것을 찾지 못했거나, 활성화된 로컬 컨텍스트가 없다면, **그때만 `'global'` 컨텍스트**에서 핫키를 검색합니다.
        4. 최종 결과를 반환합니다. (다른 로컬 컨텍스트는 절대 검색하지 않습니다.)

- [x] **4단계: UI 연동 및 피드백 구현**
    - [x] **상태바 연동**: `src/layout/components/Statusbar.svelte` 파일을 수정하여, `ContextApi`의 현재 컨텍스트 스택(`contextStack`)을 실시간으로 표시하는 디버깅 UI를 추가합니다.
    - [x] **컨텍스트 활성화**: `section.svelte.ts` 또는 `AppLayout.svelte`을 수정하여, 사이드바가 열릴 때 `API.context.enter('leftSidebar')`를, 닫힐 때 `API.context.leave('leftSidebar')`를 호출하도록 구현합니다.
    - [x] **테스트**: `initHotkeys.ts`에 `context: 'leftSidebar'`로 지정된 테스트용 핫키를 추가하여, 새로운 시스템이 의도대로 동작하는지 검증합니다.

- [x] **5단계: 온톨로지 문서 업데이트**
    - [x] `hotkey.svelte.ts.md` 파일의 내용을 이번에 재설계된 아키텍처에 맞게 수정합니다.
    - [x] `context.svelte.ts.md` 파일을 생성하여 새로운 `ContextApi`의 역할과 개념을 기록합니다.

---
### **Gemini 개발 지시사항**

이 계획은 Gemini에 의해 실행됩니다.

- **체크리스트 업데이트**: 작업을 진행하면서 위에 제시된 `- [ ] 태스크` 형식의 체크리스트를 완료될 때마다 `- [x] 태스크`로 직접 업데이트해야 합니다.
- **완료 보고서 작성**:
  - 모든 태스크가 완료되면, 이 `[workname].plan.md` 파일과 함께 `[workname].complete.md` 형식의 작업 완료 보고서를 작성해주세요.
  - 보고서는 마크다운 Heading (`#`, `##`)을 사용하여 `plan.md`의 체크리스트 항목을 구조화하고, 각 항목 아래에 실제 코드 변경 내용(코드 블록), 구체적인 설명(변경 이유, 구현 이슈 및 해결 과정 등)을 상세히 포함해야 합니다.
  - 보고서는 변경 이력을 명확히 기록하고, 향후 코드 유지보수 및 이해에 도움이 되도록 한글로 작성되어야 합니다.
