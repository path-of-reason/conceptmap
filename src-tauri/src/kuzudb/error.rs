use crate::error::AppError;
use kuzu;
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum KuzuError {
    #[error("Kuzu driver error: {0}")]
    DriverError(#[from] kuzu::Error),
    #[error("IO error during Kuzu operation: {0}")]
    IoError(#[from] io::Error),
    #[error("Kuzu custom error: {0}")]
    Custom(String),
}

impl From<KuzuError> for AppError {
    fn from(err: KuzuError) -> Self {
        AppError::DbSpecificError(format!("Kuzu error: {}", err))
    }
}