use serde::{Deserialize, Serialize};

// ✨ 추가: 저자 정보와 역할을 함께 받기 위한 입력용 구조체
#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct AuthorPayload {
    pub name: String,
    pub role: Option<String>,
}

pub mod create {
    use super::AuthorPayload; // ✨ `super`를 통해 같은 파일 내의 AuthorPayload를 가져옴
    use serde::Deserialize;

    #[derive(Deserialize, Debug, Default)]
    pub struct IndexCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub reference: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct MainCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub reference: Vec<String>,
        pub tags: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct BiblioCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub authors: Vec<AuthorPayload>,
        pub published_at: String,
        pub sub_type: String,
        pub cover_url: Option<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct QuoteCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub content: String,
        pub authors: Vec<AuthorPayload>,
        pub tags: Vec<String>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct HrCard {
        pub parent: String,
        pub prev: Option<String>,
        pub title: String,
        pub sub_type: String,
    }
}
pub mod update {
    use super::AuthorPayload; // ✨ `super`를 통해 같은 파일 내의 AuthorPayload를 가져옴
    use serde::Deserialize;

    #[derive(Deserialize, Debug, Default)]
    pub struct MainCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub reference: Option<Vec<String>>,
        pub tags: Option<Vec<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct BiblioCard {
        pub title: Option<String>,
        pub authors: Option<Vec<AuthorPayload>>,
        pub published_at: Option<String>,
        pub sub_type: Option<String>,
        pub cover_url: Option<Option<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct QuoteCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub authors: Option<Vec<AuthorPayload>>,
        pub tags: Option<Vec<String>>,
    }

    #[derive(Deserialize, Debug, Default)]
    pub struct IndexCard {
        pub title: Option<String>,
        pub content: Option<String>,
        pub reference: Option<Vec<String>>,
    }
}
