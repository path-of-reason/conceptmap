--plan --local --feature --output:tasks

- [ ] **1단계: 대상 파일 목록 확정**
    - `src/lib/constant/`
        - [ ] `commandKey.ts`
        - [x] `layout.ts`
    - `src/lib/store/`
        - [x] `api.ts`
        - [x] `command.ts`
        - [x] `hotkey.svelte.ts`
        - [x] `layout.svelte.ts`
        - [x] `modal.svelte.ts`
        - [x] `section.svelte.ts`
        - [x] `sectionConfig.ts`
        - [x] `view.svelte.ts`
        - [x] `workspace.svelte.ts`
    - `src/lib/store/initials/`
        - [x] `index.ts`
        - [x] `initCommands.ts`
        - [x] `initHotkeys.ts`
        - [x] `initSections.ts`
        - [x] `initViews.ts`

- [ ] **2단계: 온톨로지 문서 생성**
    - 위의 각 파일에 대해, 코드 내용을 분석하여 '핵심 개념'을 정의합니다.
    - 각 소스 파일 옆에 동일한 이름의 `.md` 파일을 생성합니다.
    - 생성된 `.md` 파일에 '핵심 개념'과 시스템 도입을 알리는 첫 '변경 이력'을 기록합니다.

- [x] **3단계: 최종 검토**
    - 모든 대상 파일에 대한 온톨로지 문서 생성이 성공적으로 완료되었는지 확인하고 보고합니다.

---
### **Gemini 개발 지시사항**

이 계획은 Gemini에 의해 실행됩니다.

- **체크리스트 업데이트**: 작업을 진행하면서 위에 제시된 `- [ ] 태스크` 형식의 체크리스트를 완료될 때마다 `- [x] 태스크`로 직접 업데이트해야 합니다.
- **완료 보고서 작성**:
  - 모든 태스크가 완료되면, 이 `[workname].plan.md` 파일과 함께 `[workname].complete.md` 형식의 작업 완료 보고서를 작성해주세요.
  - 보고서는 마크다운 Heading (`#`, `##`)을 사용하여 `plan.md`의 체크리스트 항목을 구조화하고, 각 항목 아래에 실제 코드 변경 내용(코드 블록), 구체적인 설명(변경 이유, 구현 이슈 및 해결 과정 등)을 상세히 포함해야 합니다.
  - 보고서는 변경 이력을 명확히 기록하고, 향후 코드 유지보수 및 이해에 도움이 되도록 한글로 작성되어야 합니다.
