pub mod note;

use crate::kuzudb::repository::KuzuDB;

pub struct NoteService<'a> {
    kuzudb: &'a KuzuDB,
}

impl<'a> NoteService<'a> {
    pub fn new(kuzudb: &'a KuzuDB) -> Self {
        Self { kuzudb }
    }
}
