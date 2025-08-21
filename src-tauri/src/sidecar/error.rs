use duckdb;
use kuzu;
use serde_json;
use std::io;
use std::sync::PoisonError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database specific error: {0}")]
    DbSpecificError(String),
    #[error("Database error: {0}")]
    DbError(#[from] duckdb::Error),
    #[error("Kuzu database error: {0}")]
    KuzuDbError(#[from] kuzu::Error),
    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
    #[error("IO error: {0}")]
    IoError(#[from] io::Error),
    #[error("Mutex poisoning error: {0}")] // << --- 이 줄 추가
    MutexPoisoned(String),
    #[error("Custom error: {0}")]
    Custom(String),
}

pub type AppResult<T> = Result<T, AppError>;
impl<T> From<PoisonError<T>> for AppError {
    fn from(err: PoisonError<T>) -> Self {
        AppError::MutexPoisoned(err.to_string())
    }
}
