- [x] **1단계: 컨텍스트 관리 시스템 (`ContextApi`) 신설**
    - [x] `src/lib/store/context.svelte.ts` 파일을 새로 생성합니다.
    - [x] Svelte 5의 `$state`를 사용하여 현재 활성화된 컨텍스트 목록(`activeContexts: string[]`)을 관리하는 `ContextApi`를 구현합니다.
    - [x] `addContext`, `removeContext`, `hasContext` 등의 제어 함수를 포함합니다.
    - [x] `src/lib/store/api.ts`에 `ContextApi`를 추가하여 전역적으로 접근할 수 있도록 합니다.

- [x] **2단계: 핫키 타입 및 등록 로직 수정**
    - [x] `src/lib/types/hotkey.ts` 파일의 `HotkeyOptions` 타입에 `context?: string` 속성을 추가합니다.
    - [x] `hotkey.svelte.ts`의 `register` 함수가 `options` 객체에서 `context`를 받아 처리하도록 수정합니다.
    - [x] 기존에 등록된 핫키들이 이전과 같이 동작하도록, `initHotkeys.ts`에서 기존 핫키 등록 시 `context: 'global'`을 기본값으로 설정해줍니다.

- [x] **3단계: 핵심 매칭 로직 (`findMatchingHotkey`) 리팩토링**
    - [x] `hotkey.svelte.ts`에 `ContextApi`를 임포트합니다.
    - [x] `findMatchingHotkey` 함수가 `ContextApi`의 활성 컨텍스트 목록을 확인하도록 수정합니다.
    - [x] 핫키를 매칭할 때, 해당 핫키에 지정된 `context`가 현재 활성 컨텍스트 목록에 존재할 경우에만 매칭 후보로 간주합니다.
    - [x] **(중요)** 컨텍스트 우선순위 로직을 적용합니다: 특정 컨텍스트(예: `fileExplorer`)가 지정된 핫키가 `global` 컨텍스트 핫키보다 높은 우선순위를 갖도록 처리합니다.

- [x] **4단계: 컨텍스트 제공 및 테스트**
    - [x] 실제 컨텍스트를 제공할 UI 컴포넌트를 선정합니다. (예: `AppLayout.svelte` 또는 특정 뷰 컴포넌트)
    - [x] 해당 컴포넌트가 포커스를 얻거나 활성화될 때 `ContextApi.addContext()`를, 포커스를 잃거나 비활성화될 때 `ContextApi.removeContext()`를 호출하도록 코드를 추가합니다.
    - [x] 새로운 시스템을 검증하기 위해, 특정 컨텍스트에서만 동작하는 테스트용 신규 핫키를 하나 추가합니다.

- [x] **5단계: 온톨로지 문서 업데이트**
    - [x] `hotkey.svelte.ts.md` 파일의 '핵심 개념'을 수정하고, '변경 이력'에 이번 리팩토링 내용(컨텍스트 시스템 도입)과 의도를 상세히 기록합니다.

---
### **Gemini 개발 지시사항**

이 계획은 Gemini에 의해 실행됩니다.

- **체크리스트 업데이트**: 작업을 진행하면서 위에 제시된 `- [ ] 태스크` 형식의 체크리스트를 완료될 때마다 `- [x] 태스크`로 직접 업데이트해야 합니다.
- **완료 보고서 작성**:
  - 모든 태스크가 완료되면, 이 `[workname].plan.md` 파일과 함께 `[workname].complete.md` 형식의 작업 완료 보고서를 작성해주세요.
  - 보고서는 마크다운 Heading (`#`, `##`)을 사용하여 `plan.md`의 체크리스트 항목을 구조화하고, 각 항목 아래에 실제 코드 변경 내용(코드 블록), 구체적인 설명(변경 이유, 구현 이슈 및 해결 과정 등)을 상세히 포함해야 합니다.
  - 보고서는 변경 이력을 명확히 기록하고, 향후 코드 유지보수 및 이해에 도움이 되도록 한글로 작성되어야 합니다.
