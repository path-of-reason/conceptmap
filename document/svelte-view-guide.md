# Svelte 뷰 생성 및 애플리케이션 적용 가이드

이 문서는 애플리케이션의 뷰 관리 시스템을 활용하여 새로운 Svelte 뷰 컴포넌트를 생성하고, 이를 애플리케이션에 등록하여 사용하는 방법을 안내합니다.

## 핵심 개념

-   **`API.view`**: 사이드바와 같은 주요 영역에 표시될 뷰들을 관리하는 스토어입니다.
-   **`API.modal`**: 모달 형태로 표시될 뷰들을 관리하는 스토어입니다.
-   **뷰 설정 객체**: 각 뷰는 `id`, `type`, `name`, `component`, `icon` 등의 속성을 포함하는 객체로 정의됩니다.
    -   `id`: 뷰의 고유 식별자.
    -   `type`: 뷰가 표시될 영역 (예: `"leftSidebar"`, `"rightSidebar"`, `"full"` for modal).
    -   `name`: UI에 표시될 뷰의 이름.
    -   `component`: 뷰의 실제 UI를 렌더링할 Svelte 컴포넌트.
    -   `icon`: 뷰를 나타내는 아이콘 (선택 사항, `lucide/svelte` 라이브러리 사용).

---

## 뷰 생성 및 적용 단계

### 1단계: Svelte 뷰 컴포넌트 생성

새로운 뷰로 사용될 Svelte 컴포넌트 파일을 생성하고, 해당 뷰의 UI와 로직을 작성합니다. 컴포넌트 파일은 일반적으로 `src/layout/views/[영역]/` 폴더 내에 위치합니다.

```svelte
<!-- src/layout/views/left/MyNewView.svelte -->
<script lang="ts">
  // 필요한 스크립트 로직
</script>

<div class="my-new-view">
  <h1>새로운 뷰입니다!</h1>
  <p>이곳에 뷰의 내용을 작성하세요.</p>
</div>

<style>
  .my-new-view {
    padding: 1rem;
    background-color: var(--color-background-alt);
    color: var(--color-text);
  }
</style>
```

### 2단계: 뷰 등록

생성한 뷰 컴포넌트를 `src/lib/store/initials/initViews.ts` 파일에 등록합니다. 이 파일은 애플리케이션 시작 시 모든 뷰를 초기화하는 역할을 합니다.

1.  **컴포넌트 임포트**: 새로 생성한 Svelte 컴포넌트를 임포트합니다.
2.  **뷰 설정 객체 정의**: 뷰의 `type`, `id`, `name`, `component`, `icon` 등을 포함하는 객체를 정의합니다.
3.  **`API.view.registerViewList` 또는 `API.modal.registerModalViewAll` 사용**: 뷰의 유형에 따라 적절한 메서드를 사용하여 뷰를 등록합니다.

```typescript
// src/lib/store/initials/initViews.ts

import { API } from "$lib/store/api";
import { icons } from "@lucide/svelte";
// ... 기존 임포트

import MyNewView from "@/layout/views/left/MyNewView.svelte"; // 새로 생성한 뷰 컴포넌트 임포트

export const initView = () => {
  API.view.registerViewList([
    // ... 기존 사이드바 뷰들
    {
      type: "leftSidebar", // 뷰가 표시될 영역
      id: "myNewView", // 뷰의 고유 ID
      name: "My New View", // UI에 표시될 이름
      component: MyNewView, // 연결할 Svelte 컴포넌트
      icon: icons.Lightbulb, // 뷰를 나타낼 아이콘 (예시: Lightbulb 아이콘)
    },
  ]);

  API.modal.registerModalViewAll([
    // ... 기존 모달 뷰들
    {
      id: "myNewModal", // 모달의 고유 ID
      type: "full", // 모달 유형 (예: "full", "dialog")
      component: MyNewView, // 모달로 사용할 컴포넌트
    },
  ]);
};
```

### 3단계: 뷰 활성화 및 사용

등록된 뷰는 `API.view` 또는 `API.modal` 스토어의 메서드를 통해 활성화하거나 제어할 수 있습니다.

#### 사이드바 뷰 활성화

-   **커맨드를 통한 전환**: `initCommands.ts`에서 정의된 커맨드를 통해 사이드바 뷰를 전환할 수 있습니다. 예를 들어, `API.view.nextLeftView` 커맨드는 왼쪽 사이드바의 다음 뷰로 전환합니다.

    ```typescript
    // src/lib/store/initials/initCommands.ts (예시)
    API.command.addCommandList([
      {
        key: CMDKEYS.LEFTSIDEBAR.NEXT,
        description: "LAYOUT: next left sidebar view",
        action: API.view.nextLeftView,
      },
      // ...
    ]);
    ```

-   **직접 활성화**: 특정 `id`를 가진 뷰를 직접 활성화하는 메서드(예: `API.view.setActiveView(type, id)`)가 있다면 이를 사용할 수 있습니다.

#### 모달 뷰 활성화

-   **커맨드를 통한 토글**: `API.modal.toggleModal` 커맨드를 통해 모달을 열거나 닫을 수 있습니다.

    ```typescript
    // src/lib/store/initials/initCommands.ts (예시)
    API.command.addCommandList([
      {
        key: CMDKEYS.LAYOUT.TOGGLE.MODAL,
        description: "LAYOUT: toggle modal",
        action: API.modal.toggleModal,
      },
      // ...
    ]);
    ```

-   **직접 열기/닫기**: 특정 `id`를 가진 모달을 직접 열거나 닫는 메서드(예: `API.modal.openModal(id)`, `API.modal.closeModal()`)가 있다면 이를 사용할 수 있습니다.


## 실무/고도화된 발전 방향

### A. **“동적/지연 로딩(Dynamic/Lazy Loading)” 개선**
- 뷰의 컴포넌트 import를 static이 아닌 dynamic import로 바꿀 수 있음(코드 splitting)  
  예)  
  ```typescript
  component: () => import("@/layout/views/left/MyNewView.svelte")
  ```
- 초기 번들 크기 감소 → 대형 앱, 플러그인, SPA 라우팅 시스템에도 적합

### B. **“플러그인/외부 모듈 뷰” 확장**
- 뷰 객체를 외부에서 동적으로 등록하는 플러그인 시스템(예: API.view.registerExternalView) 지원  
- 커뮤니티, 플러그인 기반 확장에 효과적

### C. **권한/조건부 렌더링**
- 뷰 등록 시 “visible/enable 조건”(권한, 로깅, 실험 플래그 등) 속성을 추가  
-  
  ```typescript
  visible: (user, context) => boolean;
  ```
  → 특정 유저/상황에서만 보이는 뷰 제어

### D. **상태-뷰 바인딩 강화**
- 뷰가 사용하는 글로벌 상태를 명시적 바인딩 또는 DI로 연결  
- 대형 앱에서는 뷰별 의존 Store, context 표기/자동 주입 체계를 구축하면 복잡도 감소

### E. **애니메이션/트랜지션 시스템 모듈화**
- 뷰 전환 시 트랜지션/애니메이션 정책을 옵션화 (뷰마다 다르게)  
- UX 일관성과 커스터마이징에 유리

### F. **메타데이터/국제화(i18n) 지원**
- 뷰의 name/description 필드를 메타데이터/다국어 처리와 연결  
- 추후 대규모, 글로벌 서비스에 대응

### G. **테스트/문서화 자동화**
- 모든 뷰/모달 객체 자동 추출 → 문서/테스트 케이스/목록 생성 자동화, 스토리북/플레이그라운드 연동


