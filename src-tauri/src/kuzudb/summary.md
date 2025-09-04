# 프로젝트 아키텍처 및 코드 구조 요약 문서
## 1. 프로젝트 개요
이 프로젝트는 Rust와 Tauri를 사용하여 데스크톱 환경에서 동작하는 개인용 제텔카스텐(Zettelkasten) 노트 앱의 백엔드입니다. 데이터베이스로는 KuzuDB(임베디드 그래프 데이터베이스)를 사용하여 노트 간의 복잡하고 유기적인 관계를 효율적으로 관리하는 것을 목표로 합니다.

## 2. 핵심 아키텍처: 계층형 구조 (Layered Architecture)
이 프로젝트는 유지보수성, 확장성, 그리고 각 부분의 명확한 책임 분리를 위해 계층형 아키텍처를 채택하고 있습니다. 데이터의 흐름은 외부(UI)에서 내부(DB)로 단방향으로 흐르며, 각 계층은 자신의 역할에만 집중합니다.

**Commands (Presentation) -> Service -> Repository -> Domain (Database)**

## 3. 파일 구조 및 레이어별 책임
프로젝트의 전체 구조는 다음과 같이 명확한 디렉토리로 분리되어 있습니다.

src-tauri/
 ├─ kuzudb/
 │   ├─ domain/
 │   │   ├─ mod.rs
 │   │   ├─ models.rs       # Domain Layer (Core Models)
 │   │   ├─ payloads.rs     # Domain Layer (DTOs)
 │   │   └─ schema.rs       # Domain Layer (DB Schema)
 │   ├─ repository/
 │   │   ├─ mod.rs
 │   │   ├─ nodes.rs        # Repository Layer
 │   │   ├─ relations.rs    # Repository Layer
 │   │   └─ utils.rs        # Repository Layer
 │   ├─ service/
 │   │   ├─ mod.rs
 │   │   └─ note.rs         # Service Layer
 │   ├─ commands.rs         # Presentation Layer
 │   └─ mod.rs
 └─ main.rs

### 3.1. Domain Layer (kuzudb/domain/)
책임: 애플리케이션의 핵심 데이터 구조와 비즈니스 규칙을 정의합니다.

*   **models.rs**: `Note`, `Author`, `Tag` 등 데이터베이스 스키마와 직접적으로 대응되는 **핵심 도메인 모델**을 정의합니다. 또한, 여러 DTO를 하나로 묶어주는 `NoteCreateType`, `NoteUpdateType` Enum이 위치합니다.
*   **payloads.rs**: `BiblioCard`, `AuthorPayload` 등 프론트엔드와 직접 통신하기 위한 **데이터 전송 객체(DTO)**를 정의합니다. 외부로부터의 데이터 수신 및 전송 형식을 담당합니다.
*   **schema.rs**: KuzuDB에 생성될 테이블(Node)과 관계(Rel)의 스키마를 정의합니다. `Authored` 관계에 `role` 속성을 추가하는 등 DB 구조를 명시하고, 앱 시작 시 기본 '박스 노트'들을 생성하는 초기화 로직을 담당합니다.

### 3.2. Repository Layer (kuzudb/repository/)
책임: 데이터베이스와의 모든 직접적인 상호작용(CRUD)을 담당합니다. Cypher 쿼리를 실행하고, DB 결과를 Rust 객체로 변환하는 '저수준(low-level)' 작업을 전담합니다.

*   **relations.rs**: `ChildOf`, `Next` 등 관계의 연결/해제/조회와 관련된 메서드를 구현합니다. 이제 `link_person_to_note`는 저자의 `role` 정보까지 함께 저장합니다.

(mod.rs, nodes.rs, utils.rs의 책임은 이전과 동일)

### 3.3. Service Layer (kuzudb/service/)
책임: 애플리케이션의 핵심 비즈니스 로직을 처리합니다. 여러 Repository 함수를 조합하여 하나의 완전한 기능을 수행하고, 트랜잭션 관리를 통해 데이터의 정합성을 보장합니다.

*   **note.rs**: `NoteService`의 메서드를 구현합니다. 예를 들어 `create_new_note` 메서드는 이제 단순히 노드를 생성하는 것을 넘어, **노트 타입에 따른 부모-자식 관계 규칙을 검증**하는 책임까지 가집니다. (예: `MAIN_BOX` 아래에는 `BiblioCard`를 생성할 수 없음)

### 3.4. Presentation Layer (kuzudb/commands.rs)
(책임 이전과 동일)

## 4. Domain Model 설계 철학
도메인 계층의 모델 설계는 이 프로젝트의 안정성과 확장성을 책임지는 핵심 사상을 담고 있습니다.

### 4.1. 책임의 분리: 도메인 모델 vs DTO (Data Transfer Objects)
모델은 두 가지 주요 목적으로 명확히 분리됩니다.

*   **도메인 모델 (in `models.rs`)**: `Note`, `Author` 등 애플리케이션 내부의 비즈니스 로직을 표현하는 핵심 데이터 모델입니다. 데이터베이스 스키마와 대응되며, 시스템의 '공식적인 시민'과 같습니다.
*   **DTO (in `payloads.rs`)**: `BiblioCard`, `AuthorPayload` 등 외부와의 통신을 위한 '입국 심사 서류'와 같습니다. 이 모델들은 API의 명세를 정의하며, 외부의 변화가 내부 로직에 직접적인 영향을 주지 않도록 방화벽 역할을 합니다.

예를 들어, `AuthorPayload`는 외부에서 저자 이름과 역할을 받아오는 역할을 하고, `Author`는 시스템 내부에서 저자 정보를 공식적으로 표현하는 모델입니다. 지금은 두 구조체가 비슷해 보이지만, 이러한 분리는 향후 API 스펙 변경이나 내부 모델 확장에 유연하게 대처할 수 있게 해주는 현명한 투자입니다.

### 4.2. 타입 안전성(Type Safety)을 통한 버그 예방
`NoteCreateType` Enum을 사용하는 가장 큰 이유는 컴파일 타임에 데이터의 유효성을 검증하기 위함입니다.

*   **필수 필드 강제**: `payloads::create::BiblioCard`의 `authors` 필드는 `Vec<AuthorPayload>` 타입입니다. 프론트엔드에서 `note_type`이 "BIBLIO"인 요청을 보낼 때, `authors` 필드가 올바른 형식으로 포함되어야 함을 Rust 컴파일러가 보장합니다. 잘못된 데이터는 Service 로직에 도달하기 전에 차단됩니다.

### 4.3. 핵심 필드 설계 원칙
*   **역할을 가진 저자 (Authors with Roles)**: `Note`에 `author` 필드를 두는 대신, `(Person)-[:Authored {role}]->(Note)`라는 관계 모델을 사용합니다. 이를 통해 노트 하나에 여러 저자를 연결할 수 있을 뿐만 아니라, '주 저자', '공동 저자', '옮긴이' 등 풍부한 문맥 정보를 `role` 속성에 담을 수 있어 모델의 표현력이 크게 향상됩니다.

(prev/next, 순서 있는 references에 대한 설명은 이전과 동일)

### 4.4. 명확한 API 계약
`payloads.rs` 파일과 `NoteCreateType`/`NoteUpdateType` Enum의 정의 자체가 프론트엔드와 백엔드 간의 명확한 API 계약서 역할을 합니다. 코드만으로 각 노트 타입을 생성/수정하기 위해 어떤 필드가 필요하고 선택적인지 명확하게 알 수 있습니다.

## 5. 핵심 동작 원칙
*   **Type-Safe 데이터 입력**: `NoteCreateType` Enum과 `payloads` DTO를 사용하여, 프론트엔드로부터 들어오는 데이터의 유효성을 컴파일 시점에 보장합니다.
*   **도메인 규칙의 중앙 관리**: "MainCard는 MainCard 아래에만 생성될 수 있다"와 같은 핵심 비즈니스 규칙은 **Service 계층에서 중앙 관리**됩니다. Service는 데이터가 DB에 도달하기 전의 '게이트키퍼' 역할을 수행하여, 애플리케이션 전체의 데이터 무결성을 보장합니다.
*   **트랜잭션의 중앙 관리**: 모든 데이터 변경 작업(CUD)은 Service 계층에서 트랜잭션을 시작하고 종료하여 원자성(Atomicity)을 보장합니다.
*   **API 네임스페이스 분리**: `db.nodes().create_note(...)`와 같이 API를 책임에 따라 분리하여, 코드의 가독성과 API의 발견 가능성(discoverability)을 높였습니다.

이 구조를 통해 각 부분은 자신의 역할에만 집중할 수 있어, 향후 새로운 기능을 추가하거나 기존 로직을 수정하는 작업이 매우 용이합니다.
