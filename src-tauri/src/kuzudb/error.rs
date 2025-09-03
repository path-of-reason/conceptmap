use thiserror::Error;

#[derive(Error, Debug)]
pub enum Error {
    #[error("KuzuDB operation failed: {0}")]
    Kuzu(#[from] kuzu::Error),

    #[error("Note with ID '{0}' not found")] // update or remove  for service layer
    NoteNotFound(String),

    #[error("Transaction failed: {0}")]
    Transaction(String),

    #[error("Data integrity error: {0}")]
    Integrity(String),
}

// Result 타입을 우리 커스텀 에러로 미리 정의해두면 편리합니다.
pub type Result<T> = std::result::Result<T, Error>;
