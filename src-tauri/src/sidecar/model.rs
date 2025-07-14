/// 프론트에 보내는 파이선 리스폰스 구조체
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct PythonResponse {
    pub status: String,
    pub result: Option<String>,
    pub message: Option<String>,
}
