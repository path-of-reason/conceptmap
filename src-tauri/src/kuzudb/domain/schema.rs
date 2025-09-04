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
        if !kuzudb.nodes().is_exist(conn, &id)? {
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
            kuzudb.nodes().create_note(conn, &note)?;
        }
    }
    Ok(())
}
