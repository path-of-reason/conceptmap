use serde::{Deserialize, Serialize};
use serde_json::Value as SerdeJsonValue;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeGraphNode {
    /// 데이터베이스에서 자동 생성되므로, 생성 시에는 None으로 설정될 수 있습니다.
    pub id: Option<i64>,
    pub name: String,
    pub node_type: String,
    pub properties: Option<SerdeJsonValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnowledgeGraphRelation {
    pub from_node_id: i64,
    pub to_node_id: i64,
    pub rel_type: String,
    pub properties: String,
}

// 필요하다면 Kuzu의 QueryResult에서 값을 쉽게 가져오기 위한 Trait 확장도 고려할 수 있습니다.
// 하지만 현재 단계에서는 kuzu 크레이트가 제공하는 get_string(), get_i64() 등을 직접 사용합니다.
