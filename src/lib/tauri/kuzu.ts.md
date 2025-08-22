## 핵심 개념 (Core Concept)
이 파일은 Tauri를 통해 Rust 백엔드에 구현된 KuzuDB 관련 테스트 함수(`kuzu_test`)를 호출하는 로직을 제공합니다. 모든 함수는 `effect-ts`의 `Effect`를 반환하여, KuzuDB와의 상호작용을 타입-세이프하게 처리합니다.

## 설계 원칙 (Design Principle)
- **기능적 응집도**: KuzuDB와 관련된 모든 Tauri 연동 로직을 이 파일에 모아 관리의 용이성과 코드의 응집도를 높입니다.
- **에러 구체화**: `invokeTauri`에서 발생하는 일반적인 `TauriInvokeError`를 `Effect.mapError`를 통해 구체적인 `KuzuError`로 변환하여, 호출하는 쪽에서 더 명확한 에러 처리를 할 수 있도록 돕습니다.

## 변경 이력 (Change History)
- **25.08.22**: KuzuDB 테스트 커맨드 연동 계획에 따라 파일 신규 생성. (요청: "KuzuDB 테스트 커맨드 연동")
