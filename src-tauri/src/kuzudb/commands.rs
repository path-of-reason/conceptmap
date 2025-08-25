use crate::kuzudb::{db::KuzuDB, models::Note};
use chrono::Utc;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn create_note(
    db: State<KuzuDB>,
    title: String,
    content: String,
    parent_uuid: Option<String>,
    vault_path: String, // 프론트에서 현재 볼트의 실 경로 받아온다고 가정
) -> Result<Note, String> {
    // 1. uuid, timestamp, rank 생성
    let uuid = Uuid::new_v4().to_string();
    let now = Utc::now();
    let rank = "a".to_string(); // ★ lexorank 미구현 시, "a" 임시 (실제는 마지막 자식 참조해서 계산해야 함)
    let file_path = format!("{}/{}.md", vault_path, uuid);

    // 2. Note 인스턴스 생성
    let note = Note {
        uuid: uuid.clone(),
        title: title.clone(),
        content: content.clone(),
        created_at: now,
        updated_at: now,
        rank: rank.clone(),
        parent_uuid: parent_uuid.clone(),
        file_path: file_path.clone(),
    };

    // 3. 파일 저장 (현재는 주석 처리됨)
    // let md_body = format!(
    //     "---\nuuid: {}\ntitle: {}\nrank: {}\ncreated_at: {}\nupdated_at: {}\nparent_uuid: {}\n---\n\n{}",
    //     uuid,
    //     title,
    //     rank,
    //     now.to_rfc3339(),
    //     now.to_rfc3339(),
    //     parent_uuid.clone().unwrap_or_default(),
    //     content
    // );
    // std::fs::write(&file_path, md_body).map_err(|e| e.to_string())?;

    // 4. DB 노드 생성
    eprintln!("Attempting to insert note into DB.");
    db.insert_note(&note).map_err(|e| {
        eprintln!("DB insert error: {}", e);
        e.to_string()
    })?;
    eprintln!("Note inserted into DB successfully.");

    // 5. 관계 생성 (선택: parent_uuid가 있을 때 ChildOf, Next 관계 쿼리 추가)
    if let Some(parent) = parent_uuid.clone() {
        eprintln!("Attempting to create ChildOf relationship.");
        let q = format!(
            "MATCH (c:Note {{uuid: '{}'}}), (p:Note {{uuid: '{}'}})
            CREATE (c)-[:ChildOf]->(p);",
            uuid, parent
        );
        db.exec_query(&q).map_err(|e| {
            eprintln!("Relationship creation error: {}", e);
            e.to_string()
        })?;
        eprintln!("ChildOf relationship created successfully.");
        // (advance) NEXT 정렬 관계 처리 추가 가능
    }

    Ok(note)
}

