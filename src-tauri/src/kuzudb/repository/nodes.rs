use super::utils::{chrono_to_odt, extract_string, extract_timestamp, option_string_to_value};
use super::Node;
use crate::kuzudb::{
    domain::models::{Note, Person, Tag, TagAlias},
    error::{Error, Result},
};
use kuzu::{Connection, QueryResult, Value};

pub struct AllNotesAndRelations {
    pub notes: Vec<Note>,
    pub child_of: Vec<(String, String)>,
    pub first_child: Vec<(String, String)>,
    pub next: Vec<(String, String)>,
    pub prev: Vec<(String, String)>,
    pub has_tag: Vec<(String, String)>,
    pub references: Vec<(String, String, i64)>,
    pub authored: Vec<(String, Option<String>, String)>,
}

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

    pub fn get_all_notes_and_relations(&self, conn: &Connection) -> Result<AllNotesAndRelations> {
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

        Ok(AllNotesAndRelations {
            notes,
            child_of,
            first_child,
            next,
            prev,
            has_tag,
            references,
            authored,
        })
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
            };
            return Ok(Some(note));
        }

        Ok(None)
    }
}
