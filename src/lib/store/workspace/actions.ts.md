# actions.ts

## 핵심 개념 (Core Concept)
워크스페이스 내 셀 조작과 관련된 다양한 고수준 액션들을 그룹화한 `CellActions` 객체를 정의합니다. 이 액션들은 다른 전용 모듈(`panel.ts`, `focus.ts`, `resize.ts`)의 함수들을 호출하여 셀 분할, 제거, 포커스 이동, 크기 조절 등의 기능을 수행합니다.

## 변경 이력 (Change History)
- **2025-08-20**: `workspace.svelte.ts` 파일 분할의 일환으로 생성. 셀 액션 관련 로직을 포함합니다.
