use chrono::{DateTime, Utc};
use kuzu::{LogicalType, Value};
use time::OffsetDateTime;

pub fn option_string_to_value(opt_str: &Option<String>) -> Value {
    match opt_str {
        Some(s) => Value::String(s.clone()),
        None => Value::Null(LogicalType::String),
    }
}

pub fn chrono_to_odt(dt: &DateTime<Utc>) -> OffsetDateTime {
    OffsetDateTime::from_unix_timestamp_nanos(dt.timestamp_nanos_opt().unwrap().into()).unwrap()
}

pub fn extract_string(v: &kuzu::Value) -> Option<String> {
    match v {
        kuzu::Value::String(s) => Some(s.clone()),
        kuzu::Value::Null(_) => None,
        _ => None,
    }
}
pub fn extract_timestamp(v: &kuzu::Value) -> Option<chrono::DateTime<chrono::Utc>> {
    match v {
        kuzu::Value::Timestamp(dt) => {
            let s = dt.to_string();
            // "+00:00:00"을 "+00:00"으로 잘라서 정상 파싱
            let s_fixed = if s.ends_with(":00") {
                let len = s.len();
                s[..len - 3].to_string()
            } else {
                s.clone()
            };
            let fmt = "%Y-%m-%d %H:%M:%S%.f %z";
            match chrono::DateTime::parse_from_str(&s_fixed, fmt) {
                Ok(dt) => Some(dt.with_timezone(&chrono::Utc)),
                Err(e) => {
                    eprintln!("PARSE FAIL : {}", e);
                    None
                }
            }
        }
        kuzu::Value::String(s) => chrono::DateTime::parse_from_rfc3339(s)
            .ok()
            .map(|dt| dt.with_timezone(&chrono::Utc)),
        v => {
            eprintln!("WARN: 예기치 않은 timestamp 타입: {:?}", v);
            None
        }
    }
}
