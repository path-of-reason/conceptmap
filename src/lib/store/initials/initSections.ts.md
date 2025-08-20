# initSections.ts

## 핵심 개념 (Core Concept)
레이아웃을 구성하는 각 섹션(Section)들의 초기 설정을 정의하고 `SectionConfig`에 등록하는 스크립트입니다. 각 섹션(사이드바, 헤더 등)의 ID와 해당 섹션의 기본 크기, 방향, 초기 접힘 상태 등의 설정값을 지정합니다.

## 변경 이력 (Change History)
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
- **2025-08-20**: `LAYOUT.LEFT_SIDEBAR` 및 `LAYOUT.RIGHT_SIDEBAR`의 `collapsed` 상태를 명시적으로 지정하여 초기 설정의 가독성을 높였습니다. (요청: "레이아웃 초기 설정값 명시")
- **2025-08-20**: `LEFT_SIDEBAR`와 `RIGHT_SIDEBAR`에 `isHotkeyContext: true`를 설정하여, 핫키 컨텍스트로 등록될 섹션을 명시했습니다. (요청: "고급 컨텍스트 초기화")
- **2025-08-20**: 앱 시작 시 `isHotkeyContext`가 `true`이고 `collapsed`가 `false`인 섹션의 컨텍스트를 `ContextApi`에 자동으로 등록하는 로직을 추가했습니다. (요청: "고급 컨텍스트 초기화")