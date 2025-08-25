use crate::kuzudb::db::KuzuDB;

pub fn initialize_schema(db: &KuzuDB) -> Result<(), String> {
    db.exec_query(
        r#"
        CREATE NODE TABLE IF NOT EXISTS Note(
            uuid STRING PRIMARY KEY,
            title STRING,
            content STRING,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            rank STRING,
            parent_uuid STRING,
            file_path STRING
        );
    "#,
    )?;

    db.exec_query("CREATE REL TABLE IF NOT EXISTS ChildOf(FROM Note TO Note);")?;
    db.exec_query("CREATE REL TABLE IF NOT EXISTS Next(FROM Note TO Note);")?;
    Ok(())
}
