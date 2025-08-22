## 핵심 개념 (Core Concept)
이 파일은 Tauri의 Dialog 플러그인과 상호작용하는 함수를 제공합니다. 시스템의 네이티브 파일/디렉토리 선택 다이얼로그를 열고, 그 결과를 `effect-ts`의 `Effect` 타입으로 안전하게 반환하는 역할을 합니다.

## 설계 원칙 (Design Principle)
- **플러그인 추상화**: Tauri 플러그인(`@tauri-apps/plugin-dialog`)의 직접적인 사용을 추상화하고, 프로젝트의 다른 부분에서는 `Effect` 기반의 일관된 인터페이스를 통해 다이얼로그 기능을 사용하도록 합니다.
- **에러 캡슐화**: `Effect.tryPromise`를 사용하여 Promise 기반의 플러그인 호출에서 발생할 수 있는 예외를 `DialogOperationError`라는 구체적인 에러 타입으로 캡슐화합니다.

## 변경 이력 (Change History)
- **25.08.22**: `fileSystem.ts` 리팩토링 계획에 따라 다이얼로그 관련 로직을 분리하여 파일 신규 생성. (요청: "Tauri API 아키텍처 정립")
