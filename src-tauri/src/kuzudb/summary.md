# 프로젝트 아키텍처 및 코드 구조 요약 문서
## 1. 프로젝트 개요
이 프로젝트는 Rust와 Tauri를 사용하여 데스크톱 환경에서 동작하는 개인용 제텔카스텐(Zettelkasten) 노트 앱의 백엔드입니다. 데이터베이스로는 KuzuDB(임베디드 그래프 데이터베이스)를 사용하여 노트 간의 복잡하고 유기적인 관계를 효율적으로 관리하는 것을 목표로 합니다.

## 2. 핵심 아키텍처: 계층형 구조 (Layered Architecture)
이 프로젝트는 유지보수성, 확장성, 그리고 각 부분의 명확한 책임 분리를 위해 계층형 아키텍처를 채택하고 있습니다. 데이터의 흐름은 외부(UI)에서 내부(DB)로 단방향으로 흐르며, 각 계층은 자신의 역할에만 집중합니다.

Commands (Presentation) -> Service -> Repository -> Domain (Database)

## 3. 파일 구조 및 레이어별 책임
프로젝트의 전체 구조는 다음과 같이 명확한 디렉토리로 분리되어 있습니다.

src-tauri/
 ├─ kuzudb/
 │   ├─ domain/
 │   │   ├─ mod.rs
 │   │   ├─ models.rs       # Domain Layer
 │   │   └─ schema.rs       # Domain Layer
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
책임: 애플리케이션의 핵심 데이터 구조와 규칙을 정의합니다. 시스템의 '명사'에 해당하며, 다른 모든 계층이 이 곳에 정의된 모델을 기반으로 동작합니다.

models.rs: Note, Tag, Person 등 DB에 저장될 데이터의 Rust 구조체를 정의합니다. 프론트엔드로부터 데이터를 안전하게 받기 위한 NoteType enum과 각 카드 타입별 구조체(MainCard, BiblioCard 등)도 이곳에 위치합니다.

schema.rs: KuzuDB에 생성될 테이블(Node)과 관계(Rel)의 스키마를 정의하고, 앱 시작 시 기본 '박스 노트'들을 생성하는 등 DB 초기화 로직을 담당합니다.

### 3.2. Repository Layer (kuzudb/repository/)
책임: 데이터베이스와의 모든 직접적인 상호작용(CRUD)을 담당합니다. Cypher 쿼리를 실행하고, DB 결과를 Rust 객체로 변환하는 '저수준(low-level)' 작업을 전담합니다.

mod.rs: KuzuDB라는 메인 DB 핸들러를 정의합니다. nodes()와 relations() 메서드를 통해 각 책임자(Node API, Relation API)를 외부에 제공하는 창구 역할을 합니다.

nodes.rs: Note, Tag 등 노드의 생성, 조회, 삭제(CRUD)와 관련된 메서드들을 구현합니다.

relations.rs: ChildOf, Next, HasTag 등 관계의 연결, 해제, 조회와 관련된 메서드들을 구현합니다.

utils.rs: Repository 계층 내부에서만 사용되는 헬퍼 함수(타입 변환 등)를 모아둡니다.

#### 3.2.1. Repository 메서드 작명 규칙
Repository API의 가독성과 예측 가능성을 높이기 위해 다음과 같은 명명 규칙을 따릅니다.

create_*: Note, Tag 등 새로운 노드를 데이터베이스에 생성합니다. (MERGE를 사용하여 중복 생성을 방지합니다.)

get_*: 특정 노드나 관계 정보를 조회합니다. 접미사 _id가 붙으면 전체 객체가 아닌 ID(String)만 반환합니다.

link_*: 두 기존 노드 사이에 새로운 관계를 생성합니다.

unlink_*: 두 노드 사이의 기존 관계를 삭제합니다.

remove_*: 노드 자체를 삭제합니다. DETACH DELETE를 사용하여 연결된 모든 관계와 함께 안전하게 삭제합니다.

### 3.3. Service Layer (kuzudb/service/)
책임: 애플리케이션의 핵심 비즈니스 로직을 처리합니다. 여러 Repository 함수를 조합하여 하나의 완전한 기능을 수행하고, 트랜잭션 관리를 통해 데이터의 정합성을 보장합니다.

mod.rs: 서비스 계층의 진입점으로, NoteService 구조체를 정의하고 외부에 공개합니다.

note.rs: NoteService의 메서드를 구현합니다. 예를 들어 create_new_note 메서드는 노트 생성, 부모 연결, 형제 관계 재구성, 태그 연결 등 여러 DB 작업을 하나의 트랜잭션으로 묶어 순서대로 실행합니다.

### 3.4. Presentation Layer (kuzudb/commands.rs)
책임: 프론트엔드(UI)와 백엔드 로직을 연결하는 가장 얇은 '창구' 역할을 합니다.

commands.rs: Tauri의 #[tauri::command] 매크로가 붙은 함수들이 위치합니다. 이 함수들은 프론트엔드로부터 요청(JSON)을 받아, 유효한 Rust 객체(NoteType 등)로 변환한 뒤, 해당하는 Service 메서드를 호출하고 그 결과를 다시 프론트엔드로 전달하는 역할만 수행합니다. 비즈니스 로직은 전혀 포함하지 않습니다.

## 4. Domain Model 설계 철학 (models.rs)
models.rs 파일의 구조는 이 프로젝트의 안정성을 책임지는 핵심적인 설계 사상을 담고 있습니다.

### 4.1. 책임의 분리: Note vs NoteType
모델은 두 가지 주요 목적으로 나뉩니다.

Note 구조체: 데이터베이스 스키마와 1:1로 대응하는 '저장용' 모델입니다. 모든 종류의 노트가 가질 수 있는 모든 필드를 Option을 포함하여 정의합니다. 이는 DB에 데이터를 저장하고 읽어오는 Repository Layer에서 주로 사용됩니다.

NoteType Enum: **프론트엔드로부터 요청을 받기 위한 '입력용' 모델(DTO)**입니다. serde(tag = "note_type") 어트리뷰트를 통해, JSON 객체의 note_type 필드 값에 따라 MainCard, BiblioCard 등 각각 다른 구조체로 역직렬화(deserialization)됩니다.

### 4.2. 타입 안전성(Type Safety)을 통한 버그 예방
NoteType enum을 사용하는 가장 큰 이유는 컴파일 타임에 데이터의 유효성을 검증하기 위함입니다.

필수 필드 강제: BiblioCard의 author 필드는 String 타입이지, Option<String>이 아닙니다. 이는 프론트엔드에서 note_type이 "BIBLIO"인 요청을 보낼 때, author 필드가 반드시 포함되어야 함을 Rust 컴파일러가 보장하게 만듭니다. 만약 해당 필드가 누락되면, Service 로직에 도달하기도 전에 Tauri의 역직렬화 단계에서 오류가 발생하여 잘못된 데이터가 시스템에 들어오는 것을 원천적으로 차단합니다.

런타임 오류 최소화: "필수 필드가 비어있으면 어떡하지?" 와 같은 방어적인 코드를 작성할 필요가 사라집니다. match NoteType::Biblio(card) 블록 안에서, card.author는 언제나 유효한 String 값임이 보장되므로, 개발자는 안심하고 비즈니스 로직에만 집중할 수 있습니다.

### 4.3. 핵심 필드 설계 원칙
prev와 next의 역할 분리:

prev (in NoteType Enum): 프론트엔드가 백엔드에 **"새 노드를 어디에 삽입할지"**라는 사용자의 '의도'를 전달하기 위한 필드입니다. Some(id)이면 특정 노드 뒤, None이면 맨 앞에 삽입하라는 의미입니다.

Next/Prev 관계 (in Database): 백엔드가 프론트엔드의 '의도'를 받아, 실제 데이터베이스의 **'상태'**를 관리하기 위한 양방향 연결 리스트입니다. Service 계층은 prev 값을 바탕으로 Next/Prev 관계를 안전하게 재구성할 책임을 집니다. 이처럼 역할을 분리함으로써 API를 단순하게 유지하고 데이터 무결성을 보장합니다.

순서 있는 references: MainCard나 IndexCard의 references는 단순한 참조 목록이 아니라, 사용자의 사고 흐름이나 논리적 순서를 담고 있는 중요한 데이터입니다. "A를 근거로 B를 생각했고, 이를 통해 C라는 결론을 내렸다"와 같은 맥락을 표현하기 위해, Repository에서는 관계(Relationship) 자체에 order 속성을 두어 이 순서를 명확하게 저장합니다.

### 4.4. 명확한 API 계약
NoteType enum의 정의 자체가 프론트엔드와 백엔드 간의 명확한 API 계약서 역할을 합니다. 각 노트 타입을 생성하기 위해 어떤 필드가 필요하고 선택적인지 코드만으로 명확하게 알 수 있습니다.

이러한 설계는 런타임에 발생할 수 있는 수많은 잠재적 버그를 컴파일 타임으로 옮겨와, 훨씬 더 안정적이고 예측 가능한 애플리케이션을 만들 수 있게 해줍니다.

## 5. 핵심 동작 원칙
Type-Safe 데이터 입력: NoteType enum과 serde(tag = "...")를 사용하여, 프론트엔드로부터 들어오는 데이터의 유효성을 컴파일 시점에 보장합니다. 잘못된 형식의 데이터는 서비스 로직에 도달하기 전에 차단됩니다.

트랜잭션의 중앙 관리: 모든 데이터 변경 작업(CUD)은 Service 계층에서 트랜잭션을 시작하고 종료합니다. 이를 통해 여러 DB 작업이 '전부 성공하거나 전부 실패'하는 원자성(Atomicity)을 보장하여 데이터가 깨지는 것을 방지합니다.

API 네임스페이스 분리: db_state.nodes().create_note(...)와 같이 API를 책임에 따라 분리하여, 코드의 가독성과 API의 발견 가능성(discoverability)을 높였습니다.

이 구조를 통해 각 부분은 자신의 역할에만 집중할 수 있어, 향후 새로운 기능을 추가하거나 기존 로직을 수정하는 작업이 매우 용이합니다.

