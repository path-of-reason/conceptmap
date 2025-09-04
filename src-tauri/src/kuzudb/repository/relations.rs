use super::utils::extract_string;
use super::Relation;
use crate::kuzudb::{
    domain::models::{Author, SequencedReference},
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
            conn,
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
            conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Next]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_prev(&self, conn: &Connection, from_id: &str, to_id: &str) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (a:Note {id: $from}), (b:Note {id: $to}) MERGE (a)-[:Prev]->(b)",
            from_id,
            to_id,
        )
    }
    pub fn link_note_to_tag(&self, conn: &Connection, note_id: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            conn,
            "MATCH (n:Note {id: $from}), (t:Tag {name: $to}) MERGE (n)-[:HasTag]->(t)",
            note_id,
            tag,
        )
    }
    pub fn link_alias_to_tag(&self, conn: &Connection, alias_name: &str, tag: &str) -> Result<()> {
        self.execute_pair(
            conn,
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
    // pub fn unlink_parent(&self, conn: &Connection, child_id: &str) -> Result<()> {
    //     self.execute_single(
    //         conn,
    //         "MATCH (:Note {id: $id})-[r:ChildOf]->() DELETE r",
    //         child_id,
    //     )
    // }
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
            if let Some(tag_name) = extract_string(&row[0]) {
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
            let name =
                extract_string(&row[0]).ok_or(Error::Integrity("author name missing".into()))?;
            let role = extract_string(&row[1]); // 이제 row[1]은 항상 안전합니다.
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
            if let Some(ref_id) = extract_string(&row[0]) {
                refs.push(ref_id);
            }
        }
        Ok(refs)
    }

    pub fn get_sequenced_references_for_note(
        &self,
        conn: &Connection,
        note_id: &str,
    ) -> Result<Vec<SequencedReference>> {
        let mut prepared = conn.prepare(
            "MATCH (:Note {id: $id})-[r:References]->(b:Note) RETURN b.id, r.sequence ORDER BY r.sequence",
        )?;
        let result = conn.execute(
            &mut prepared,
            vec![("id", Value::String(note_id.to_string()))],
        )?;

        let mut refs = Vec::new();
        for row in result.into_iter() {
            let ref_id =
                extract_string(&row[0]).ok_or(Error::Integrity("ref id missing".into()))?;
            let sequence = match &row[1] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("ref sequence is not i64".into())),
            };
            refs.push(SequencedReference {
                note_id: ref_id,
                sequence,
            });
        }
        Ok(refs)
    }

    /// `Next` 관계를 두 개 이상 가진 노드를 찾아 [노드 ID, 관계 수]의 벡터로 반환합니다.
    pub fn find_duplicate_next_relations(&self, conn: &Connection) -> Result<Vec<(String, i64)>> {
        let query = "MATCH (a:Note)-[r:Next]->() WITH a, count(r) AS c WHERE c > 1 RETURN a.id, c";
        let result = conn.query(query)?;

        let mut duplicates = Vec::new();
        for row in result.into_iter() {
            let node_id = extract_string(&row[0]).ok_or(Error::Integrity(
                "Node ID missing in duplicate check".into(),
            ))?;
            let count = match &row[1] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("Count is not i64".into())),
            };
            duplicates.push((node_id, count));
        }
        Ok(duplicates)
    }

    /// `Prev` 관계를 두 개 이상 가진 노드를 찾아 [노드 ID, 관계 수]의 벡터로 반환합니다.
    pub fn find_duplicate_prev_relations(&self, conn: &Connection) -> Result<Vec<(String, i64)>> {
        let query = "MATCH (a:Note)-[r:Prev]->() WITH a, count(r) AS c WHERE c > 1 RETURN a.id, c";
        let result = conn.query(query)?;

        let mut duplicates = Vec::new();
        for row in result.into_iter() {
            let node_id = extract_string(&row[0]).ok_or(Error::Integrity(
                "Node ID missing in duplicate check".into(),
            ))?;
            let count = match &row[1] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("Count is not i64".into())),
            };
            duplicates.push((node_id, count));
        }
        Ok(duplicates)
    }

    /// `FirstChild` 관계를 두 개 이상 가진 노드를 찾아 [노드 ID, 관계 수]의 벡터로 반환합니다.
    pub fn find_duplicate_first_child_relations(
        &self,
        conn: &Connection,
    ) -> Result<Vec<(String, i64)>> {
        let query =
            "MATCH (a:Note)-[r:FirstChild]->() WITH a, count(r) AS c WHERE c > 1 RETURN a.id, c";
        let result = conn.query(query)?;

        let mut duplicates = Vec::new();
        for row in result.into_iter() {
            let node_id = extract_string(&row[0]).ok_or(Error::Integrity(
                "Node ID missing in duplicate check".into(),
            ))?;
            let count = match &row[1] {
                Value::Int64(val) => *val,
                _ => return Err(Error::Integrity("Count is not i64".into())),
            };
            duplicates.push((node_id, count));
        }
        Ok(duplicates)
    }
}
