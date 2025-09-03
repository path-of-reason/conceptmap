```rs commands.rs

use crate::kuzudb::{
    domain::models::{NoteAggregate, NoteType},
    repository::KuzuDB,
    service::NoteService,
};
use tauri::State;

#[tauri::command]
pub fn create_note(db_state: State<KuzuDB>, note: NoteType) -> Result<String, String> {
    let note_service = NoteService::new(&db_state);
    note_service.create_new_note(note)
}

#[tauri::command]
pub fn get_all_notes(db_state: State<KuzuDB>) -> Result<Vec<NoteAggregate>, String> {
    let note_service = NoteService::new(&db_state);
    unimplemented!()
}

```

```rs domain/mod.rs

pub mod models;
pub mod schema;

```

```rs domain/models.rs

// use std::collections::HashMap;
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
    pub author: Option<String>,
    pub published_at: Option<String>,
    pub cover_url: Option<String>,

    pub file_path: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderedReference {
    pub note_id: String,
    pub order: i64,
}

// 읽기 전용 집계 구조체
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteAggregate {
    pub note: Note,
    pub tags: Vec<String>,                 // HasTag 관계로부터 가져옴
    pub references: Vec<OrderedReference>, // References 관계와 order 속성으로부터 가져옴
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

#[derive(Deserialize, Debug)]
#[serde(tag = "note_type", rename_all = "UPPERCASE")]
pub enum NoteType {
    Index(IndexCard),
    Main(MainCard),
    Biblio(BiblioCard),
    Quote(QuoteCard),
    Hr(HrCard),
}
// INDEXBOX
#[derive(Deserialize, Debug)]
pub struct IndexCard {
    pub parent: String,
    pub prev: Option<String>,
    // pub next: Option<String>,
    pub title: String,
    pub content: String, // 프론트에서 배열을 JSON 문자열로 보내는 것을 가정
    pub reference: Vec<String>,
}

// MAINBOX
#[derive(Deserialize, Debug)]
pub struct MainCard {
    pub parent: String,
    pub prev: Option<String>,
    // pub next: Option<String>,
    pub title: String,
    pub content: String, // 프론트에서 배열을 JSON 문자열로 보내는 것을 가정
    pub reference: Vec<String>,
    pub tags: Vec<String>,
}

// BIBBOX
#[derive(Deserialize, Debug)]
pub struct BiblioCard {
    pub parent: String,
    pub prev: Option<String>,
    // pub next: Option<String>,
    pub title: String,
    pub author: String, // -> Person
    pub published_at: String,
    pub sub_type: String, // 예: "BOOK", "PAPER"
    pub cover_url: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct QuoteCard {
    pub parent: String,
    pub prev: Option<String>,
    pub title: String,   // 메인인용문
    pub content: String, // 인용문과 그 맥락 정보
    pub tags: Vec<String>,
}

#[derive(Deserialize, Debug)]
pub struct HrCard {
    pub parent: String,
    pub prev: Option<String>,
    // child 없음
    pub title: String,    // 예: "Part 1", "Chapter 2"
    pub sub_type: String, // 예: "PART", "CHAPTER"
}

```

```rs domain/schema.rs

use super::models::Note;
use crate::kuzudb::repository::KuzuDB;
use chrono::Utc;
use kuzu::Connection;

pub fn initialize(kuzudb: &KuzuDB) -> Result<(), String> {
    let conn = Connection::new(&kuzudb.db).map_err(|e| e.to_string())?;
    create_schema(&conn)?;
    create_default_box_notes(kuzudb, &conn)?;
    Ok(())
}

fn create_schema(conn: &Connection) -> Result<(), String> {
    let schema_query = r#"
        // 1. Node Tables
        CREATE NODE TABLE IF NOT EXISTS Note(
            id STRING PRIMARY KEY,
            title STRING,
            content STRING,
            note_type STRING,
            sub_type STRING,
            author STRING,
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
        CREATE REL TABLE IF NOT EXISTS Authored(FROM Person TO Note);

        CREATE REL TABLE IF NOT EXISTS References(
            FROM Note TO Note,
            order INT64
        );
    "#;
    conn.query(schema_query)
        .map(|_| ())
        .map_err(|e| e.to_string())
}

fn create_default_box_notes(kuzudb: &KuzuDB, conn: &Connection) -> Result<(), String> {
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
                author: None,
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

```rs mod.rs

pub mod commands;
pub mod domain;
pub mod repository;
pub mod service;

```

```rs repository/mod.rs

use kuzu::{Database, SystemConfig};

mod nodes;
mod relations;
mod utils;

pub struct Node<'a> {
    db: &'a Database,
}

pub struct Relation<'a> {
    db: &'a Database,
}

pub struct KuzuDB {
    pub db: Database,
}

impl KuzuDB {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let db = Database::new(db_path, SystemConfig::default()).map_err(|e| e.to_string())?;
        Ok(Self { db })
    }

    pub fn nodes(&self) -> Node {
        Node { db: &self.db }
    }

    pub fn relations(&self) -> Relation {
        Relation { db: &self.db }
    }
}

```

```rs repository/nodes.rs

use super::utils::{chrono_to_odt, extract_string, extract_timestamp, option_string_to_value};
use super::Node;
use crate::kuzudb::domain::models::{Note, Person, Tag, TagAlias};
use kuzu::{Connection, QueryResult, Value};

impl<'a> Node<'a> {
    pub fn create_note(&self, conn: &Connection, note: &Note) -> Result<(), String> {
        let mut prepared = conn
            .prepare(
                "CREATE (n:Note {
                        id: $id, title: $title, content: $content,
                        created_at: $created_at, updated_at: $updated_at,
                        note_type: $note_type, sub_type: $sub_type,
                        author: $author, published_at: $published_at,
                        cover_url: $cover_url, file_path: $file_path
                    })",
            )
            .map_err(|e| e.to_string())?;

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
                ("author", option_string_to_value(&note.author)),
                ("published_at", option_string_to_value(&note.published_at)),
                ("cover_url", option_string_to_value(&note.cover_url)),
                ("file_path", option_string_to_value(&note.file_path)),
            ],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn create_tag(&self, conn: &Connection, tag: &Tag) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MERGE (t:Tag {name: $name})")
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(tag.name.clone()))],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn create_tag_alias(&self, conn: &Connection, alias: &TagAlias) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MERGE (ta:TagAlias {name: $name})")
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(alias.name.clone()))],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn create_person(&self, conn: &Connection, person: &Person) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MERGE (p:Person {name: $name})")
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![("name", Value::String(person.name.clone()))],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }

    pub fn remove_note(&self, conn: &Connection, id: &str) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MATCH (n:Note {id: $id}) DETACH DELETE n")
            .map_err(|e| e.to_string())?;
        conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
    pub fn remove_tag(&self, conn: &Connection, tag: &str) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MATCH (t:Tag {name: $tag}) DETACH DELETE t")
            .map_err(|e| e.to_string())?;
        conn.execute(&mut prepared, vec![("tag", Value::String(tag.to_string()))])
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
    pub fn remove_tag_alias(&self, conn: &Connection, tag_alias: &str) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MATCH (t:TagAlias {name: $tag_alias}) DETACH DELETE t")
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![("tag_alias", Value::String(tag_alias.to_string()))],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn remove_person(&self, conn: &Connection, person: &str) -> Result<(), String> {
        let mut prepared = conn
            .prepare("MATCH (p:Person {name: $person}) DETACH DELETE p")
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![("person", Value::String(person.to_string()))],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }

    pub fn is_exist(&self, conn: &Connection, id: &str) -> Result<bool, String> {
        let mut prepared = conn
            .prepare("MATCH (n:Note {id: $id}) RETURN n.id")
            .map_err(|e| e.to_string())?;
        let mut result = conn
            .execute(&mut prepared, vec![("id", Value::String(id.to_string()))])
            .map_err(|e| e.to_string())?;
        Ok(result.next().is_some())
    }

    pub fn get_all_notes_and_relations(
        &self,
        conn: &Connection,
    ) -> Result<
        (
            Vec<Note>,
            Vec<(String, String)>,
            Vec<(String, String)>,
            Vec<(String, String)>,
            Vec<(String, String)>,
            Vec<(String, String)>,
            Vec<(String, String, i64)>,
        ),
        String,
    > {
        // 1. 모든 노트 가져오기
        let mut notes = vec![];
        let result: QueryResult = conn.query("MATCH (n:Note) RETURN n.id, n.title, n.content, n.created_at, n.updated_at, n.note_type, n.sub_type, n.author, n.published_at, n.cover_url, n.file_path")
                .map_err(|e| e.to_string())?;
        for row in result.into_iter() {
            notes.push(Note {
                id: extract_string(&row[0]).ok_or("id missing")?,
                title: extract_string(&row[1]).ok_or("title missing")?,
                content: extract_string(&row[2]).unwrap_or_default(),
                created_at: extract_timestamp(&row[3]).ok_or("created_at missing")?,
                updated_at: extract_timestamp(&row[4]).ok_or("updated_at missing")?,
                note_type: extract_string(&row[5]).ok_or("note_type missing")?,
                sub_type: extract_string(&row[6]),
                author: extract_string(&row[7]),
                published_at: extract_string(&row[8]),
                cover_url: extract_string(&row[9]),
                file_path: extract_string(&row[10]),
            });
        }

        // 헬퍼 함수: 두 ID를 가진 관계를 가져옵니다.
        let get_pair_rel = |query: &str| -> Result<Vec<(String, String)>, String> {
            let mut rels = vec![];
            let result = conn.query(query).map_err(|e| e.to_string())?;
            for row in result.into_iter() {
                let from = extract_string(&row[0]).ok_or("relation 'from' missing")?;
                let to = extract_string(&row[1]).ok_or("relation 'to' missing")?;
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

        // 3. 순서가 있는 참조 관계 가져오기
        let mut references = vec![];
        let result_refs = conn
            .query("MATCH (a:Note)-[r:References]->(b:Note) RETURN a.id, b.id, r.order")
            .map_err(|e| e.to_string())?;
        for row in result_refs.into_iter() {
            let from = extract_string(&row[0]).ok_or("ref 'from' missing")?;
            let to = extract_string(&row[1]).ok_or("ref 'to' missing")?;
            let order = match &row[2] {
                Value::Int64(val) => *val,
                _ => return Err("ref 'order' is not i64".to_string()),
            };
            references.push((from, to, order));
        }

        Ok((
            notes,
            child_of,
            first_child,
            next,
            prev,
            has_tag,
            references,
        ))
    }

    pub fn get_note_by_id(&self, conn: &Connection, id: &str) -> Result<Option<Note>, String> {
        let mut prepared = conn
            .prepare(
                "MATCH (n:Note {id: $id}) RETURN
                     n.id, n.title, n.content, n.created_at, n.updated_at,
                     n.note_type, n.sub_type, n.author, n.published_at,
                     n.cover_url, n.file_path",
            )
            .map_err(|e| e.to_string())?;

        let mut result = conn
            .execute(&mut prepared, vec![("id", Value::String(id.to_string()))])
            .map_err(|e| e.to_string())?;

        if let Some(row) = result.next() {
            let note = Note {
                id: extract_string(&row[0]).ok_or("id missing")?,
                title: extract_string(&row[1]).ok_or("title missing")?,
                content: extract_string(&row[2]).unwrap_or_default(),
                created_at: extract_timestamp(&row[3]).ok_or("created_at missing")?,
                updated_at: extract_timestamp(&row[4]).ok_or("updated_at missing")?,
                note_type: extract_string(&row[5]).ok_or("note_type missing")?,
                sub_type: extract_string(&row[6]),
                author: extract_string(&row[7]),
                published_at: extract_string(&row[8]),
                cover_url: extract_string(&row[9]),
                file_path: extract_string(&row[10]),
            };
            return Ok(Some(note));
        }

        Ok(None)
    }
}

```

```rs repository/relations.rs

use super::Relation;
use kuzu::{Connection, Value};

impl<'a> Relation<'a> {
    fn execute_single(&self, conn: &Connection, query: &str, id: &str) -> Result<(), String> {
        let mut prepared = conn.prepare(query).map_err(|e| e.to_string())?;
        conn.execute(&mut prepared, vec![("id", Value::String(id.to_string()))])
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
    fn execute_pair(
        &self,
        conn: &Connection,
        query: &str,
        from: &str,
        to: &str,
    ) -> Result<(), String> {
        let mut prepared = conn.prepare(query).map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![
                ("from", Value::String(from.to_string())),
                ("to", Value::String(to.to_string())),
            ],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn link_parent(
        &self,
        conn: &Connection,
        child_id: &str,
        parent_id: &str,
    ) -> Result<(), String> {
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
    ) -> Result<(), String> {
        self.execute_pair(
            conn,
            "MATCH (p:Note {id: $from}), (c:Note {id: $to}) MERGE (p)-[:FirstChild]->(c)",
            parent_id,
            child_id,
        )
    }
    pub fn link_next(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<(), String> {
        self.execute_pair(
            &conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Next]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_prev(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<(), String> {
        self.execute_pair(
            &conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Prev]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_note_to_tag(
        &self,
        conn: &Connection,
        note_id: &str,
        tag: &str,
    ) -> Result<(), String> {
        self.execute_pair(
            &conn,
            "MATCH (n:Note {id: $from}), (t:Tag {name: $to}) MERGE (n)-[:HasTag]->(t)",
            note_id,
            tag,
        )
    }
    pub fn link_alias_to_tag(
        &self,
        conn: &Connection,
        alias_name: &str,
        tag: &str,
    ) -> Result<(), String> {
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
    ) -> Result<(), String> {
        self.execute_pair(
            conn,
            "MATCH (p:Person {name: $from}), (n:Note {id: $to}) MERGE (p)-[:Authored]->(n)",
            person,
            note_id,
        )
    }
    pub fn link_reference(
        &self,
        conn: &Connection,
        from_id: &str,
        to_id: &str,
        order: i64,
    ) -> Result<(), String> {
        let mut prepared = conn
            .prepare(
                "MATCH (a:Note {id: $from}), (b:Note {id: $to})
               MERGE (a)-[r:References]->(b)
               SET r.order = $order",
            )
            .map_err(|e| e.to_string())?;
        conn.execute(
            &mut prepared,
            vec![
                ("from", Value::String(from_id.to_string())),
                ("to", Value::String(to_id.to_string())),
                ("order", Value::Int64(order)),
            ],
        )
        .map(|_| ())
        .map_err(|e| e.to_string())
    }
    pub fn unlink_parent(&self, conn: &Connection, child_id: &str) -> Result<(), String> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:ChildOf]->() DELETE r",
            child_id,
        )
    }
    pub fn unlink_first_child(&self, conn: &Connection, parent_id: &str) -> Result<(), String> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:FirstChild]->() DELETE r",
            parent_id,
        )
    }
    pub fn unlink_next(&self, conn: &Connection, node_id: &str) -> Result<(), String> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:Next]->() DELETE r",
            node_id,
        )
    }
    pub fn unlink_prev(&self, conn: &Connection, node_id: &str) -> Result<(), String> {
        self.execute_single(
            conn,
            "MATCH (:Note {id: $id})-[r:Prev]->() DELETE r",
            node_id,
        )
    }
    pub fn unlink_note_to_tag(
        &self,
        conn: &Connection,
        note_id: &str,
        tag: &str,
    ) -> Result<(), String> {
        self.execute_pair(
            conn,
            "MATCH (:Note {id: $from})-[r:HasTag]->(:Tag {name: $to}) DELETE r",
            note_id,
            tag,
        )
    }
    pub fn unlink_alias_to_tag(
        &self,
        conn: &Connection,
        alias: &str,
        tag: &str,
    ) -> Result<(), String> {
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
    ) -> Result<(), String> {
        self.execute_pair(
            conn,
            "MATCH (:Person {name: $from})-[r:Authored]->(:Note {id: $to}) DELETE r",
            person,
            note_id,
        )
    }
    pub fn unlink_reference(
        &self,
        conn: &Connection,
        from_id: &str,
        to_id: &str,
    ) -> Result<(), String> {
        self.execute_pair(
            conn,
            "MATCH (:Note {id: $from})-[r:References]->(:Note {id: $to}) DELETE r",
            from_id,
            to_id,
        )
    }
    pub fn get_first_child_id(
        &self,
        conn: &Connection,
        parent_id: &str,
    ) -> Result<Option<String>, String> {
        let mut prepared = conn
            .prepare("MATCH (p:Note {id: $id})-[:FirstChild]->(c:Note) RETURN c.id")
            .map_err(|e| e.to_string())?;
        let mut result = conn
            .execute(
                &mut prepared,
                vec![("id", Value::String(parent_id.to_string()))],
            )
            .map_err(|e| e.to_string())?;

        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_parent_id(
        &self,
        conn: &Connection,
        child_id: &str,
    ) -> Result<Option<String>, String> {
        let mut prepared = conn
            .prepare("MATCH (c:Note {id: $id})-[:ChildOf]->(p:Note) RETURN p.id")
            .map_err(|e| e.to_string())?;
        let mut result = conn
            .execute(
                &mut prepared,
                vec![("id", Value::String(child_id.to_string()))],
            )
            .map_err(|e| e.to_string())?;

        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_next_id(&self, conn: &Connection, node_id: &str) -> Result<Option<String>, String> {
        let mut prepared = conn
            .prepare("MATCH (a:Note {id: $id})-[:Next]->(b:Note) RETURN b.id")
            .map_err(|e| e.to_string())?;
        let mut result = conn
            .execute(
                &mut prepared,
                vec![("id", Value::String(node_id.to_string()))],
            )
            .map_err(|e| e.to_string())?;

        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
    }
    pub fn get_prev_id(&self, conn: &Connection, node_id: &str) -> Result<Option<String>, String> {
        let mut prepared = conn
            .prepare("MATCH (a:Note {id: $id})-[:Prev]->(b:Note) RETURN b.id")
            .map_err(|e| e.to_string())?;
        let mut result = conn
            .execute(
                &mut prepared,
                vec![("id", Value::String(node_id.to_string()))],
            )
            .map_err(|e| e.to_string())?;

        if let Some(row) = result.next() {
            if let Value::String(s) = &row[0] {
                return Ok(Some(s.clone()));
            }
        }
        Ok(None)
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
    db: &'a KuzuDB,
}

impl<'a> NoteService<'a> {
    pub fn new(db: &'a KuzuDB) -> Self {
        Self { db }
    }
}

```

```rs service/note.rs

use super::NoteService;
use crate::kuzudb::domain::models::{Note, NoteType, Tag};
use chrono::Utc;
use kuzu::Connection;
use uuid::Uuid;

impl<'a> NoteService<'a> {
    pub fn create_new_note(&self, note: NoteType) -> Result<String, String> {
        let conn = Connection::new(&self.db.db).map_err(|e| e.to_string())?;

        conn.query("BEGIN TRANSACTION WRITE;")
            .map_err(|e| format!("트랜잭션 시작 실패: {}", e))?;

        let creation_result = (|| {
            let new_note_id = Uuid::new_v4().to_string();
            let now = Utc::now();

            let (parent_id, prev_id, references, tags, mut new_note) = match note {
                NoteType::Main(card) => (
                    card.parent,
                    card.prev,
                    card.reference,
                    card.tags,
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        content: card.content,
                        note_type: "MAIN".to_string(),
                        ..Default::default()
                    },
                ),
                NoteType::Biblio(card) => (
                    card.parent,
                    card.prev,
                    vec![],
                    vec![],
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        note_type: "BIBLIO".to_string(),
                        author: Some(card.author),
                        published_at: Some(card.published_at),
                        sub_type: Some(card.sub_type),
                        cover_url: card.cover_url,
                        ..Default::default()
                    },
                ),
                NoteType::Quote(card) => (
                    card.parent,
                    card.prev,
                    vec![],
                    card.tags,
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        content: card.content,
                        note_type: "QUOTE".to_string(),
                        ..Default::default()
                    },
                ),
                NoteType::Hr(card) => (
                    card.parent,
                    card.prev,
                    vec![],
                    vec![],
                    Note {
                        id: new_note_id.clone(),
                        title: card.title,
                        note_type: "HR".to_string(),
                        sub_type: Some(card.sub_type),
                        ..Default::default()
                    },
                ),
                NoteType::Index(card) => (
                    card.parent,
                    card.prev,
                    card.reference,
                    vec![],
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

            let nodes_api = self.db.nodes();
            let relations_api = self.db.relations();

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

            Ok(new_note_id)
        })();

        match creation_result {
            Ok(new_id) => {
                conn.query("COMMIT;")
                    .map_err(|e| format!("트랜잭션 커밋 실패: {}", e))?;
                Ok(new_id)
            }
            Err(e) => {
                conn.query("ROLLBACK;")
                    .map_err(|e_rb| format!("롤백 실패: {}. 원본 오류: {}", e_rb, e))?;
                Err(e)
            }
        }
    }
}

```
