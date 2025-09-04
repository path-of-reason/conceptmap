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
