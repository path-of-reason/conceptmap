use crate::error::AppError;
use crate::kuzudb::graph_elements;
use crate::kuzudb::models::{KnowledgeGraphNode, KnowledgeGraphRelation};
use crate::kuzudb::pool::KuzuPool;
use serde_json::json;
use std::path::PathBuf;
use std::thread;
use std::time::Duration;
use kuzu::{Connection, Value, LogicalType};

#[tauri::command]
pub fn kuzu_test() -> Result<(), Box<dyn std::error::Error>> {
    let db_file_path = PathBuf::from("kuzu_db");

    let kuzu_pool_arc = KuzuPool::new(db_file_path)?;

    graph_elements::create_knowledge_graph_schema(&kuzu_pool_arc)?;

    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Concept) ---");
    let concept_node1 = KnowledgeGraphNode {
        id: None,
        name: "인공지능".to_string(),
        node_type: "Concept".to_string(),
        properties: Some(json!({"definition": "인간의 학습 및 문제 해결 능력을 모방하는 기술"})),
    };
    let created_concept1 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &concept_node1)?;
    println!("Created Concept Node: {:?}", created_concept1);
    let concept1_id = created_concept1
        .id
        .expect("Concept Node ID should be present.");

    let concept_node2 = KnowledgeGraphNode {
        id: None,
        name: "머신러닝".to_string(),
        node_type: "Concept".to_string(),
        properties: Some(
            json!({"definition": "데이터를 통해 학습하여 예측/결정하는 인공지능의 한 분야"})
        ),
    };
    let created_concept2 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &concept_node2)?;
    println!("Created Concept Node: {:?}", created_concept2);
    let concept2_id = created_concept2
        .id
        .expect("Concept Node ID should be present.");

    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Term) ---");
    let term_node1 = KnowledgeGraphNode {
        id: None,
        name: "AI".to_string(),
        node_type: "Term".to_string(),
        properties: Some(json!({"language": "English", "is_acronym": true})),
    };
    let created_term1 = graph_elements::create_knowledge_node(&kuzu_pool_arc, &term_node1)?;
    println!("Created Term Node: {:?}", created_term1);
    let term1_id = created_term1.id.expect("Term Node ID should be present.");

    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Instance) ---");
    let instance_node1 = KnowledgeGraphNode {
        id: None,
        name: "GPT-4".to_string(),
        node_type: "Instance".to_string(),
        properties: Some(json!({"developer": "OpenAI", "version": "4.0"})),
    };
    let created_instance1 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &instance_node1)?;
    println!("Created Instance Node: {:?}", created_instance1);
    let instance1_id =
        created_instance1.id.expect("Instance Node ID should be present.");

    println!("\n--- Additional Kuzu Graph Queries ---");
    let db_guard_for_query = kuzu_pool_arc.db.lock().map_err(AppError::from)?;
    let conn_for_query = Connection::new(&db_guard_for_query).map_err(Box::new)?;

    println!("\nNodes and relations connected to \"인공지능\" (up to 2-hop):");
    let mut prepared_ai_rels_query = conn_for_query.prepare("MATCH p = (n:KnowledgeGraphNode)-[*1..2]-(m:KnowledgeGraphNode) WHERE n.name = $name RETURN n.name, p ").map_err(Box::new)?;
    let params_ai_rels = vec![("name", Value::String("인공지능".to_string()))];
    let query_result_ai_rels = conn_for_query
        .execute(&mut prepared_ai_rels_query, params_ai_rels)
        .map_err(Box::new)?;
    for row in query_result_ai_rels {
        println!("{:?}", row);
    }

    println!("\n\"Concept\" nodes with \"러닝\" in name:");
    let mut prepared_learning_query = conn_for_query.prepare("MATCH (n:KnowledgeGraphNode) WHERE n.node_type = 'Concept' AND n.name =~ '.*러닝.*' RETURN n.name ").map_err(Box::new)?;
    let params_learning: Vec<(&str, Value)> = Vec::new();
    let query_result_learning = conn_for_query
        .execute(&mut prepared_learning_query, params_learning)
        .map_err(Box::new)?;
    for row in query_result_learning {
        println!("{:?}", row);
    }

    thread::sleep(Duration::from_secs(1));
    Ok(())
}