pub mod note;
use crate::kuzudb::repository::KuzuDB;
use serde::{Deserialize, Serialize};

pub struct NoteService<'a> {
    kuzudb: &'a KuzuDB,
}

// ✨ 추가: 데이터 정합성 검증 결과를 담을 보고서 구조체
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct IntegrityReport {
    pub duplicate_next_relations: Vec<(String, i64)>,
    pub duplicate_prev_relations: Vec<(String, i64)>,
    pub duplicate_first_child_relations: Vec<(String, i64)>,
}

impl<'a> NoteService<'a> {
    pub fn new(kuzudb: &'a KuzuDB) -> Self {
        Self { kuzudb }
    }
}
