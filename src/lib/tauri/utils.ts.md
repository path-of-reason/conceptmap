## 핵심 개념 (Core Concept)
이 파일은 Tauri API와 상호작용하기 위한 공용 유틸리티 함수와 타입을 제공합니다. 핵심 함수인 `invokeTauri`는 Tauri의 `invoke` API를 `effect-ts`의 `Effect`로 래핑하여, 애플리케이션 전체에서 Tauri 커맨드 호출을 위한 중앙 집중식 제어 지점을 마련하고 타입-세이프한 에러 핸들링을 가능하게 합니다.

## 설계 원칙 (Design Principle)
- **추상화**: `invoke`의 직접적인 사용을 추상화하여, 향후 로깅, 에러 처리, 성능 모니터링 등의 공통 로직을 한 곳에서 관리할 수 있도록 합니다.
- **타입 안정성**: `Effect`와 `Data.TaggedError`를 사용하여 Tauri 통신 계층의 모든 성공 및 실패 케이스를 타입 시스템 수준에서 명확하게 정의하고 강제합니다.

## 변경 이력 (Change History)
- **25.08.22**: `fileSystem.ts` 리팩토링 계획에 따라 `invokeTauri` 함수와 공용 에러 타입을 분리하여 파일 신규 생성. (요청: "Tauri API 아키텍처 정립")