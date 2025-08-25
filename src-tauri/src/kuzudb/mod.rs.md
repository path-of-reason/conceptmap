# 온톨로지: `kuzudb::mod`

## 1. 핵심 개념

`kuzudb` 모듈의 루트 파일인 `mod.rs`는 `kuzudb` 크레이트의 공용 인터페이스(public API)를 정의하는 역할을 합니다. `pub mod` 키워드를 사용하여 어떤 하위 모듈들이 `kuzudb` 외부의 다른 모듈(예: `lib.rs`)에서 사용될 수 있는지를 명시합니다.

- **모듈 공개**: `db`, `schema`, `models`, `commands`와 같은 하위 모듈을 외부에 공개하여, 다른 코드에서 `kuzudb::db::KuzuDB`나 `kuzudb::commands::create_note`와 같이 접근할 수 있도록 합니다.
- **캡슐화**: `kuzu_query.rs`와 같이 내부적으로만 사용되는 모듈은 `pub`로 선언하지 않음으로써, 외부로부터의 직접적인 접근을 막고 내부 구현을 숨기는 캡슐화 역할을 수행합니다.

## 2. 활용처 (Usage)

- **크레이트 통합**: `lib.rs`에서 `use crate::kuzudb;` 와 같이 `kuzudb` 모듈 전체를 가져와서 사용합니다.
- **외부 호출**: `lib.rs`에서 `kuzudb::schema::initialize_schema(&db)`나 `kuzudb::commands::create_note`처럼 이 파일을 통해 공개된 모듈의 함수나 구조체에 접근합니다.

## 3. 변경 이력

- **25.08.26**:
    - `kuzudb` 모듈 생성과 함께 `mod.rs` 파일 생성.
    - `commands`, `db`, `models`, `schema`를 `pub` 모듈로 선언.
