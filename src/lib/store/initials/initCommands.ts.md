# initCommands.ts

## 핵심 개념 (Core Concept)
애플리케이션에서 사용될 기본 명령어(Command)들을 정의하고, `CommandApi`를 통해 중앙 커맨드 시스템에 등록하는 초기화 스크립트입니다. `CMDKEYS`의 각 키와 실제 실행될 `API`의 함수를 연결하여, 앱 전체에서 사용될 명령어들을 설정합니다.

## 사용가이드
`document/command-hotkey-guide.md`를 참고

## 변경 이력 (Change History)
- **25.08.22**: KuzuDB 테스트를 위한 `kuzu_test` 커맨드 등록. (요청: "KuzuDB 테스트 커맨드 연동")
- **2025-08-20**: 워크스페이스 탭 이동(이전/다음) 기능을 위한 `API.workspace.nextTab` 및 `API.workspace.prevTab` 커맨드 등록. (요청: "핫키로 탭 이동 기능 추가")
- **2025-08-20**: AI 코드 온톨로지 시스템 도입에 따라 초기 문서 생성. (요청: "온톨로지 시스템 시범 적용")
