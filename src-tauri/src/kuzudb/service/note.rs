use super::NoteService;
use crate::kuzudb::{
    domain::models::{
        Note, NoteAggregate, NoteCreateType, NoteUpdateType, Person, SequencedReference, Tag,
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
        for (person_name, note_id) in authored {
            if let Some(agg) = aggregates.get_mut(&note_id) {
                agg.authors.push(person_name);
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

            // ✨ authors 필드를 추가로 반환받도록 수정
            let (parent_id, prev_id, references, tags, authors, mut new_note) = match note {
                NoteCreateType::Main(card) => (
                    card.parent,
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
                    card.parent,
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
                    card.parent,
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
                    card.parent,
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
                    card.parent,
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
                for author_name in &authors {
                    nodes_api.create_person(
                        &conn,
                        &Person {
                            name: author_name.clone(),
                        },
                    )?;
                    relations_api.link_person_to_note(&conn, author_name, &new_note_id)?;
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
                    // ✨ 수정: 저자 목록 업데이트 로직
                    if let Some(new_authors) = data.authors {
                        let old_authors = relations_api.get_authors_for_note(&conn, id)?;
                        for old_author in old_authors {
                            relations_api.unlink_person_to_note(&conn, &old_author, id)?;
                        }
                        for new_author in new_authors {
                            nodes_api.create_person(
                                &conn,
                                &Person {
                                    name: new_author.clone(),
                                },
                            )?;
                            relations_api.link_person_to_note(&conn, &new_author, id)?;
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
                    // ✨ 추가: 저자 목록 업데이트 로직
                    if let Some(new_authors) = data.authors {
                        let old_authors = relations_api.get_authors_for_note(&conn, id)?;
                        for old_author in old_authors {
                            relations_api.unlink_person_to_note(&conn, &old_author, id)?;
                        }
                        for new_author in new_authors {
                            nodes_api.create_person(
                                &conn,
                                &Person {
                                    name: new_author.clone(),
                                },
                            )?;
                            relations_api.link_person_to_note(&conn, &new_author, id)?;
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
    use crate::kuzudb::domain::models::payloads::{create, update};
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
            authors: vec!["홍길동".to_string()],
            published_at: "2025-09-03".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });

        let biblio_note_id = note_service.create_new_note(biblio_card_data).unwrap();

        // 이제 방금 만든 서지 노트 아래에 인용(Quote) 노트를 추가할 준비를 합니다.
        // ✨ 추가: 인용 카드에 저자 정보 추가 (책의 저자와 다른 저자)
        let quote_card_data = NoteCreateType::Quote(create::QuoteCard {
            parent: biblio_note_id.clone(), // 부모를 서지 노트 ID로 지정
            prev: None,                     // 서지 노트의 첫 번째 자식이므로 prev는 없음
            title: "메모리 안전성".to_string(),
            content: "Rust는 소유권 시스템을 통해 메모리 안전성을 보장합니다.".to_string(),
            authors: vec!["임꺽정".to_string()], // 인용문의 실제 발언자
            tags: vec!["rust".to_string(), "memory".to_string()],
        });

        // 2. 실행 (Act): 인용 노트를 생성합니다.
        let quote_note_id = note_service.create_new_note(quote_card_data).unwrap();

        // 3. 검증 (Assert): 관계가 올바르게 설정되었는지 확인합니다.
        let all_notes = note_service.get_all_notes().unwrap();

        let biblio_note = all_notes
            .iter()
            .find(|n| n.note.id == biblio_note_id)
            .unwrap();
        let quote_note = all_notes
            .iter()
            .find(|n| n.note.id == quote_note_id)
            .unwrap();

        // --- 검증 시작 ---
        assert_eq!(all_notes.len(), 5); // 기본 3개 + 서지 1개 + 인용 1개

        // ✨ 수정: 서지 노트의 저자(authors)가 올바른지 확인
        assert_eq!(biblio_note.authors, vec!["홍길동".to_string()]);

        // ✨ 추가: 인용 노트의 저자(authors)가 올바른지 확인
        assert_eq!(quote_note.authors, vec!["임꺽정".to_string()]);

        // 인용 노트의 부모가 서지 노트가 맞는지 확인
        assert_eq!(quote_note.parent.as_ref(), Some(&biblio_note_id));

        // 서지 노트의 첫 번째 자식이 인용 노트가 맞는지 확인
        assert_eq!(biblio_note.first_child.as_ref(), Some(&quote_note_id));
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
            authors: vec!["홍길동".to_string()],
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
            authors: vec!["홍길동".to_string()],
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
            authors: vec!["홍길동".to_string(), "임꺽정".to_string()],
            published_at: "2025".to_string(),
            sub_type: "BOOK".to_string(),
            cover_url: None,
        });
        let note_id = note_service.create_new_note(original_note_data).unwrap();

        let update_payload = NoteUpdateType::Biblio(update::BiblioCard {
            authors: Some(vec!["홍길동".to_string(), "전우치".to_string()]),
            ..Default::default()
        });

        note_service
            .update_note(&note_id, update_payload)
            .expect("Note update should succeed");

        // ✨ 수정: get_all_notes() 대신 get_note_aggregate_by_id()를 사용하여 더 명확하게 검증합니다.
        let updated_note = note_service.get_note_aggregate_by_id(&note_id).unwrap();

        let mut expected_authors = vec!["홍길동".to_string(), "전우치".to_string()];
        let mut actual_authors = updated_note.authors.clone();

        expected_authors.sort();
        actual_authors.sort();

        assert_eq!(
            actual_authors, expected_authors,
            "저자는 '홍길동', '전우치' 이어야 합니다."
        );
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
        // 1. 준비 (Arrange): A -> B_Biblio -> C 순서의 노드를 서비스 로직을 통해 안전하게 생성합니다.
        let db = setup_db();
        let note_service = NoteService::new(&db);

        let ref_1_id = note_service
            .create_new_note(NoteCreateType::Quote(create::QuoteCard {
                parent: "REFERENCE_BOX".to_string(),
                prev: None,
                title: "참조 인용".to_string(),
                authors: vec!["전우치".to_string()],
                ..Default::default()
            }))
            .unwrap();

        let note_a_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                prev: None,
                title: "A".to_string(),
                ..Default::default()
            }))
            .unwrap();

        // B_Biblio를 A 뒤에 생성
        let note_b_id = note_service
            .create_new_note(NoteCreateType::Biblio(create::BiblioCard {
                parent: "MAIN_BOX".to_string(),
                prev: Some(note_a_id.clone()),
                title: "B_Biblio".to_string(),
                authors: vec!["홍길동".to_string()],
                published_at: "2025".to_string(),
                sub_type: "BOOK".to_string(),
                cover_url: None,
            }))
            .unwrap();

        // C를 B_Biblio 뒤에 생성
        let note_c_id = note_service
            .create_new_note(NoteCreateType::Main(create::MainCard {
                parent: "MAIN_BOX".to_string(),
                prev: Some(note_b_id.clone()),
                title: "C".to_string(),
                reference: vec![ref_1_id.clone()], // C가 참조를 갖도록 수정
                ..Default::default()
            }))
            .unwrap();

        // 2. 실행 (Act): 중간 노드인 'B_Biblio'의 상세 정보를 조회합니다.
        let agg = note_service.get_note_aggregate_by_id(&note_b_id).unwrap();

        // ✨ 추가: C의 정보도 미리 조회해 둡니다.
        let agg_c = note_service.get_note_aggregate_by_id(&note_c_id).unwrap();

        // 3. 검증 (Assert): 조회된 정보가 모두 정확한지 확인합니다.
        assert_eq!(agg.note.id, note_b_id);
        assert_eq!(agg.note.title, "B_Biblio");
        assert_eq!(agg.parent.as_deref(), Some("MAIN_BOX"));
        assert_eq!(agg.prev.as_deref(), Some(note_a_id.as_str()));

        // ✨ 수정: 소유권 이동(move)을 막기 위해 .as_deref()를 사용하여 내용만 비교합니다.
        assert_eq!(agg.next.as_deref(), Some(note_c_id.as_str()));

        assert!(agg.first_child.is_none());
        assert_eq!(agg.authors, vec!["홍길동".to_string()]);
        assert!(agg.tags.is_empty());
        assert!(
            agg.references.is_empty(),
            "B_Biblio는 직접적인 참조를 가지고 있지 않아야 합니다."
        );

        // C가 참조를 올바르게 가지고 있는지 검증
        assert_eq!(agg_c.references.len(), 1);
        assert_eq!(agg_c.references[0].note_id, ref_1_id);
    }
}
