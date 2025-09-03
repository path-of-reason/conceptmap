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
