use kuzu::{Connection, Database, SystemConfig};

use super::models::Note;

pub struct KuzuDB {
    pub db: Database,
}

impl KuzuDB {
    pub fn new(db_path: &str) -> Result<Self, String> {
        let db = Database::new(db_path, SystemConfig::default()).map_err(|e| e.to_string())?;
        Ok(Self { db })
    }

    pub fn exec_query(&self, q: &str) -> Result<(), String> {
        let conn = Connection::new(&self.db).map_err(|e| e.to_string())?;
        conn.query(q).map(|_| ()).map_err(|e| e.to_string())
    }

    // pub fn select_rows(&self, q: &str) -> Result<Vec<Vec<String>>, String> {
    //     let conn = Connection::new(&self.db).map_err(|e| e.to_string())?;
    //     let result = conn.query(q).map_err(|e| e.to_string())?;
    //     let mut rows = Vec::new();
    //     for record in result {
    //         let row: Vec<String> = record.iter().map(|v| v.to_string()).collect();
    //         rows.push(row);
    //     }
    //     Ok(rows)
    // }

    pub fn insert_note(&self, note: &Note) -> Result<(), String> {
        let q = format!(
            "CREATE (n:Note {{ \
                uuid: \"{}\", \
                title: \"{}\", \
                content: \"{}\", \
                created_at: TIMESTAMP(\"{}\"), 
                updated_at: TIMESTAMP(\"{}\"),
                rank: \"{}\", \
                parent_uuid: {}, \
                file_path: \"{}\" \
            }})",
            note.uuid,
            note.title,
            note.content,
            note.created_at.to_rfc3339(),
            note.updated_at.to_rfc3339(),
            note.rank,
            match &note.parent_uuid {
                Some(val) => format!("\"{}\"", val),
                None => "null".into(),
            },
            note.file_path
        );
        self.exec_query(&q)
    }
}
