# 온톨로지: `kuzudb::models`

## 1. 핵심 개념

`kuzudb::models` 모듈은 데이터베이스 스키마에 대응하는 Rust 구조체를 정의하는 곳입니다. 이 모듈의 구조체들은 데이터베이스와 Rust 코드 간의 데이터 전송 객체(DTO) 역할을 수행하며, 타입 안정성을 보장하고 데이터 처리를 용이하게 합니다.

- **`Note` 구조체**: KuzuDB의 `Note` 노드 테이블 스키마를 Rust 코드로 표현한 것입니다.
- **데이터 직렬화/역직렬화**: `serde`의 `Serialize`와 `Deserialize`를 derive하여, Rust 구조체를 JSON으로 변환하거나 그 반대의 작업을 자동으로 처리할 수 있습니다. 이는 Tauri의 프론트엔드-백엔드 간 통신에 필수적입니다.
- **타입 매핑**: 데이터베이스의 데이터 타입(예: `STRING`, `DATETIME`)을 Rust의 타입(예: `String`, `DateTime<Utc>`)으로 매핑합니다.

## 2. 활용처 (Usage)

- **데이터 삽입**: `kuzudb::db::insert_note` 함수는 `&Note` 구조체를 인자로 받아, 내부에서 Cypher 쿼리를 생성하여 데이터베이스에 노드를 추가합니다.
- **데이터 조회**: (향후 구현) 데이터베이스에서 노드를 조회한 결과를 `Note` 구조체로 변환하여 Rust 코드 내에서 쉽게 다룰 수 있습니다.
- **API 경계**: Tauri 커맨드에서 프론트엔드로부터 데이터를 받거나(`Deserialize`), 프론트엔드로 데이터를 보낼 때(`Serialize`) 사용됩니다.

## 3. 변경 이력

- **25.08.26**:
    - `Note` 구조체 정의.
    - `serde::{Serialize, Deserialize}` 및 `chrono::DateTime` 적용.
    - 계획 단계의 `models/note.rs`에서 `kuzudb/models.rs`로 위치 및 이름이 변경됨.
