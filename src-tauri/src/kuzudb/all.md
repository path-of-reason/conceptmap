```md summary.md

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

```

```rs commands.rs

use crate::kuzudb::domain::schema;
use crate::kuzudb::{
    domain::models::{NoteAggregate, NoteCreateType, NoteUpdateType},
    repository::KuzuDB,
    service::NoteService,
};
use crate::vault_manager;
use std::{fs, path::Path};
use tauri::AppHandle;

fn initialize_vault_db(app: &AppHandle) -> Result<KuzuDB, String> {
    let vault_path = vault_manager::get_current_vault_path(app)?;
    let db_path = Path::new(&vault_path).join(".config").join("kuzu.db");
    if let Some(parent) = db_path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }
    let kuzudb = KuzuDB::new(db_path.to_str().unwrap()).map_err(|e| e.to_string())?;
    schema::initialize(&kuzudb).map_err(|e| e.to_string())?;
    Ok(kuzudb)
}

#[tauri::command]
pub fn create_note(app: AppHandle, note: NoteCreateType) -> Result<String, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .create_new_note(note)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_notes(app: AppHandle) -> Result<Vec<NoteAggregate>, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service.get_all_notes().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_note_aggregate_by_id(app: AppHandle, id: String) -> Result<NoteAggregate, String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .get_note_aggregate_by_id(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_note(app: AppHandle, id: String, payload: NoteUpdateType) -> Result<(), String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service
        .update_note(&id, payload)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_note(app: AppHandle, id: String) -> Result<(), String> {
    let kuzudb = initialize_vault_db(&app)?;
    let note_service = NoteService::new(&kuzudb);
    note_service.remove_note(&id).map_err(|e| e.to_string())
}

```

```rs domain/mod.rs

pub mod models;
pub mod payloads;
pub mod schema;

```

```rs domain/models.rs

use super::payloads;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Note {
    pub id: String,
    pub title: String,
    // 배열이 필요한 content, tags, references 등은 JSON 문자열로 저장
    pub content: String,   // e.g., "[\"Page 1\", \"Page 2\"]" or "Some text"
    pub note_type: String, // "BOX", "BIBCARD", "HR", "QUOTE", "MAINCARD", "INDEXCARD"
    pub sub_type: Option<String>, // 책, 논문, 블로그 (BIBCARD) / part, chapter (HR)

    // BIBCARD용 필드
    // pub author: Option<String>,
    pub published_at: Option<String>,
    pub cover_url: Option<String>,

    pub file_path: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SequencedReference {
    pub note_id: String,
    pub sequence: i64,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Author {
    pub name: String,
    pub role: Option<String>,
}

// 읽기 전용 집계 구조체
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteAggregate {
    pub note: Note,
    pub tags: Vec<String>,                   // HasTag 관계로부터 가져옴
    pub references: Vec<SequencedReference>, // References 관계와 sequence 속성으로부터 가져옴
    pub authors: Vec<Author>,                // Authored 관계로부터 가져옴
    pub parent: Option<String>,
    pub first_child: Option<String>,
    pub next: Option<String>,
    pub prev: Option<String>,
}

impl From<Note> for NoteAggregate {
    fn from(note: Note) -> Self {
        Self {
            note,
            tags: Vec::new(),
            references: Vec::new(),
            authors: Vec::new(),
            parent: None,
            first_child: None,
            next: None,
            prev: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub name: String,
} // 태그로 사용하다가, 같은 의미의 태그가 많아지면, TagAlias

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TagAlias {
    pub name: String,
} // Tag: 유용함, TagAlias: 쓸모, 유용성, 유용
  // MATCH (ta:TagAlias {name: "쓸모"})-[:ALIAS_OF]->(t:Tag) RETURN t
  // MATCH (n:Note {id: ...}), (t:Tag {name: "유용성"}) MERGE (n)-[:HAS_TAG]->(t)

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Person {
    pub name: String,
}

// ------------------------------------------------------
// 2. 외부에서 사용할 깔끔한 Enum API 정의
// ------------------------------------------------------
#[derive(Deserialize, Debug)]
#[serde(tag = "note_type", rename_all = "UPPERCASE")]
pub enum NoteCreateType {
    Index(payloads::create::IndexCard),
    Main(payloads::create::MainCard),
    Biblio(payloads::create::BiblioCard),
    Quote(payloads::create::QuoteCard),
    Hr(payloads::create::HrCard),
}

#[derive(Deserialize, Debug)]
#[serde(tag = "note_type", content = "data", rename_all = "UPPERCASE")]
pub enum NoteUpdateType {
    Main(payloads::update::MainCard),
    Biblio(payloads::update::BiblioCard),
    Quote(payloads::update::QuoteCard),
    Index(payloads::update::IndexCard),
}

```

```rs domain/payloads.rs

use serde::{Deserialize, Serialize};

// ✨ 추가: 저자 정보와 역할을 함께 받기 위한 입력용 구조체
#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct AuthorPayload {
    pub name: String,
    pub role: Option<String>,
}

pub mod create {
    use super::AuthorPayload; // ✨ `super`를 통해 같은 파일 내의 AuthorPayload를 가져옴
    use serde::Deserialize;

    #[derive(Deserialize, Debug, Default)]
    pub struct IndexCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub reference: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct MainCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub reference: Vec<String>,
        pub tags: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct BiblioCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub authors: Vec<AuthorPayload>,
        pub published_at: String,
        pub sub_type: String,
        pub cover_url: Option<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct QuoteCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub authors: Vec<AuthorPayload>,
        pub tags: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct HrCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub sub_type: String,
    }
}
pub mod update {
    use super::AuthorPayload; // ✨ `super`를 통해 같은 파일 내의 AuthorPayload를 가져옴
    use serde::Deserialize;

    #[derive(Deserialize, Debug, Default)]
    pub struct MainCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub reference: Option<Vec<String>>,
        pub tags: Option<Vec<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct BiblioCard {
        pub title: Option<String>,
        pub authors: Option<Vec<AuthorPayload>>,
        pub published_at: Option<String>,
        pub sub_type: Option<String>,
        pub cover_url: Option<Option<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct QuoteCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub authors: Option<Vec<AuthorPayload>>,
        pub tags: Option<Vec<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct IndexCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub reference: Option<Vec<String>>,
    }
}

```

```rs domain/schema.rs

use super::models::Note;
use crate::kuzudb::error::Result;
use crate::kuzudb::repository::KuzuDB;
use chrono::Utc;
use kuzu::Connection;

pub fn initialize(kuzudb: &KuzuDB) -> Result<()> {
    let conn = Connection::new(&kuzudb.instance)?;
    create_schema(&conn)?;
    create_default_box_notes(kuzudb, &conn)?;
    Ok(())
}

fn create_schema(conn: &Connection) -> Result<()> {
    let schema_query = r#"
        // 1. Node Tables
        CREATE NODE TABLE IF NOT EXISTS Note(
            id STRING PRIMARY KEY,
            title STRING,
            content STRING,
            note_type STRING,
            sub_type STRING,
            published_at STRING,
            cover_url STRING,
            file_path STRING,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        );

        CREATE NODE TABLE IF NOT EXISTS Tag(
            name STRING PRIMARY KEY
        );

        CREATE NODE TABLE IF NOT EXISTS TagAlias(
            name STRING PRIMARY KEY
        );

        CREATE NODE TABLE IF NOT EXISTS Person(
            name STRING PRIMARY KEY
        );

        // 2. Rel(ationship) Tables
        CREATE REL TABLE IF NOT EXISTS ChildOf(FROM Note TO Note);
        CREATE REL TABLE IF NOT EXISTS FirstChild(FROM Note TO Note);
        CREATE REL TABLE IF NOT EXISTS Next(FROM Note TO Note);
        CREATE REL TABLE IF NOT EXISTS Prev(FROM Note TO Note);

        CREATE REL TABLE IF NOT EXISTS HasTag(FROM Note TO Tag);
        CREATE REL TABLE IF NOT EXISTS AliasOf(FROM TagAlias TO Tag);
        CREATE REL TABLE IF NOT EXISTS Authored(
            FROM Person TO Note,
            role STRING
        );

        CREATE REL TABLE IF NOT EXISTS References(
            FROM Note TO Note,
            sequence INT64
        );
    "#;
    conn.query(schema_query)?;
    Ok(())
}

fn create_default_box_notes(kuzudb: &KuzuDB, conn: &Connection) -> Result<()> {
    let default_boxes = vec![
        ("INDEX_BOX", "INDEX", "인덱스 메모"),
        ("MAIN_BOX", "MAIN", "자기 생각"),
        ("REFERENCE_BOX", "REFERENCE", "각종 서지/인용"),
    ];

    for (id_key, name, desc) in default_boxes {
        let id = id_key.to_string();
        if !kuzudb.nodes().is_exist(&conn, &id)? {
            let now = Utc::now();
            let note = Note {
                id: id.clone(),
                title: name.to_string(),
                content: desc.to_string(),
                note_type: "BOX".to_string(), // 박스들의 타입은 'BOX'로 통일
                sub_type: None,
                published_at: None,
                cover_url: None,
                file_path: None, // 박스노트는 별도의 파일Path가 없음
                created_at: now,
                updated_at: now,
            };
            kuzudb.nodes().create_note(&conn, &note)?;
        }
    }
    Ok(())
}

```

```rs error.rs

use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("KuzuDB operation failed: {0}")]
    Kuzu(#[from] kuzu::Error),

    #[error("Note with ID '{0}' not found")] // update or remove  for service layer
    NoteNotFound(String),

    #[error("Transaction failed: {0}")]
    Transaction(String),

    #[error("Data integrity error: {0}")]
    Integrity(String),
}

// Result 타입을 우리 커스텀 에러로 미리 정의해두면 편리합니다.
pub type Result<T> = std::result::Result<T, Error>;

```

```rs mod.rs

pub mod commands;
pub mod domain;
pub mod error;
pub mod repository;
pub mod service;

```

```rs repository/mod.rs

use kuzu::{Database, SystemConfig};

mod nodes;
mod relations;
mod utils;

pub struct Node;
pub struct Relation;

pub struct KuzuDB {
    pub instance: Database,
}

impl KuzuDB {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let db_instance =
            Database::new(db_path, SystemConfig::default()).map_err(|e| e.to_string())?;
        Ok(Self {
            instance: db_instance,
        })
    }

    pub fn nodes(&self) -> Node {
        Node
    }

    pub fn relations(&self) -> Relation {
        Relation
    }
}

```

```rs repository/nodes.rs

use super::utils::{chrono_to_odt, extract_string, extract_timestamp, option_string_to_value};
use super::Node;
use crate::kuzudb::{
    domain::models::{Note, Person, Tag, TagAlias},
    error::{Error, Result},
};
use kuzu::{Connection, QueryResult, Value};

impl Node {
    pub fn create_note(&self, conn: &Connection, note: &Note) -> Result<()> {
        let mut prepared = conn.prepare(
            "CREATE (n:Note {
                        id: $id, title: $title, content: $content,
                        created_at: $created_at, updated_at: $updated_at,
                        note_type: $note_type, sub_type: $sub_type,
                        published_at: $published_at,
                        cover_url: $cover_url, file_path: $file_path
                    })",
        )?;

        let created_at_odt = chrono_to_odt(&note.created_at);
        let updated_at_odt = chrono_to_odt(&note.updated_at);

        conn.execute(
            &mut prepared,
            vec![
                ("id", Value::String(note.id.clone())),
                ("title", Value::String(note.title.clone())),
                ("content", Value::String(note.content.clone())),
                ("created_at", Value::Timestamp(created_at_odt)),
                ("updated_at", Value::Timestamp(updated_at_odt)),
                ("note_type", Value::String(note.note_type.clone())),
                ("sub_type", option_string_to_value(&note.sub_type)),
                ("published_at", option_string_to_value(&note.published_at)),
                ("cover_url", option_string_to_value(&note.cover_url)),
                ("file_path", option_string_to_value(&note.file_path)),
            ],
        )?;
        Ok(())
    }
    pub fn create_tag(&self, conn: &Connection, tag: &Tag) -> Result<()> {
        let mut prepared = conn.prepare("MERGE (t:Tag {name: $name})")?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(tag.name.clone()))],
        )?;
        Ok(())
    }
    pub fn create_tag_alias(&self, conn: &Connection, alias: &TagAlias) -> Result<()> {
        let mut prepared = conn.prepare("MERGE (ta:TagAlias {name: $name})")?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(alias.name.clone()))],
        )?;
        Ok(())
    }
    pub fn create_person(&self, conn: &Connection, person: &Person) -> Result<()> {
        let mut prepared = conn.prepare("MERGE (p:Person {name: $name})")?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(person.name.clone()))],
        )?;
        Ok(())
    }

    pub fn update_note(&self, conn: &Connection, note: &Note) -> Result<()> {
        let mut prepared = conn.prepare(
            "MATCH (n:Note {id: $id})
             SET n.title = $title,
                 n.content = $content,
                 n.note_type = $note_type,
                 n.sub_type = $sub_type,
                 n.published_at = $published_at,
                 n.cover_url = $cover_url,
                 n.file_path = $file_path,
                 n.updated_at = $updated_at",
        )?;

        let updated_at_odt = chrono_to_odt(&note.updated_at);

        conn.execute(
            &mut prepared,
            vec![
                ("id", Value::String(note.id.clone())),
                ("title", Value::String(note.title.clone())),
                ("content", Value::String(note.content.clone())),
                ("note_type", Value::String(note.note_type.clone())),
                ("sub_type", option_string_to_value(&note.sub_type)),
                ("published_at", option_string_to_value(&note.published_at)),
                ("cover_url", option_string_to_value(&note.cover_url)),
                ("file_path", option_string_to_value(&note.file_path)),
                ("updated_at", Value::Timestamp(updated_at_odt)),
            ],
        )?;
        Ok(())
    }

    pub fn remove_note(&self, conn: &Connection, id: &str) -> Result<()> {
        let mut prepared = conn.prepare("MATCH (n:Note {id: $id}) DETACH DELETE n")?;
        conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])?;
        Ok(())
    }
    pub fn remove_tag(&self, conn: &Connection, tag: &str) -> Result<()> {
        let mut prepared = conn.prepare("MATCH (t:Tag {name: $tag}) DETACH DELETE t")?;
        conn.execute(&mut prepared, vec![("tag", Value::String(tag.to_string()))])?;
        Ok(())
    }
    pub fn remove_tag_alias(&self, conn: &Connection, tag_alias: &str) -> Result<()> {
        let mut prepared = conn.prepare("MATCH (t:TagAlias {name: $tag_alias}) DETACH DELETE t")?;
        conn.execute(
            &mut prepared,
            vec![("tag_alias", Value::String(tag_alias.to_string()))],
        )?;
        Ok(())
    }
    pub fn remove_person(&self, conn: &Connection, person: &str) -> Result<()> {
        let mut prepared = conn.prepare("MATCH (p:Person {name: $person}) DETACH DELETE p")?;
        conn.execute(
            &mut prepared,
            vec![("person", Value::String(person.to_string()))],
        )?;
        Ok(())
    }

    pub fn is_exist(&self, conn: &Connection, id: &str) -> Result<bool> {
        let mut prepared = conn.prepare("MATCH (n:Note {id: $id}) RETURN n.id")?;
        let mut result =
            conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])?;
        Ok(result.next().is_some())
    }

    pub fn get_all_notes_and_relations(
        &self,
        conn: &Connection,
    ) -> Result<(
        Vec<Note>,
        Vec<(String, String)>,                 // ChildOf
        Vec<(String, String)>,                 // FirstChild
        Vec<(String, String)>,                 // Next
        Vec<(String, String)>,                 // Prev
        Vec<(String, String)>,                 // HasTag
        Vec<(String, String, i64)>,            // References
        Vec<(String, Option<String>, String)>, // Authored (Person.name, Note.id)
    )> {
        // 1. 모든 노트 가져오기
        let mut notes = vec![];
        let result: QueryResult = conn.query("MATCH (n:Note) RETURN n.id, n.title, n.content, n.created_at, n.updated_at, n.note_type, n.sub_type, n.published_at, n.cover_url, n.file_path")?;
        for row in result.into_iter() {
            notes.push(Note {
                id: extract_string(&row[0]).ok_or(Error::Integrity("id missing".into()))?,
                title: extract_string(&row[1]).ok_or(Error::Integrity("title missing".into()))?,
                content: extract_string(&row[2]).unwrap_or_default(),
                created_at: extract_timestamp(&row[3])
                    .ok_or(Error::Integrity("created_at missing".into()))?,
                updated_at: extract_timestamp(&row[4])
                    .ok_or(Error::Integrity("updated_at missing".into()))?,
                note_type: extract_string(&row[5])
                    .ok_or(Error::Integrity("type missing".into()))?,
                sub_type: extract_string(&row[6]),
                published_at: extract_string(&row[7]),
                cover_url: extract_string(&row[8]),
                file_path: extract_string(&row[9]),
                ..Default::default()
            });
        }

        // 헬퍼 함수: 두 ID를 가진 관계를 가져옵니다.
        let get_pair_rel = |query: &str| -> Result<Vec<(String, String)>> {
            let mut rels = vec![];
            let result = conn.query(query)?;
            for row in result.into_iter() {
                let from = extract_string(&row[0])
                    .ok_or(Error::Integrity("relation 'from' missing".into()))?;
                let to = extract_string(&row[1])
                    .ok_or(Error::Integrity("relation 'to' missing".into()))?;
                rels.push((from, to));
            }
            Ok(rels)
        };

        // 2. 모든 관계들 가져오기
        let child_of = get_pair_rel("MATCH (c:Note)-[:ChildOf]->(p:Note) RETURN c.id, p.id")?;
        let first_child = get_pair_rel("MATCH (p:Note)-[:FirstChild]->(c:Note) RETURN p.id, c.id")?;
        let next = get_pair_rel("MATCH (a:Note)-[:Next]->(b:Note) RETURN a.id, b.id")?;
        let prev = get_pair_rel("MATCH (a:Note)-[:Prev]->(b:Note) RETURN a.id, b.id")?;
        let has_tag = get_pair_rel("MATCH (n:Note)-[:HasTag]->(t:Tag) RETURN n.id, t.name")?;
        let mut authored = vec![];
        // ✨ 수정: coalesce 함수를 사용하여 role이 없는 경우에도 항상 NULL 값을 반환하도록 보장합니다.
        let result_authored = conn.query(
            "MATCH (p:Person)-[r:Authored]->(n:Note) RETURN p.name, coalesce(r.role, NULL), n.id",
        )?;
        for row in result_authored.into_iter() {
            let person_name =
                extract_string(&row[0]).ok_or(Error::Integrity("person name missing".into()))?;
            let role = extract_string(&row[1]); // 이제 row[1]은 항상 안전합니다.
            let note_id = extract_string(&row[2])
                .ok_or(Error::Integrity("authored note id missing".into()))?;
            authored.push((person_name, role, note_id));
        }

        // 3. 순서가 있는 참조 관계 가져오기
        let mut references = vec![];
        let result_refs =
            conn.query("MATCH (a:Note)-[r:References]->(b:Note) RETURN a.id, b.id, r.sequence")?;
        for row in result_refs.into_iter() {
            let from =
                extract_string(&row[0]).ok_or(Error::Integrity("ref 'from' missing".into()))?;
            let to = extract_string(&row[1]).ok_or(Error::Integrity("ref 'to' missing".into()))?;
            let sequence = match &row[2] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("ref 'sequence' is not i64".to_string())),
            };
            references.push((from, to, sequence));
        }

        Ok((
            notes,
            child_of,
            first_child,
            next,
            prev,
            has_tag,
            references,
            authored,
        ))
    }

    pub fn get_note_by_id(&self, conn: &Connection, id: &str) -> Result<Option<Note>> {
        let mut prepared = conn.prepare(
            "MATCH (n:Note {id: $id}) RETURN
                     n.id, n.title, n.content, n.created_at, n.updated_at,
                     n.note_type, n.sub_type, n.published_at,
                     n.cover_url, n.file_path",
        )?;

        let mut result =
            conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])?;

        if let Some(row) = result.next() {
            let note = Note {
                id: extract_string(&row[0]).ok_or(Error::Integrity("id missing".into()))?,
                title: extract_string(&row[1]).ok_or(Error::Integrity("title missing".into()))?,
                content: extract_string(&row[2]).unwrap_or_default(),
                created_at: extract_timestamp(&row[3])
                    .ok_or(Error::Integrity("created_at missing".into()))?,
                updated_at: extract_timestamp(&row[4])
                    .ok_or(Error::Integrity("updated_at missing".into()))?,
                note_type: extract_string(&row[5])
                    .ok_or(Error::Integrity("note_type missing".into()))?,
                sub_type: extract_string(&row[6]),
                published_at: extract_string(&row[7]),
                cover_url: extract_string(&row[8]),
                file_path: extract_string(&row[9]),
                ..Default::default()
            };
            return Ok(Some(note));
        }

        Ok(None)
    }
}

```

```rs repository/relations.rs

use super::Relation;
use crate::kuzudb::{
    domain::models::Author,
    error::{Error, Result},
};
use kuzu::{Connection, Value};

impl Relation {
    fn execute_single(&self, conn: &Connection, query: &str, id: &str) -> Result<()> {
        let mut prepared = conn.prepare(query)?;
        conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])?;
        Ok(())
    }
    fn execute_pair(&self, conn: &Connection, query: &str, from: &str, to: &str) -> Result<()> {
        let mut prepared = conn.prepare(query)?;
        conn.execute(
            &mut prepared,
            vec![
                ("from", Value::String(from.to_string())),
                ("to", Value::String(to.to_string())),
            ],
        )?;
        Ok(())
    }
    pub fn link_parent(&self, conn: &Connection, child_id: &str, parent_id: &str) -> Result<()> {
        self.execute_pair(
            &conn,
            "MATCH (c:Note {id: $from}), (p:Note {id: $to}) MERGE (c)-[:ChildOf]->(p)",
            child_id,
            parent_id,
        )
    }
    pub fn link_first_child(
        &self,
        conn: &Connection,
        parent_id: &str,
        child_id: &str,
    ) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (p:Note {id: $from}), (c:Note {id: $to}) MERGE (p)-[:FirstChild]->(c)",
            parent_id,
            child_id,
        )
    }
    pub fn link_next(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<()> {
        self.execute_pair(
            &conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Next]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_prev(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<()> {
        self.execute_pair(
            &conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Prev]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_note_to_tag(&self, conn: &Connection, note_id: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            &conn,
            "MATCH (n:Note {id: $from}), (t:Tag {name: $to}) MERGE (n)-[:HasTag]->(t)",
            note_id,
            tag,
        )
    }
    pub fn link_alias_to_tag(&self, conn: &Connection, alias_name: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            &conn,
            "MATCH (a:TagAlias {name: $from}), (t:Tag {name: $to}) MERGE (a)-[:AliasOf]->(t)",
            alias_name,
            tag,
        )
    }
    pub fn link_person_to_note(
        &self,
        conn: &Connection,
        person: &str,
        note_id: &str,
        role: Option<&str>,
    ) -> Result<()> {
        let mut prepared = conn.prepare(
            "MATCH (p:Person {name: $from}), (n:Note {id: $to})
               MERGE (p)-[r:Authored]->(n)
               SET r.role = $role",
        )?;
        conn.execute(
            &mut prepared,
            vec![
                ("from", Value::String(person.to_string())),
                ("to", Value::String(note_id.to_string())),
                (
                    "role",
                    role.map_or(Value::Null(kuzu::LogicalType::String), |s| {
                        Value::String(s.to_string())
                    }),
                ),
            ],
        )?;
        Ok(())
    }
    pub fn link_reference(
        &self,
        conn: &Connection,
        from_id: &str,
        to_id: &str,
        sequence: i64,
    ) -> Result<()> {
        let mut prepared = conn.prepare(
            "MATCH (a:Note {id: $from}), (b:Note {id: $to})
               MERGE (a)-[r:References]->(b)
               SET r.sequence = $sequence",
        )?;
        conn.execute(
            &mut prepared,
            vec![
                ("from", Value::String(from_id.to_string())),
                ("to", Value::String(to_id.to_string())),
                ("sequence", Value::Int64(sequence)),
            ],
        )?;
        Ok(())
    }
    pub fn unlink_parent(&self, conn: &Connection, child_id: &str) -> Result<()> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:ChildOf]->() DELETE r",
            child_id,
        )
    }
    pub fn unlink_first_child(&self, conn: &Connection, parent_id: &str) -> Result<()> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:FirstChild]->() DELETE r",
            parent_id,
        )
    }
    pub fn unlink_next(&self, conn: &Connection, node_id: &str) -> Result<()> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:Next]->() DELETE r",
            node_id,
        )
    }
    pub fn unlink_prev(&self, conn: &Connection, node_id: &str) -> Result<()> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:Prev]->() DELETE r",
            node_id,
        )
    }
    pub fn unlink_note_to_tag(&self, conn: &Connection, note_id: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (:Note {id: $from})-[r:HasTag]->(:Tag {name: $to}) DELETE r",
            note_id,
            tag,
        )
    }
    pub fn unlink_alias_to_tag(&self, conn: &Connection, alias: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (:TagAlias {name: $from})-[r:AliasOf]->(:Tag {name: $to}) DELETE r",
            alias,
            tag,
        )
    }
    pub fn unlink_person_to_note(
        &self,
        conn: &Connection,
        person: &str,
        note_id: &str,
    ) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (:Person {name: $from})-[r:Authored]->(:Note {id: $to}) DELETE r",
            person,
            note_id,
        )
    }
    pub fn unlink_reference(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (:Note {id: $from})-[r:References]->(:Note {id: $to}) DELETE r",
            from_id,
            to_id,
        )
    }
    pub fn get_first_child_id(&self, conn: &Connection, parent_id: &str) -> Result<Option<String>> {
        let mut prepared =
            conn.prepare("MATCH (p:Note {id: $id})-[:FirstChild]->(c:Note) RETURN c.id")?;
        let mut result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(parent_id.to_string()))],
        )?;
        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_parent_id(&self, conn: &Connection, child_id: &str) -> Result<Option<String>> {
        let mut prepared =
            conn.prepare("MATCH (c:Note {id: $id})-[:ChildOf]->(p:Note) RETURN p.id")?;
        let mut result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(child_id.to_string()))],
        )?;
        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_next_id(&self, conn: &Connection, node_id: &str) -> Result<Option<String>> {
        let mut prepared =
            conn.prepare("MATCH (a:Note {id: $id})-[:Next]->(b:Note) RETURN b.id")?;
        let mut result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(node_id.to_string()))],
        )?;
        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_prev_id(&self, conn: &Connection, node_id: &str) -> Result<Option<String>> {
        let mut prepared =
            conn.prepare("MATCH (a:Note {id: $id})-[:Prev]->(b:Note) RETURN b.id")?;
        let mut result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(node_id.to_string()))],
        )?;
        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_tags_for_note(&self, conn: &Connection, note_id: &str) -> Result<Vec<String>> {
        let mut prepared =
            conn.prepare("MATCH (:Note {id: $id})-[:HasTag]->(t:Tag) RETURN t.name")?;
        let result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(note_id.to_string()))],
        )?;

        let mut tags = Vec::new();
        for row in result.into_iter() {
            if let Some(tag_name) = super::utils::extract_string(&row[0]) {
                tags.push(tag_name);
            }
        }
        Ok(tags)
    }
    pub fn get_authors_for_note(&self, conn: &Connection, note_id: &str) -> Result<Vec<Author>> {
        // ✨ 수정: coalesce 함수를 사용하여 role이 없는 경우에도 항상 NULL 값을 반환하도록 보장합니다.
        let mut prepared = conn.prepare("MATCH (p:Person)-[r:Authored]->(:Note {id: $id}) RETURN p.name, coalesce(r.role, NULL)")?;
        let result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(note_id.to_string()))],
        )?;
        let mut authors = Vec::new();
        for row in result.into_iter() {
            let name = super::utils::extract_string(&row[0])
                .ok_or(Error::Integrity("author name missing".into()))?;
            let role = super::utils::extract_string(&row[1]); // 이제 row[1]은 항상 안전합니다.
            authors.push(Author { name, role });
        }
        Ok(authors)
    }

    pub fn get_references_for_note(&self, conn: &Connection, note_id: &str) -> Result<Vec<String>> {
        let mut prepared = conn.prepare(
            "MATCH (:Note {id: $id})-[r:References]->(b:Note) RETURN b.id ORDER BY r.sequence",
        )?;
        let result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(note_id.to_string()))],
        )?;

        let mut refs = Vec::new();
        for row in result.into_iter() {
            if let Some(ref_id) = super::utils::extract_string(&row[0]) {
                refs.push(ref_id);
            }
        }
        Ok(refs)
    }

    pub fn get_sequenced_references_for_note(
        &self,
        conn: &Connection,
        note_id: &str,
    ) -> Result<Vec<crate::kuzudb::domain::models::SequencedReference>> {
        let mut prepared = conn.prepare(
            "MATCH (:Note {id: $id})-[r:References]->(b:Note) RETURN b.id, r.sequence ORDER BY r.sequence",
        )?;
        let result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(note_id.to_string()))],
        )?;

        let mut refs = Vec::new();
        for row in result.into_iter() {
            let ref_id = super::utils::extract_string(&row[0])
                .ok_or(Error::Integrity("ref id missing".into()))?;
            let sequence = match &row[1] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("ref sequence is not i64".into())),
            };
            refs.push(crate::kuzudb::domain::models::SequencedReference {
                note_id: ref_id,
                sequence,
            });
        }
        Ok(refs)
    }
}

```

```rs repository/utils.rs

use chrono::{DateTime, Utc};
use kuzu::{LogicalType, Value};
use time::OffsetDateTime;

pub fn option_string_to_value(opt_str: &Option<String>) -> Value {
    match opt_str {
        Some(s) => Value::String(s.clone()),
        None => Value::Null(LogicalType::String),
    }
}

pub fn chrono_to_odt(dt: &DateTime<Utc>) -> OffsetDateTime {
    OffsetDateTime::from_unix_timestamp_nanos(dt.timestamp_nanos_opt().unwrap().into()).unwrap()
}

pub fn extract_string(v: &kuzu::Value) -> Option<String> {
    match v {
        kuzu::Value::String(s) => Some(s.clone()),
        kuzu::Value::Null(_) => None,
        _ => None,
    }
}
pub fn extract_timestamp(v: &kuzu::Value) -> Option<chrono::DateTime<chrono::Utc>> {
    match v {
        kuzu::Value::Timestamp(dt) => {
            let s = dt.to_string();
            // "+00:00:00"을 "+00:00"으로 잘라서 정상 파싱
            let s_fixed = if s.ends_with(":00") {
                let len = s.len();
                s[..len - 3].to_string()
            } else {
                s.clone()
            };
            let fmt = "%Y-%m-%d %H:%M:%S%.f %z";
            match chrono::DateTime::parse_from_str(&s_fixed, fmt) {
                Ok(dt) => Some(dt.with_timezone(&chrono::Utc)),
                Err(e) => {
                    eprintln!("PARSE FAIL : {}", e);
                    None
                }
            }
        }
        kuzu::Value::String(s) => chrono::DateTime::parse_from_rfc3339(s)
            .ok()
            .map(|dt| dt.with_timezone(&chrono::Utc)),
        v => {
            eprintln!("WARN: 예기치 않은 timestamp 타입: {:?}", v);
            None
        }
    }
}

```

```rs service/mod.rs

pub mod note;

use crate::kuzudb::repository::KuzuDB;

pub struct NoteService<'a> {
    kuzudb: &'a KuzuDB,
}

impl<'a> NoteService<'a> {
    pub fn new(kuzudb: &'a KuzuDB) -> Self {
        Self { kuzudb }
    }
}

```

```rs service/note.rs

use super::NoteService;
use crate::kuzudb::{
    domain::models::{
        Author, Note, NoteAggregate, NoteCreateType, NoteUpdateType, Person, SequencedReference,
        Tag,
    },
    error::{Error, Result},
};
use chrono::Utc;
use kuzu::Connection;
use std::collections::HashMap;
use uuid::Uuid;

impl<'a> NoteService<'a> {
    pub fn get_all_notes(&self) -> Result<Vec<NoteAggregate>> {
        let conn = Connection::new(&self.kuzudb.instance)?;

        let (notes, child_of, first_child, next, prev, has_tag, references, authored) =
            self.kuzudb.nodes().get_all_notes_and_relations(&conn)?;

        let mut aggregates: HashMap<String, NoteAggregate> = notes
            .into_iter()
            .map(|note| (note.id.clone(), note.into()))
            .collect();

        for (child_id, parent_id) in child_of {
            if let Some(agg) = aggregates.get_mut(&child_id) {
                agg.parent = Some(parent_id);
            }
        }
        for (parent_id, child_id) in first_child {
            if let Some(agg) = aggregates.get_mut(&parent_id) {
                agg.first_child = Some(child_id);
            }
        }
        for (from_id, to_id) in next {
            if let Some(agg) = aggregates.get_mut(&from_id) {
                agg.next = Some(to_id);
            }
        }
        for (from_id, to_id) in prev {
            if let Some(agg) = aggregates.get_mut(&from_id) {
                agg.prev = Some(to_id);
            }
        }
        for (note_id, tag_name) in has_tag {
            if let Some(agg) = aggregates.get_mut(&note_id) {
                agg.tags.push(tag_name);
            }
        }
        for (from_id, to_id, sequence) in references {
            if let Some(agg) = aggregates.get_mut(&from_id) {
                agg.references.push(SequencedReference {
                    note_id: to_id,
                    sequence,
                });
            }
        }
        for (person_name, role, note_id) in authored {
            if let Some(agg) = aggregates.get_mut(&note_id) {
                agg.authors.push(Author {
                    name: person_name,
                    role,
                });
            }
        }

        // 4. 모든 NoteAggregate를 순회하며 참조(references) 목록을 순서(sequence)대로 정렬합니다.
        for agg in aggregates.values_mut() {
            agg.references.sort_by_key(|r| r.sequence);
        }

        // 5. HashMap의 모든 값을 Vec으로 변환하여 최종 반환합니다.
        Ok(aggregates.values().cloned().collect())
    }
    pub fn create_new_note(&self, note: NoteCreateType) -> Result<String> {
        let conn = Connection::new(&self.kuzudb.instance)?;
        conn.query("BEGIN TRANSACTION;")
            .map_err(|e| Error::Transaction(format!("트랜젝션 시작 실패: {}", e)))?;

        let creation_result = (|| {
            let new_note_id = Uuid::new_v4().to_string();
            let now = Utc::now();

            let parent_id = match &note {
                NoteCreateType::Main(c) => c.parent.clone(),
                NoteCreateType::Biblio(c) => c.parent.clone(),
                NoteCreateType::Quote(c) => c.parent.clone(),
                NoteCreateType::Hr(c) => c.parent.clone(),
                NoteCreateType::Index(c) => c.parent.clone(),
            };

            let nodes_api = self.kuzudb.nodes();
            let relations_api = self.kuzudb.relations();

            // ✨ 추가: 부모 유효성 검증 로직
            let parent_note = nodes_api
                .get_note_by_id(&conn, &parent_id)?
                .ok_or_else(|| Error::NoteNotFound(parent_id.clone()))?;

            let is_valid_parent = match &note {
                NoteCreateType::Main(_) => {
                    parent_note.id == "MAIN_BOX" || parent_note.note_type == "MAIN"
                }
                NoteCreateType::Index(_) => {
                    parent_note.id == "INDEX_BOX" || parent_note.note_type == "INDEX"
                }
                NoteCreateType::Biblio(_) => parent_note.id == "REFERENCE_BOX",
                NoteCreateType::Quote(_) => {
                    parent_note.id == "REFERENCE_BOX"
                        || parent_note.note_type == "BIBLIO"
                        || parent_note.note_type == "HR"
                }
                NoteCreateType::Hr(_) => {
                    parent_note.id == "REFERENCE_BOX" || parent_note.note_type == "BIBLIO"
                }
            };

            if !is_valid_parent {
                return Err(Error::Integrity(format!(
                    "Cannot create this note type under a parent of type '{}' (id: {})",
                    parent_note.note_type, parent_note.id
                )));
            }

            // ✨ authors 필드를 추가로 반환받도록 수정
            let (prev_id, references, tags, authors, mut new_note) = match note {
                NoteCreateType::Main(card) => (
                    card.prev,
                    card.reference,
                    card.tags,
                    vec![], // MainCard에는 저자가 없음
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        content: card.content,
                        note_type: "MAIN".to_string(),
                        ..Default::default()
                    },
                ),
                NoteCreateType::Biblio(card) => (
                    card.prev,
                    vec![],
                    vec![],
                    card.authors, // BiblioCard의 저자 목록
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        note_type: "BIBLIO".to_string(),
                        // 🗑️ author 필드 제거
                        published_at: Some(card.published_at),
                        sub_type: Some(card.sub_type),
                        cover_url: card.cover_url,
                        ..Default::default()
                    },
                ),
                NoteCreateType::Quote(card) => (
                    card.prev,
                    vec![],
                    card.tags,
                    card.authors, // QuoteCard의 저자 목록
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        content: card.content,
                        note_type: "QUOTE".to_string(),
                        ..Default::default()
                    },
                ),
                NoteCreateType::Hr(card) => (
                    card.prev,
                    vec![],
                    vec![],
                    vec![], // HrCard에는 저자가 없음
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        note_type: "HR".to_string(),
                        sub_type: Some(card.sub_type),
                        ..Default::default()
                    },
                ),
                NoteCreateType::Index(card) => (
                    card.prev,
                    card.reference,
                    vec![],
                    vec![], // IndexCard에는 저자가 없음
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        content: card.content,
                        note_type: "INDEX".to_string(),
                        ..Default::default()
                    },
                ),
            };

            new_note.created_at = now;
            new_note.updated_at = now;

            let nodes_api = self.kuzudb.nodes();
            let relations_api = self.kuzudb.relations();

            if !nodes_api.is_exist(&conn, &parent_id)? {
                return Err(Error::NoteNotFound(parent_id));
            }

            nodes_api.create_note(&conn, &new_note)?;
            relations_api.link_parent(&conn, &new_note_id, &parent_id)?;

            if let Some(prev_id) = prev_id {
                if let Some(old_next_id) = relations_api.get_next_id(&conn, &prev_id)? {
                    relations_api.unlink_next(&conn, &prev_id)?;
                    relations_api.unlink_prev(&conn, &old_next_id)?;
                    relations_api.link_next(&conn, &prev_id, &new_note_id)?;
                    relations_api.link_prev(&conn, &new_note_id, &prev_id)?;
                    relations_api.link_next(&conn, &new_note_id, &old_next_id)?;
                    relations_api.link_prev(&conn, &old_next_id, &new_note_id)?;
                } else {
                    relations_api.link_next(&conn, &prev_id, &new_note_id)?;
                    relations_api.link_prev(&conn, &new_note_id, &prev_id)?;
                }
            } else {
                if let Some(old_first_id) = relations_api.get_first_child_id(&conn, &parent_id)? {
                    relations_api.unlink_first_child(&conn, &parent_id)?;
                    relations_api.unlink_prev(&conn, &old_first_id)?;
                    relations_api.link_first_child(&conn, &parent_id, &new_note_id)?;
                    relations_api.link_next(&conn, &new_note_id, &old_first_id)?;
                    relations_api.link_prev(&conn, &old_first_id, &new_note_id)?;
                } else {
                    relations_api.link_first_child(&conn, &parent_id, &new_note_id)?;
                }
            }

            if !references.is_empty() {
                for (index, ref_id) in references.iter().enumerate() {
                    relations_api.link_reference(&conn, &new_note_id, ref_id, index as i64)?;
                }
            }

            if !tags.is_empty() {
                for tag_name in &tags {
                    nodes_api.create_tag(
                        &conn,
                        &Tag {
                            name: tag_name.clone(),
                        },
                    )?;
                    relations_api.link_note_to_tag(&conn, &new_note_id, tag_name)?;
                }
            }

            if !authors.is_empty() {
                for author_payload in &authors {
                    nodes_api.create_person(
                        &conn,
                        &Person {
                            name: author_payload.name.clone(),
                        },
                    )?;
                    relations_api.link_person_to_note(
                        &conn,
                        &author_payload.name,
                        &new_note_id,
                        author_payload.role.as_deref(), // Option<String> -> Option<&str>
                    )?;
                }
            }

            Ok(new_note_id)
        })();

        match creation_result {
            Ok(new_id) => {
                conn.query("COMMIT;")
                    .map_err(|e| Error::Transaction(format!("트랜잭션 커밋 실패: {}", e)))?;
                Ok(new_id)
            }
            Err(e) => {
                conn.query("ROLLBACK;").map_err(|e_rb| {
                    Error::Transaction(format!("롤백 실패: {}. 원본 오류: {}", e_rb, e))
                })?;
                Err(e)
            }
        }
    }
    pub fn update_note(&self, id: &str, payload: NoteUpdateType) -> Result<()> {
        let conn = Connection::new(&self.kuzudb.instance)?;

        conn.query("BEGIN TRANSACTION;")
            .map_err(|e| Error::Transaction(format!("트랜잭션 시작 실패: {}", e)))?;

        let update_result = (|| {
            let nodes_api = self.kuzudb.nodes();
            let relations_api = self.kuzudb.relations();

            // 1. 기존 노트를 불러옵니다. 없으면 NoteNotFound 에러를 반환합니다.
            let mut note = nodes_api
                .get_note_by_id(&conn, id)?
                .ok_or_else(|| Error::NoteNotFound(id.to_string()))?;

            // 2. 페이로드에 담겨온 변경사항만 골라서 기존 노트에 덮어씁니다.
            match payload {
                NoteUpdateType::Main(data) => {
                    if let Some(title) = data.title {
                        note.title = title;
                    }
                    if let Some(content) = data.content {
                        note.content = content;
                    }
                    if let Some(new_tags) = data.tags {
                        // 1. 기존 태그 목록을 가져와서 모든 관계를 끊습니다.
                        let old_tags = relations_api.get_tags_for_note(&conn, id)?;
                        for old_tag in old_tags {
                            relations_api.unlink_note_to_tag(&conn, id, &old_tag)?;
                        }

                        // 2. 새로운 태그 목록으로 관계를 다시 맺어줍니다.
                        for new_tag in new_tags {
                            nodes_api.create_tag(
                                &conn,
                                &Tag {
                                    name: new_tag.clone(),
                                },
                            )?;
                            relations_api.link_note_to_tag(&conn, id, &new_tag)?;
                        }
                    }
                    if let Some(new_references) = data.reference {
                        // 1. 기존 참조 목록을 가져와서 모든 관계를 끊습니다.
                        let old_refs = relations_api.get_references_for_note(&conn, id)?;
                        for old_ref_id in old_refs {
                            relations_api.unlink_reference(&conn, id, &old_ref_id)?;
                        }

                        // 2. 새로운 참조 목록으로 순서에 맞게 관계를 다시 맺어줍니다.
                        for (i, new_ref_id) in new_references.iter().enumerate() {
                            relations_api.link_reference(&conn, id, new_ref_id, i as i64)?;
                        }
                    }
                }
                NoteUpdateType::Biblio(data) => {
                    if let Some(title) = data.title {
                        note.title = title;
                    }
                    if let Some(new_authors) = data.authors {
                        let old_authors = relations_api.get_authors_for_note(&conn, id)?;
                        for old_author in old_authors {
                            relations_api.unlink_person_to_note(&conn, &old_author.name, id)?;
                        }
                        for new_author in new_authors {
                            nodes_api.create_person(
                                &conn,
                                &Person {
                                    name: new_author.name.clone(),
                                },
                            )?;
                            relations_api.link_person_to_note(
                                &conn,
                                &new_author.name,
                                id,
                                new_author.role.as_deref(),
                            )?;
                        }
                    }
                    if let Some(published_at) = data.published_at {
                        note.published_at = Some(published_at);
                    }
                    if let Some(sub_type) = data.sub_type {
                        note.sub_type = Some(sub_type);
                    }
                    if let Some(cover_url) = data.cover_url {
                        note.cover_url = cover_url;
                    }
                }
                NoteUpdateType::Quote(data) => {
                    if let Some(title) = data.title {
                        note.title = title;
                    }
                    if let Some(content) = data.content {
                        note.content = content;
                    }
                    if let Some(new_authors) = data.authors {
                        let old_authors = relations_api.get_authors_for_note(&conn, id)?;
                        for old_author in old_authors {
                            relations_api.unlink_person_to_note(&conn, &old_author.name, id)?;
                        }
                        for new_author in new_authors {
                            nodes_api.create_person(
                                &conn,
                                &Person {
                                    name: new_author.name.clone(),
                                },
                            )?;
                            relations_api.link_person_to_note(
                                &conn,
                                &new_author.name,
                                id,
                                new_author.role.as_deref(),
                            )?;
                        }
                    }
                    if let Some(new_tags) = data.tags {
                        let old_tags = relations_api.get_tags_for_note(&conn, id)?;
                        for old_tag in old_tags {
                            relations_api.unlink_note_to_tag(&conn, id, &old_tag)?;
                        }

                        for new_tag in new_tags {
                            nodes_api.create_tag(
                                &conn,
                                &Tag {
                                    name: new_tag.clone(),
                                },
                            )?;
                            relations_api.link_note_to_tag(&conn, id, &new_tag)?;
                        }
                    }
                }
                NoteUpdateType::Index(data) => {
                    if let Some(title) = data.title {
                        note.title = title;
                    }
                    if let Some(content) = data.content {
                        note.content = content;
                    }
                    if let Some(new_references) = data.reference {
                        let old_refs = relations_api.get_references_for_note(&conn, id)?;
                        for old_ref_id in old_refs {
                            relations_api.unlink_reference(&conn, id, &old_ref_id)?;
                        }

                        for (i, new_ref_id) in new_references.iter().enumerate() {
                            relations_api.link_reference(&conn, id, new_ref_id, i as i64)?;
                        }
                    }
                }
            }

            // 3. updated_at 타임스탬프를 갱신하고 DB에 저장합니다.
            note.updated_at = Utc::now();
            nodes_api.update_note(&conn, &note)?;

            Ok(())
        })();

        match update_result {
            Ok(_) => {
                conn.query("COMMIT;")
                    .map_err(|e| Error::Transaction(format!("트랜잭션 커밋 실패: {}", e)))?;
                Ok(())
            }
            Err(e) => {
                conn.query("ROLLBACK;").map_err(|e_rb| {
                    Error::Transaction(format!("롤백 실패: {}. 원본 오류: {}", e_rb, e))
                })?;
                Err(e)
            }
        }
    }
    pub fn get_note_aggregate_by_id(&self, id: &str) -> Result<NoteAggregate> {
        let conn = Connection::new(&self.kuzudb.instance)?;
        let nodes_api = self.kuzudb.nodes();
        let relations_api = self.kuzudb.relations();

        // 1. 기본 Note 정보를 가져옵니다. 없으면 에러를 반환합니다.
        let note = nodes_api
            .get_note_by_id(&conn, id)?
            .ok_or_else(|| Error::NoteNotFound(id.to_string()))?;

        // 2. Note를 NoteAggregate로 변환하고, 관계 정보를 채워넣습니다.
        let mut agg: NoteAggregate = note.into();
        agg.parent = relations_api.get_parent_id(&conn, id)?;
        agg.first_child = relations_api.get_first_child_id(&conn, id)?;
        agg.prev = relations_api.get_prev_id(&conn, id)?;
        agg.next = relations_api.get_next_id(&conn, id)?;
        agg.tags = relations_api.get_tags_for_note(&conn, id)?;
        agg.references = relations_api.get_sequenced_references_for_note(&conn, id)?;
        // ✨ 추가: 저자 정보를 가져와서 채웁니다.
        agg.authors = relations_api.get_authors_for_note(&conn, id)?;

        // 3. 완성된 NoteAggregate를 반환합니다.
        Ok(agg)
    }
    pub fn remove_note(&self, id: &str) -> Result<()> {
        let conn = Connection::new(&self.kuzudb.instance)?;

        conn.query("BEGIN TRANSACTION;")
            .map_err(|e| Error::Transaction(format!("트랜잭션 시작 실패: {}", e)))?;

        let removal_result = (|| {
            let nodes_api = self.kuzudb.nodes();
            let relations_api = self.kuzudb.relations();

            // 1. (엄격한 삭제) 삭제할 노트가 존재하는지 먼저 확인합니다.
            if !nodes_api.is_exist(&conn, id)? {
                return Err(Error::NoteNotFound(id.to_string()));
            }

            // 2. 삭제 전에, 재연결에 필요한 관계 정보를 미리 가져옵니다.
            let parent_id = relations_api.get_parent_id(&conn, id)?;
            let prev_id = relations_api.get_prev_id(&conn, id)?;
            let next_id = relations_api.get_next_id(&conn, id)?;

            // 3. 형제 관계 재연결 (A -> B -> C 에서 B를 삭제하면 A -> C로 연결)
            if let (Some(prev), Some(next)) = (&prev_id, &next_id) {
                relations_api.link_next(&conn, prev, next)?;
                relations_api.link_prev(&conn, next, prev)?;
            }

            // 4. 부모-자식 관계 업데이트 (삭제 대상이 첫째 자식이었을 경우)
            if let Some(parent) = &parent_id {
                // 부모의 첫째 자식이 삭제 대상이었는지 확인
                if relations_api.get_first_child_id(&conn, parent)?.as_deref() == Some(id) {
                    // 기존 FirstChild 관계를 끊고
                    relations_api.unlink_first_child(&conn, parent)?;
                    // 만약 다음 형제가 있다면, 그 노드를 새로운 첫째 자식으로 연결
                    if let Some(next) = &next_id {
                        relations_api.link_first_child(&conn, parent, next)?;
                    }
                }
            }

            // 5. 모든 관계 재설정이 끝난 후, 실제 노드를 삭제합니다.
            //    (DETACH DELETE 쿼리가 node에 연결된 Prev, Next, ChildOf 관계를 모두 지웁니다)
            nodes_api.remove_note(&conn, id)?;

            Ok(())
        })();

        match removal_result {
            Ok(_) => {
                conn.query("COMMIT;")
                    .map_err(|e| Error::Transaction(format!("트랜잭션 커밋 실패: {}", e)))?;
                Ok(())
            }
            Err(e) => {
                conn.query("ROLLBACK;").map_err(|e_rb| {
                    Error::Transaction(format!("롤백 실패: {}. 원본 오류: {}", e_rb, e))
                })?;
                Err(e)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::kuzudb::domain::payloads::{create, update, AuthorPayload};
    use crate::kuzudb::{domain::schema, repository::KuzuDB};

    fn setup_db() -> KuzuDB {
        let db = KuzuDB::new("").expect("In-memory DB creation failed");
        schema::initialize(&db).expect("Schema initialization failed");
        db
    }

    #[test]
    fn test_create_first_note_in_box() {
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let main_card_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "첫 번째 생각".to_string(),
            content: "이것은 나의 첫 번째 생각이다.".to_string(),
            reference: vec![],
            tags: vec!["테스트".to_string(), "첫글".to_string()],
        });

        // 2. 실행 (Act): 테스트할 함수를 호출합니다.
        let new_note_id = note_service
            .create_new_note(main_card_data)
            .expect("Note creation should succeed");

        // 3. 검증 (Assert): 실행 결과가 우리가 의도한 대로인지 확인합니다.
        let all_notes = note_service
            .get_all_notes()
            .expect("Getting all notes should succeed");

        // 새로 생성된 노트를 찾습니다.
        let new_note = all_notes
            .iter()
            .find(|n| n.note.id == new_note_id)
            .expect("Newly created note must be found");

        // 부모인 MAIN_BOX 노드를 찾습니다.
        let parent_note = all_notes
            .iter()
            .find(|n| n.note.id == "MAIN_BOX")
            .expect("Parent 'MAIN_BOX' must be found");

        // --- 검증 시작 ---
        assert_eq!(
            all_notes.len(),
            4,
            "전체 노트 개수는 기본 3개 + 새 노트 1개여야 합니다."
        );

        // 새 노트의 속성 검증
        assert_eq!(new_note.note.title, "첫 번째 생각");
        let mut expected_tags = vec!["테스트".to_string(), "첫글".to_string()];
        let mut actual_tags = new_note.tags.clone();
        expected_tags.sort();
        actual_tags.sort();
        assert_eq!(
            actual_tags, expected_tags,
            "태그 내용이 일치해야 합니다 (순서 무관)."
        );

        // 새 노트의 관계 검증
        assert_eq!(
            new_note.parent,
            Some("MAIN_BOX".to_string()),
            "새 노트의 부모는 MAIN_BOX여야 합니다."
        );
        assert!(
            new_note.prev.is_none(),
            "첫 노트이므로 이전(prev) 노트는 없어야 합니다."
        );
        assert!(
            new_note.next.is_none(),
            "첫 노트이므로 다음(next) 노트는 없어야 합니다."
        );

        // 부모 노트의 관계 검증
        assert_eq!(
            parent_note.first_child,
            Some(new_note_id),
            "MAIN_BOX의 첫 자식은 새로 생성된 노트여야 합니다."
        );
    }

    #[test]
    fn test_create_note_between_two_notes() {
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let first_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "첫 번째 노트".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let first_note_id = note_service.create_new_note(first_note_data).unwrap();

        let third_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(first_note_id.clone()),
            title: "세 번째 노트".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let third_note_id = note_service.create_new_note(third_note_data).unwrap();

        let second_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(first_note_id.clone()),
            title: "두 번째 노트".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });

        let second_note_id = note_service.create_new_note(second_note_data).unwrap();

        let all_notes = note_service.get_all_notes().unwrap();

        let first_note = all_notes
            .iter()
            .find(|n| n.note.id == first_note_id)
            .unwrap();
        let second_note = all_notes
            .iter()
            .find(|n| n.note.id == second_note_id)
            .unwrap();
        let third_note = all_notes
            .iter()
            .find(|n| n.note.id == third_note_id)
            .unwrap();

        // --- 검증 시작 ---
        // 최종 노트 개수는 기본 3개 + 추가 3개 = 6개
        assert_eq!(all_notes.len(), 6);

        // 첫 번째 노트는 두 번째 노트를 'next'로 가져야 함
        assert_eq!(first_note.next.as_ref(), Some(&second_note_id));

        // 두 번째 노트는 첫 번째 노드를 'prev'로, 세 번째 노드를 'next'로 가져야 함
        assert_eq!(second_note.prev.as_ref(), Some(&first_note_id));
        assert_eq!(second_note.next.as_ref(), Some(&third_note_id));

        // 세 번째 노트는 두 번째 노드를 'prev'로 가져야 함
        assert_eq!(third_note.prev.as_ref(), Some(&second_note_id));
    }

    #[test]
    fn test_create_quote_note_under_biblio_note() {
        // 1. 준비 (Arrange): 서지(Biblio) 노트를 먼저 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // ✨ 수정: author -> authors 벡터로 변경
        let biblio_card_data = NoteCreateType::Biblio(create::BiblioCard {
            parent: "REFERENCE_BOX".to_string(), // 참조 박스 아래에 생성
            prev: None,
            title: "Rust는 어떻게 작동하는가".to_string(),
            authors: vec![
                AuthorPayload {
                    name: "홍길동".to_string(),
                    role: Some("주 저자".to_string()),
                },
                AuthorPayload {
                    name: "임꺽정".to_string(),
                    role: Some("공동 저자".to_string()),
                },
            ],
            published_at: "2025-09-03".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });

        let biblio_note_id = note_service.create_new_note(biblio_card_data).unwrap();

        // 이제 방금 만든 서지 노트 아래에 인용(Quote) 노트를 추가할 준비를 합니다.
        let quote_card_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(), // 부모를 서지 노트 ID로 지정
            prev: None,                     // 서지 노트의 첫 번째 자식이므로 prev는 없음
            title: "메모리 안전성".to_string(),
            content: "Rust는 소유권 시스템을 통해 메모리 안전성을 보장합니다.".to_string(),
            authors: vec![AuthorPayload {
                name: "전우치".to_string(),
                role: None,
            }],
            tags: vec!["rust".to_string(), "memory".to_string()],
        });

        // 2. 실행 (Act): 인용 노트를 생성합니다.
        let quote_note_id = note_service.create_new_note(quote_card_data).unwrap();

        let biblio_note = note_service
            .get_note_aggregate_by_id(&biblio_note_id)
            .unwrap();
        let quote_note = note_service
            .get_note_aggregate_by_id(&quote_note_id)
            .unwrap();

        let mut expected_biblio_authors = vec![
            Author {
                name: "홍길동".to_string(),
                role: Some("주 저자".to_string()),
            },
            Author {
                name: "임꺽정".to_string(),
                role: Some("공동 저자".to_string()),
            },
        ];
        expected_biblio_authors.sort_by(|a, b| a.name.cmp(&b.name));
        let mut actual_biblio_authors = biblio_note.authors;
        actual_biblio_authors.sort_by(|a, b| a.name.cmp(&b.name));

        // --- 검증 시작 ---
        assert_eq!(actual_biblio_authors, expected_biblio_authors);
        assert_eq!(
            quote_note.authors,
            vec![Author {
                name: "전우치".to_string(),
                role: None
            }]
        );
        assert_eq!(quote_note.parent.as_deref(), Some(biblio_note_id.as_str()));
        assert_eq!(
            biblio_note.first_child.as_deref(),
            Some(quote_note_id.as_str())
        );
    }

    #[test]
    fn test_create_main_note_with_sequenced_references() {
        // 1. 준비 (Arrange): 두 개의 인용 노트를 미리 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // ✨ 수정: author -> authors 벡터로 변경
        let biblio_card_data = NoteCreateType::Biblio(create::BiblioCard {
            parent: "REFERENCE_BOX".to_string(),
            prev: None,
            title: "Rust는 어떻게 작동하는가".to_string(),
            authors: vec![AuthorPayload {
                name: "홍길동".to_string(),
                role: Some("주 저자".to_string()),
            }],
            published_at: "2025-09-03".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });
        let biblio_note_id = note_service.create_new_note(biblio_card_data).unwrap();

        let quote_1_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(),
            prev: None,
            title: "메모리 안전성".to_string(),
            content: "Rust는 소유권 시스템을 통해 메모리 안전성을 보장합니다.".to_string(),
            authors: vec![],
            tags: vec![],
        });
        let quote_1_id = note_service.create_new_note(quote_1_data).unwrap();

        let quote_2_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(),
            prev: Some(quote_1_id.clone()),
            title: "제로 비용 추상화".to_string(),
            content: "고수준의 추상화를 사용해도 런타임 비용이 발생하지 않습니다.".to_string(),
            authors: vec![],
            tags: vec![],
        });
        let quote_2_id = note_service.create_new_note(quote_2_data).unwrap();

        // 이제 위 두 인용을 순서대로 참조하는 메인 노트를 준비합니다.
        let main_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "Rust에 대한 나의 생각".to_string(),
            content: "소유권 시스템은 혁신적이지만, 제로 비용 추상화가 더 인상 깊다.".to_string(),
            // 2번 먼저 넣음
            reference: vec![quote_2_id.clone(), quote_1_id.clone()],
            tags: vec!["rust".to_string(), "opinion".to_string()],
        });

        // 2. 실행 (Act): 메인 노트를 생성합니다.
        let main_note_id = note_service.create_new_note(main_note_data).unwrap();

        // 3. 검증 (Assert): 메인 노트의 참조 관계와 순서가 올바른지 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();
        let main_note = all_notes
            .iter()
            .find(|n| n.note.id == main_note_id)
            .unwrap();

        assert_eq!(all_notes.len(), 7); // 기본 3개 + 서지 1개 + 인용 2개 + 메인 1개

        // 참조 목록의 개수가 2개인지 확인
        assert_eq!(main_note.references.len(), 2);

        // 먼저넣은게 2번인지 확인
        assert_eq!(main_note.references[0].note_id, quote_2_id);
        assert_eq!(main_note.references[0].sequence, 0);

        assert_eq!(main_note.references[1].note_id, quote_1_id);
        assert_eq!(main_note.references[1].sequence, 1);
    }

    #[test]
    fn test_register_main_note_to_index_card() {
        // 1. 준비 (Arrange): 이전 테스트와 동일하게 메인 노트까지 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // ✨ 수정: author -> authors 벡터로 변경
        let biblio_card_data = NoteCreateType::Biblio(create::BiblioCard {
            parent: "REFERENCE_BOX".to_string(),
            prev: None,
            title: "Rust는 어떻게 작동하는가".to_string(),
            authors: vec![AuthorPayload {
                name: "홍길동".to_string(),
                role: None,
            }],
            published_at: "2025-09-03".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });
        let biblio_note_id = note_service.create_new_note(biblio_card_data).unwrap();

        let quote_1_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(),
            prev: None,
            title: "메모리 안전성".to_string(),
            content: "Rust는 소유권 시스템을 통해 메모리 안전성을 보장합니다.".to_string(),
            authors: vec![AuthorPayload {
                name: "임꺽정".to_string(),
                role: Some("설계자".to_string()),
            }],
            tags: vec![],
        });
        let quote_1_id = note_service.create_new_note(quote_1_data).unwrap();

        let quote_2_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(),
            prev: Some(quote_1_id.clone()),
            title: "제로 비용 추상화".to_string(),
            content: "고수준의 추상화를 사용해도 런타임 비용이 발생하지 않습니다.".to_string(),
            authors: vec![AuthorPayload {
                name: "임재범".to_string(),
                role: Some("가수".to_string()),
            }],
            tags: vec![],
        });
        let quote_2_id = note_service.create_new_note(quote_2_data).unwrap();

        let main_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "Rust에 대한 나의 생각".to_string(),
            content: "소유권 시스템은 혁신적이지만, 제로 비용 추상화가 더 인상 깊다.".to_string(),
            reference: vec![quote_1_id.clone(), quote_2_id.clone()],
            tags: vec!["rust".to_string(), "opinion".to_string()],
        });
        let main_note_id = note_service.create_new_note(main_note_data).unwrap();

        // 이제 위에서 만든 '메인 노트'를 참조하는 인덱스 카드를 준비합니다.
        let index_card_data = NoteCreateType::Index(create::IndexCard {
            parent: "INDEX_BOX".to_string(),
            prev: None,
            title: "Rust 관련 생각 정리".to_string(),
            content: "메모리 안전성과 제로 비용 추상화에 대한 생각을 정리한 노트".to_string(),
            reference: vec![main_note_id.clone()], // '메인 노트'의 ID를 참조로 추가
        });

        // 2. 실행 (Act): 인덱스 카드를 생성합니다.
        let index_card_id = note_service.create_new_note(index_card_data).unwrap();

        // 3. 검증 (Assert): 인덱스 카드의 참조 관계와 부모-자식 관계를 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();
        let index_card = all_notes
            .iter()
            .find(|n| n.note.id == index_card_id)
            .unwrap();
        let index_box = all_notes.iter().find(|n| n.note.id == "INDEX_BOX").unwrap();

        // --- 검증 시작 ---
        assert_eq!(all_notes.len(), 8); // 이전 7개 + 인덱스 카드 1개

        // 인덱스 카드의 참조가 '메인 노트'를 올바르게 가리키는지 확인
        assert_eq!(index_card.references.len(), 1);
        assert_eq!(index_card.references[0].note_id, main_note_id);
        assert_eq!(index_card.references[0].sequence, 0);

        // 인덱스 카드의 부모가 'INDEX_BOX'가 맞는지 확인
        assert_eq!(index_card.parent.as_ref(), Some(&"INDEX_BOX".to_string()));

        // 'INDEX_BOX'의 첫 자식이 이 인덱스 카드가 맞는지 확인
        assert_eq!(index_box.first_child.as_ref(), Some(&index_card_id));
    }

    #[test]
    fn test_create_note_with_non_existent_parent_fails() {
        // 1. 준비 (Arrange): 테스트 환경을 설정하고, 존재하지 않는 부모 ID를 만듭니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let fake_parent_id = Uuid::new_v4().to_string(); //絶対に存在しないID

        let note_data = NoteCreateType::Main(create::MainCard {
            parent: fake_parent_id, // 가짜 부모 ID 사용
            prev: None,
            title: "이 노트는 생성되면 안됨".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });

        // 2. 실행 (Act): 노트 생성을 시도하고, 결과를 받습니다. (unwrap()을 사용하지 않음)
        let result = note_service.create_new_note(note_data);

        // 3. 검증 (Assert): 실행 결과가 에러인지 확인합니다.
        assert!(
            result.is_err(),
            "존재하지 않는 부모로는 노트를 생성할 수 없어야 합니다."
        );

        // 더 나아가, 어떤 종류의 에러인지도 확인할 수 있습니다.
        if let Err(e) = result {
            assert!(
                matches!(e, Error::NoteNotFound(_)),
                "에러 타입은 NoteNotFound여야 합니다."
            );
        }
    }

    #[test]
    fn test_remove_note_relinks_siblings() {
        // 1. 준비 (Arrange): A -> B -> C 순서의 노드를 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // A 생성
        let note_a_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "A".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_a_id = note_service.create_new_note(note_a_data).unwrap();

        // B 생성 (A 뒤에)
        let note_b_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(note_a_id.clone()),
            title: "B".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_b_id = note_service.create_new_note(note_b_data).unwrap();

        // C 생성 (B 뒤에)
        let note_c_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(note_b_id.clone()),
            title: "C".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_c_id = note_service.create_new_note(note_c_data).unwrap();

        // 2. 실행 (Act): 중간 노드인 'B'를 삭제합니다.
        note_service
            .remove_note(&note_b_id)
            .expect("Note removal should succeed");

        // 3. 검증 (Assert): 관계가 A -> C로 재설정되었는지 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();

        // B가 정말 삭제되었는지 확인
        let note_b_exists = all_notes.iter().any(|n| n.note.id == note_b_id);
        assert!(!note_b_exists, "노트 B는 삭제되어야 합니다.");

        // 남은 A와 C 노드를 찾습니다.
        let note_a = all_notes.iter().find(|n| n.note.id == note_a_id).unwrap();
        let note_c = all_notes.iter().find(|n| n.note.id == note_c_id).unwrap();

        // --- 검증 시작 ---
        // 최종 노트 개수는 기본 3개 + A, C 2개 = 5개
        assert_eq!(all_notes.len(), 5);

        // A의 다음이 C인지 확인
        assert_eq!(
            note_a.next.as_ref(),
            Some(&note_c_id),
            "A의 다음은 C여야 합니다."
        );

        // C의 이전이 A인지 확인
        assert_eq!(
            note_c.prev.as_ref(),
            Some(&note_a_id),
            "C의 이전은 A여야 합니다."
        );
    }

    #[test]
    fn test_remove_first_child_note_updates_parent() {
        // 1. 준비 (Arrange): A -> B -> C 순서의 노드를 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let note_a_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "A".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_a_id = note_service.create_new_note(note_a_data).unwrap();

        let note_b_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(note_a_id.clone()),
            title: "B".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_b_id = note_service.create_new_note(note_b_data).unwrap();

        // 2. 실행 (Act): 첫 번째 자식인 'A'를 삭제합니다.
        note_service
            .remove_note(&note_a_id)
            .expect("Note removal should succeed");

        // 3. 검증 (Assert): 부모의 first_child가 'B'로 업데이트되었는지 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();

        let note_a_exists = all_notes.iter().any(|n| n.note.id == note_a_id);
        assert!(!note_a_exists, "노트 A는 삭제되어야 합니다.");

        let parent_box = all_notes.iter().find(|n| n.note.id == "MAIN_BOX").unwrap();
        let note_b = all_notes.iter().find(|n| n.note.id == note_b_id).unwrap();

        // --- 검증 시작 ---
        // 부모("MAIN_BOX")의 first_child가 이제 B여야 합니다.
        assert_eq!(
            parent_box.first_child.as_ref(),
            Some(&note_b_id),
            "부모의 first_child는 B로 업데이트되어야 합니다."
        );

        // B의 이전(prev) 노드는 이제 없어야 합니다.
        assert!(
            note_b.prev.is_none(),
            "B는 이제 첫 번째 자식이므로 prev가 없어야 합니다."
        );
    }

    #[test]
    fn test_insert_new_first_child_updates_links() {
        // 1. 준비 (Arrange): 기존의 첫 번째 자식('B')을 먼저 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let note_b_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "B".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_b_id = note_service.create_new_note(note_b_data).unwrap();

        // 이제 새로운 첫 번째 자식이 될 'A'를 준비합니다. prev: None으로 맨 앞에 삽입합니다.
        let note_a_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "A".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });

        // 2. 실행 (Act): 새로운 첫 자식 'A'를 생성합니다.
        let note_a_id = note_service.create_new_note(note_a_data).unwrap();

        // 3. 검증 (Assert): 부모의 first_child가 'A'로 바뀌고, A와 B가 잘 연결되었는지 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();

        let parent_box = all_notes.iter().find(|n| n.note.id == "MAIN_BOX").unwrap();
        let note_a = all_notes.iter().find(|n| n.note.id == note_a_id).unwrap();
        let note_b = all_notes.iter().find(|n| n.note.id == note_b_id).unwrap();

        // --- 검증 시작 ---
        // 부모("MAIN_BOX")의 first_child는 이제 A여야 합니다.
        assert_eq!(
            parent_box.first_child.as_ref(),
            Some(&note_a_id),
            "부모의 first_child는 A로 업데이트되어야 합니다."
        );

        // A의 다음은 B여야 합니다.
        assert_eq!(note_a.next.as_ref(), Some(&note_b_id));
        // A는 첫 자식이므로 이전은 없어야 합니다.
        assert!(note_a.prev.is_none());

        // B의 이전은 A여야 합니다.
        assert_eq!(note_b.prev.as_ref(), Some(&note_a_id));
    }

    #[test]
    fn test_remove_last_child_note() {
        // 준비: A -> B -> C 순서의 노드를 생성
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let note_a_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "A".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_a_id = note_service.create_new_note(note_a_data).unwrap();
        let note_b_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(note_a_id.clone()),
            title: "B".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_b_id = note_service.create_new_note(note_b_data).unwrap();

        // 실행: 마지막 자식인 'B'를 삭제
        note_service.remove_note(&note_b_id).unwrap();

        // 검증: A의 next가 None이 되었는지 확인
        let all_notes = note_service.get_all_notes().unwrap();
        let note_a = all_notes.iter().find(|n| n.note.id == note_a_id).unwrap();

        assert!(
            note_a.next.is_none(),
            "A는 이제 마지막 노드이므로 next가 없어야 합니다."
        );
        assert_eq!(all_notes.len(), 4); // 기본 3개 + A 1개
    }

    #[test]
    fn test_remove_only_child_note() {
        // 준비: 자식 노드를 하나만 생성
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let note_a_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "A".to_string(),
            content: "".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_a_id = note_service.create_new_note(note_a_data).unwrap();

        // 실행: 유일한 자식인 'A'를 삭제
        note_service.remove_note(&note_a_id).unwrap();

        // 검증: 부모의 firstChild가 None이 되었는지 확인
        let all_notes = note_service.get_all_notes().unwrap();
        let parent_box = all_notes.iter().find(|n| n.note.id == "MAIN_BOX").unwrap();

        assert!(
            parent_box.first_child.is_none(),
            "부모는 더 이상 자식이 없어야 합니다."
        );
        assert_eq!(all_notes.len(), 3); // 기본 박스 노트 3개만 남아야 함
    }

    #[test]
    fn test_remove_non_existent_note_fails() {
        // 준비: 존재하지 않는 ID 생성
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let fake_note_id = Uuid::new_v4().to_string();

        // 실행: 존재하지 않는 노드 삭제 시도
        let result = note_service.remove_note(&fake_note_id);

        // 검증: NoteNotFound 에러가 발생하는지 확인
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), Error::NoteNotFound(_)));
    }

    #[test]
    fn test_update_note_title_and_content() {
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let original_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "원본 제목".to_string(),
            content: "원본 내용".to_string(),
            reference: vec![],
            tags: vec![],
        });
        let note_id = note_service.create_new_note(original_note_data).unwrap();

        let update_payload = NoteUpdateType::Main(update::MainCard {
            title: Some("수정된 제목".to_string()),
            content: Some("수정된 내용".to_string()),
            ..Default::default()
        });

        note_service
            .update_note(&note_id, update_payload)
            .expect("Note update should succeed");

        // ✨ 수정: 저수준 API 대신 서비스 API를 통해 결과를 검증합니다.
        let updated_note_agg = note_service.get_note_aggregate_by_id(&note_id).unwrap();

        assert_eq!(updated_note_agg.note.title, "수정된 제목");
        assert_eq!(updated_note_agg.note.content, "수정된 내용");
        assert!(
            updated_note_agg.note.updated_at > updated_note_agg.note.created_at,
            "updated_at은 created_at보다 나중 시간이어야 합니다."
        );
    }

    #[test]
    fn test_update_note_authors() {
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let original_note_data = NoteCreateType::Biblio(create::BiblioCard {
            parent: "REFERENCE_BOX".to_string(),
            prev: None,
            title: "공저".to_string(),
            authors: vec![
                AuthorPayload {
                    name: "홍길동".to_string(),
                    role: None,
                },
                AuthorPayload {
                    name: "임꺽정".to_string(),
                    role: None,
                },
            ],
            published_at: "2025".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });
        let note_id = note_service.create_new_note(original_note_data).unwrap();

        let update_payload = NoteUpdateType::Biblio(update::BiblioCard {
            authors: Some(vec![
                AuthorPayload {
                    name: "홍길동".to_string(),
                    role: Some("수정된 역할".to_string()),
                },
                AuthorPayload {
                    name: "전우치".to_string(),
                    role: None,
                },
            ]),
            ..Default::default()
        });
        note_service
            .update_note(&note_id, update_payload)
            .expect("Update should succeed");

        let updated_note = note_service.get_note_aggregate_by_id(&note_id).unwrap();

        let mut expected_authors = vec![
            Author {
                name: "홍길동".to_string(),
                role: Some("수정된 역할".to_string()),
            },
            Author {
                name: "전우치".to_string(),
                role: None,
            },
        ];
        expected_authors.sort_by(|a, b| a.name.cmp(&b.name));
        let mut actual_authors = updated_note.authors;
        actual_authors.sort_by(|a, b| a.name.cmp(&b.name));

        assert_eq!(actual_authors, expected_authors);
    }

    #[test]
    fn test_update_note_tags() {
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let original_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: None,
            title: "원본 제목".to_string(),
            content: "원본 내용".to_string(),
            reference: vec![],
            tags: vec!["rust".to_string(), "db".to_string()],
        });
        let note_id = note_service.create_new_note(original_note_data).unwrap();

        let update_payload = NoteUpdateType::Main(update::MainCard {
            tags: Some(vec!["rust".to_string(), "testing".to_string()]),
            ..Default::default()
        });

        note_service
            .update_note(&note_id, update_payload)
            .expect("Note update should succeed");

        // ✨ 수정: get_all_notes() 대신 get_note_aggregate_by_id()를 사용하여 더 명확하게 검증합니다.
        let updated_note = note_service.get_note_aggregate_by_id(&note_id).unwrap();

        let mut expected_tags = vec!["rust".to_string(), "testing".to_string()];
        let mut actual_tags = updated_note.tags.clone();

        expected_tags.sort();
        actual_tags.sort();

        assert_eq!(
            actual_tags, expected_tags,
            "태그는 'rust', 'testing' 이어야 합니다."
        );
    }

    #[test]
    fn test_update_note_references() {
        // 1. 준비 (Arrange): 참조될 노트 A, B, C를 만들고, A, B를 참조하는 메인 노트를 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);
        let ref_a_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                prev: None,
                title: "Ref A".to_string(),
                ..Default::default()
            }))
            .unwrap();
        let ref_b_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                prev: Some(ref_a_id.clone()),
                title: "Ref B".to_string(),
                ..Default::default()
            }))
            .unwrap();
        let ref_c_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                prev: Some(ref_b_id.clone()),
                title: "Ref C".to_string(),
                ..Default::default()
            }))
            .unwrap();

        let main_note_data = NoteCreateType::Main(create::MainCard {
            parent: "MAIN_BOX".to_string(),
            prev: Some(ref_c_id.clone()),
            title: "Main".to_string(),
            reference: vec![ref_a_id.clone(), ref_b_id.clone()],
            ..Default::default()
        });
        let main_note_id = note_service.create_new_note(main_note_data).unwrap();

        let update_payload = NoteUpdateType::Main(update::MainCard {
            reference: Some(vec![ref_c_id.clone(), ref_a_id.clone()]),
            ..Default::default()
        });

        note_service
            .update_note(&main_note_id, update_payload)
            .unwrap();

        // ✨ 수정: get_all_notes() 대신 get_note_aggregate_by_id()를 사용하여 더 명확하게 검증합니다.
        let updated_note = note_service
            .get_note_aggregate_by_id(&main_note_id)
            .unwrap();

        assert_eq!(
            updated_note.references.len(),
            2,
            "참조 목록의 개수는 2개여야 합니다."
        );

        assert_eq!(
            updated_note.references[0].note_id, ref_c_id,
            "첫 번째 참조는 C여야 합니다."
        );
        assert_eq!(updated_note.references[0].sequence, 0);
        assert_eq!(
            updated_note.references[1].note_id, ref_a_id,
            "두 번째 참조는 A여야 합니다."
        );
        assert_eq!(updated_note.references[1].sequence, 1);
    }

    #[test]
    fn test_get_note_aggregate_by_id() {
        // 1. 준비 (Arrange): 규칙에 맞게 노드를 생성합니다.
        // Biblio/Quote는 REFERENCE_BOX에, Main은 MAIN_BOX에 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // 참조될 인용 노트 (REFERENCE_BOX 아래)
        let ref_1_id = note_service
            .create_new_note(NoteCreateType::Quote(create::QuoteCard {
                parent: "REFERENCE_BOX".to_string(), // ✨ 규칙 수정
                prev: None,
                title: "참조 인용".to_string(),
                authors: vec![AuthorPayload {
                    name: "전우치".to_string(),
                    role: None,
                }],
                ..Default::default()
            }))
            .unwrap();

        // A 노트 (MAIN_BOX 아래)
        let note_a_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(), // ✨ 규칙 수정
                prev: None,
                title: "A".to_string(),
                ..Default::default()
            }))
            .unwrap();

        // B_Biblio 노트 (REFERENCE_BOX 아래, ref_1_id 뒤에)
        let note_b_id = note_service
            .create_new_note(NoteCreateType::Biblio(create::BiblioCard {
                parent: "REFERENCE_BOX".to_string(), // ✨ 규칙 수정
                prev: Some(ref_1_id.clone()),
                title: "B_Biblio".to_string(),
                authors: vec![AuthorPayload {
                    name: "홍길동".to_string(),
                    role: Some("주 저자".to_string()),
                }],
                published_at: "2025".to_string(),
                sub_type: "BOOK".to_string(),
                cover_url: None,
            }))
            .unwrap();

        // C 노트 (MAIN_BOX 아래, A 뒤에)
        let note_c_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(), // ✨ 규칙 수정
                prev: Some(note_a_id.clone()),
                title: "C".to_string(),
                reference: vec![ref_1_id.clone()],
                ..Default::default()
            }))
            .unwrap();

        // 2. 실행 (Act): B_Biblio 노트의 상세 정보를 조회합니다.
        let agg_b = note_service.get_note_aggregate_by_id(&note_b_id).unwrap();

        // 3. 검증 (Assert): B_Biblio의 정보가 정확한지 확인합니다.
        assert_eq!(agg_b.note.id, note_b_id);
        assert_eq!(agg_b.note.title, "B_Biblio");
        assert_eq!(agg_b.parent.as_deref(), Some("REFERENCE_BOX"));
        assert_eq!(agg_b.prev.as_deref(), Some(ref_1_id.as_str()));
        assert!(
            agg_b.next.is_none(),
            "B_Biblio는 REFERENCE_BOX의 마지막 자식이므로 next가 없어야 합니다."
        );
        assert!(agg_b.first_child.is_none());
        // ✨ 수정: assert 구문을 Author 구조체에 맞게 변경합니다.
        assert_eq!(
            agg_b.authors,
            vec![Author {
                name: "홍길동".to_string(),
                role: Some("주 저자".to_string())
            }]
        );
        assert!(agg_b.tags.is_empty());
        assert!(agg_b.references.is_empty());

        // 추가 검증: 다른 노트들의 관계도 올바른지 확인
        let agg_a = note_service.get_note_aggregate_by_id(&note_a_id).unwrap();
        let agg_c = note_service.get_note_aggregate_by_id(&note_c_id).unwrap();
        assert_eq!(agg_a.next.as_deref(), Some(note_c_id.as_str()));
        assert_eq!(agg_c.prev.as_deref(), Some(note_a_id.as_str()));
    }

    #[test]
    fn test_get_note_with_author_missing_role_property() {
        // 1. 준비 (Arrange): 서비스 계층을 우회하여 의도적으로 'role' 속성이 없는 관계를 생성
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // 테스트에 사용할 노트와 저자를 먼저 생성
        let note_id = note_service
            .create_new_note(NoteCreateType::Biblio(create::BiblioCard {
                parent: "REFERENCE_BOX".to_string(),
                authors: vec![], // 저자는 아래에서 수동으로 연결하므로 비워둠
                ..Default::default()
            }))
            .unwrap();

        let author_name = "고길동";
        let conn = Connection::new(&db.instance).unwrap();
        db.nodes()
            .create_person(
                &conn,
                &Person {
                    name: author_name.to_string(),
                },
            )
            .unwrap();

        // 저수준 쿼리를 직접 실행하여 'role' 속성 없이 관계만 연결
        conn.query(&format!(
            "MATCH (p:Person {{name: '{}'}}), (n:Note {{id: '{}'}}) CREATE (p)-[r:Authored]->(n)",
            author_name, note_id
        ))
        .unwrap();

        // 2. 실행 (Act): 이 상태에서 노트 집계 정보를 조회 시도
        // coalesce() 쿼리가 없다면 이 부분에서 KuzuDB 드라이버가 패닉을 일으킬 수 있음
        let result = note_service.get_note_aggregate_by_id(&note_id);

        // 3. 검증 (Assert): 패닉 없이 성공적으로 조회되어야 하며, role은 None이어야 함
        assert!(result.is_ok(), "조회에 실패하지 않아야 합니다.");
        let agg = result.unwrap();

        assert_eq!(agg.authors.len(), 1, "저자는 한 명이어야 합니다.");
        assert_eq!(
            agg.authors[0],
            Author {
                name: author_name.to_string(),
                role: None
            },
            "저자의 이름은 일치하고, 역할은 None이어야 합니다."
        );
    }

    #[test]
    fn test_parent_child_creation_rules() {
        let db = setup_db();
        let note_service = NoteService::new(&db);

        // 테스트에 사용할 부모 노드를 미리 생성
        let main_card_parent_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                ..Default::default()
            }))
            .unwrap();

        let biblio_card_parent_id = note_service
            .create_new_note(NoteCreateType::Biblio(create::BiblioCard {
                parent: "REFERENCE_BOX".to_string(),
                authors: vec![],
                ..Default::default()
            }))
            .unwrap();

        // --- 시나리오 1: 잘못된 부모 아래에 생성 시도 (실패해야 함) ---

        // MAIN_BOX 아래에 BiblioCard 생성 시도
        let result1 = note_service.create_new_note(NoteCreateType::Biblio(create::BiblioCard {
            parent: "MAIN_BOX".to_string(),
            authors: vec![],
            title: "실패해야 할 서지".to_string(),
            ..Default::default()
        }));
        assert!(
            matches!(result1, Err(Error::Integrity(_))),
            "MAIN_BOX 아래 BiblioCard 생성은 실패해야 합니다."
        );

        // REFERENCE_BOX 아래에 MainCard 생성 시도
        let result2 = note_service.create_new_note(NoteCreateType::Main(create::MainCard {
            parent: "REFERENCE_BOX".to_string(),
            title: "실패해야 할 생각".to_string(),
            ..Default::default()
        }));
        assert!(
            matches!(result2, Err(Error::Integrity(_))),
            "REFERENCE_BOX 아래 MainCard 생성은 실패해야 합니다."
        );

        // MainCard 아래에 QuoteCard 생성 시도
        let result3 = note_service.create_new_note(NoteCreateType::Quote(create::QuoteCard {
            parent: main_card_parent_id.clone(),
            title: "실패해야 할 인용".to_string(),
            ..Default::default()
        }));
        assert!(
            matches!(result3, Err(Error::Integrity(_))),
            "MainCard 아래 QuoteCard 생성은 실패해야 합니다."
        );

        // INDEX_BOX 아래에 HrCard 생성 시도
        let result4 = note_service.create_new_note(NoteCreateType::Hr(create::HrCard {
            parent: "INDEX_BOX".to_string(),
            title: "실패해야 할 구분선".to_string(),
            ..Default::default()
        }));
        assert!(
            matches!(result4, Err(Error::Integrity(_))),
            "INDEX_BOX 아래 HrCard 생성은 실패해야 합니다."
        );

        // --- 시나리오 2: 올바른 부모 아래에 생성 시도 (성공해야 함) ---

        // MainCard 아래에 또 다른 MainCard 생성 시도
        let result5 = note_service.create_new_note(NoteCreateType::Main(create::MainCard {
            parent: main_card_parent_id,
            ..Default::default()
        }));
        assert!(
            result5.is_ok(),
            "MainCard 아래 MainCard 생성은 성공해야 합니다."
        );

        // BiblioCard 아래에 QuoteCard 생성 시도
        let result6 = note_service.create_new_note(NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_card_parent_id.clone(),
            ..Default::default()
        }));
        assert!(
            result6.is_ok(),
            "BiblioCard 아래 QuoteCard 생성은 성공해야 합니다."
        );

        // BiblioCard 아래에 HrCard 생성 시도
        let result7 = note_service.create_new_note(NoteCreateType::Hr(create::HrCard {
            parent: biblio_card_parent_id,
            ..Default::default()
        }));
        assert!(
            result7.is_ok(),
            "BiblioCard 아래 HrCard 생성은 성공해야 합니다."
        );
    }
}
```

