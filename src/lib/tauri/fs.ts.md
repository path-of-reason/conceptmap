## 핵심 개념 (Core Concept)
이 파일은 Tauri를 통해 Rust 백엔드와 상호작용하여 파일 시스템 작업을 수행하는 모든 함수와 타입을 제공합니다. 모든 함수는 `effect-ts`의 `Effect`를 반환하여, 예측 가능하고 안정적인 방식으로 파일 읽기, 쓰기, 디렉토리 탐색 등의 작업을 처리합니다.

## 설계 원칙 (Design Principle)
- **기능적 응집도**: 파일 시스템과 직접적으로 관련된 모든 로직(함수, 타입, 에러)을 이 파일에 모아 관리의 용이성과 코드의 응집도를 높입니다.
- **에러 구체화**: `invokeTauri`에서 발생하는 일반적인 `TauriInvokeError`를 `Effect.mapError`를 통해 구체적인 `FileOperationError`로 변환하여, 호출하는 쪽에서 더 명확한 에러 처리를 할 수 있도록 돕습니다.

## 변경 이력 (Change History)
- **25.08.22**: `fileSystem.ts` 리팩토링 계획에 따라 파일 시스템 관련 로직을 분리하여 파일 신규 생성. (요청: "Tauri API 아키텍처 정립")
