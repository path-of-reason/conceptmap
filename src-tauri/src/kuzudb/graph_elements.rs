use super::error::KuzuError::{DriverError, IoError};
use super::pool::KuzuPool;
use crate::kuzudb::models::{KnowledgeGraphNode, KnowledgeGraphRelation};
use crate::{
    error::{AppError, AppResult},
    kuzudb::error::KuzuError,
};
use kuzu::{Connection, LogicalType, Value};
use serde_json;
use std::sync::Arc;

pub fn create_knowledge_graph_schema(pool: &Arc<KuzuPool>) -> AppResult<()> {
    let db_guard = pool.db.lock().map_err(AppError::from)?;
    let conn = Connection::new(&db_guard).map_err(DriverError)?;

    conn.query("INSTALL json;").map_err(DriverError)?;
    conn.query("LOAD json;").map_err(DriverError)?;
    println!("[INFO] Kuzu JSON Extension 설치 및 로드 완료.");

    conn.query(
        "CREATE NODE TABLE IF NOT EXISTS KnowledgeGraphNode (
            id SERIAL PRIMARY KEY,
            name STRING,
            node_type STRING,
            properties JSON
        )",
    ).map_err(DriverError)?;
    println!("[INFO] Kuzu Node Table 'KnowledgeGraphNode' 로드 완료.");

    conn.query("CREATE REL TABLE IF NOT EXISTS IS_A (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'IS_A' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS PART_OF (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'PART_OF' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS INSTANCE_OF (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'INSTANCE_OF' 로드 완료.");

    conn.query("CREATE REL TABLE IF NOT EXISTS RELATED_TO (FROM KnowledgeGraphNode TO KnowledgeGraphNode, properties STRING)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'RELATED_TO' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS DEFINES (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'DEFINES' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS REFERS_TO (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'REFERS_TO' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS SYNONYM_OF (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'SYNONYM_OF' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS CAUSES (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'CAUSES' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS HAS_PROPERTY (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'HAS_PROPERTY' 로드 완료.");
    conn.query("CREATE REL TABLE IF NOT EXISTS LOCATED_IN (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'LOCATED_IN' 로드 완료.");

    conn.query("CREATE REL TABLE IF NOT EXISTS AUTHORED_BY (FROM KnowledgeGraphNode TO KnowledgeGraphNode)")
        .map_err(DriverError)?;
    println!("[INFO] Kuzu Relationship Table 'AUTHORED_BY' 로드 완료.");

    Ok(())
}

pub fn create_knowledge_node(
    pool: &Arc<KuzuPool>,
    node: &KnowledgeGraphNode,
) -> AppResult<KnowledgeGraphNode> {
    let db_guard = pool.db.lock().map_err(AppError::from)?;
    let conn = Connection::new(&db_guard).map_err(DriverError)?;

    let create_query =
        "CREATE (:KnowledgeGraphNode {name: $name, node_type: $node_type, properties: $properties})";
    let mut prepared_create_query = conn.prepare(create_query).map_err(DriverError)?;

    let create_params:Vec<(&str, Value)> = vec![
        ("name", Value::String(node.name.clone())),
        ("node_type", Value::String(node.node_type.clone())),
        ("properties", node.properties
            .as_ref()
            .map(|json_val| serde_json::to_string(json_val)
                .map_err(|e| KuzuError::Custom(format!("Failed to serialize properties (JSON to String): {}", e))))
            .transpose()?.map_or(Value::Null(LogicalType::String), Value::String))
    ];
    conn.execute(&mut prepared_create_query, create_params).map_err(DriverError)?;

    let retrieve_query =
        "MATCH (n:KnowledgeGraphNode)
        WHERE n.name = $name AND n.node_type = $node_type
        RETURN n.id, n.name, n.node_type, n.properties
        ORDER BY n.id DESC LIMIT 1";
    let mut prepared_retrieve_query = conn.prepare(retrieve_query).map_err(DriverError)?;
    let retrieve_params: Vec<(&str, Value)> = vec![
        ("name", Value::String(node.name.clone())),
        ("node_type", Value::String(node.node_type.clone())),
    ];
    let mut result_iter = conn.execute(&mut prepared_retrieve_query, retrieve_params).map_err(DriverError)?;

    if let Some(row_result) = result_iter.next() {
        match row_result {
            Ok(row) => {
                let id = match row.get(0).unwrap() {
                    Value::Int64(val) => Ok(Some(*val)),
                    _ => Err(KuzuError::Custom(format!("Expected Int64 for ID but found different type"))),
                }?;
                let name = match row.get(1).unwrap() {
                    Value::String(val) => Ok(val.clone()),
                    _ => Err(KuzuError::Custom(format!("Expected String for Name but found different type")))
                }?;
                let node_type = match row.get(2).unwrap() {
                    Value::String(val) => Ok(val.clone()),
                    _ => Err(KuzuError::Custom(format!("Expected String for NodeType but found different type")))
                }?;
                let properties = match row.get(3).unwrap() {
                    Value::String(val_str) => serde_json::from_str::<serde_json::Value>(&val_str).map(Some)
                            .map_err(|e| KuzuError::Custom(format!("Failed to deserialize properties from JSON string: {}", e))),
                    Value::Null(_) => Ok(None),
                    _ => Err(KuzuError::Custom(format!("Expected String or Null for Properties but found different type")))
                }?;
                Ok(KnowledgeGraphNode {
                    id: id,
                    name: name,
                    node_type: node_type,
                    properties: properties,
                })
            },
            Err(e) => Err(AppError::from(KuzuError::from(e)))
        }
    } else {
        Err(AppError::Custom("Failed to retrieve created knowledge node.".to_string()))
    }
}
