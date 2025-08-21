use crate::error::AppResult;
use crate::kuzudb::error::KuzuError::{DriverError, IoError};
use kuzu::{Database, SystemConfig};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

pub struct KuzuPool {
    pub db: Mutex<Database>,
}

impl KuzuPool {
    pub fn new(db_path: PathBuf) -> AppResult<Arc<Self>> {
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent).map_err(IoError)?;
        }

        let db = Database::new(&db_path, SystemConfig::default()).map_err(DriverError)?;
        println!(
            "[INFO] Kuzu Database가 생성/연결되었습니다: 경로 {:?}",
            db_path
        );

        Ok(Arc::new(KuzuPool {
            db: Mutex::new(db),
        }))
    }
}
