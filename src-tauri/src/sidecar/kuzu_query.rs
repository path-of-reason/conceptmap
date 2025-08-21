use crate::error::AppError; // 전역 AppError 임포트 [cite: src/error.rs]
use crate::kuzudb::graph_elements; // Kuzu 그래프 요소 CRUD 함수 임포트 [cite: src/kuzudb/graph_elements.rs]
use crate::kuzudb::models::{KnowledgeGraphNode, KnowledgeGraphRelation}; // Kuzu 모델 임포트 [cite: src/kuzudb/models.rs]
use crate::kuzudb::pool::KuzuPool; // Kuzu 연결 풀 임포트 [cite: src/kuzudb/pool.rs]
use serde_json::json;
use std::path::PathBuf;
use tokio::time::{self, Duration}; // 비동기 지연을 위해 tokio::time 사용

pub async fn kuzu_test() -> Result<(), Box<dyn std::error::Error>> {
    let db_file_path = PathBuf::from("kuzu_db");

    // 기존 데이터베이스 디렉토리 삭제 (테스트를 위해, 실제 프로덕션에서는 주의)
    // let _ = std::fs::remove_dir_all(&db_dir_path);

    let kuzu_pool_arc = KuzuPool::new(db_file_path)?;
    // println!("[INFO] Kuzu Knowledge Graph Database 초기화 및 연결 완료.");

    // Knowledge Graph 스키마 생성
    graph_elements::create_knowledge_graph_schema(&kuzu_pool_arc).await?;
    // println!("[INFO] Kuzu Knowledge Graph 스키마 생성 완료.");

    // CREATE: 새 KnowledgeGraphNode 생성 (Concept 타입)
    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Concept) ---");
    let concept_node1 = KnowledgeGraphNode {
        id: None, // 자동 할당될 ID
        name: "인공지능".to_string(),
        node_type: "Concept".to_string(),
        properties: Some(json!({"definition": "인간의 학습 및 문제 해결 능력을 모방하는 기술"})),
    };
    let created_concept1 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &concept_node1).await?;
    println!("Created Concept Node: {:?}", created_concept1);
    let concept1_id = created_concept1
        .id
        .expect("Concept Node ID should be present.");

    let concept_node2 = KnowledgeGraphNode {
        id: None,
        name: "머신러닝".to_string(),
        node_type: "Concept".to_string(),
        properties: Some(
            json!({"definition": "데이터를 통해 학습하여 예측/결정하는 인공지능의 한 분야"}),
        ),
    };
    let created_concept2 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &concept_node2).await?;
    println!("Created Concept Node: {:?}", created_concept2);
    let concept2_id = created_concept2
        .id
        .expect("Concept Node ID should be present.");

    // CREATE: 새 KnowledgeGraphNode 생성 (Term 타입)
    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Term) ---");
    let term_node1 = KnowledgeGraphNode {
        id: None,
        name: "AI".to_string(),
        node_type: "Term".to_string(),
        properties: Some(json!({"language": "English", "is_acronym": true})),
    };
    let created_term1 = graph_elements::create_knowledge_node(&kuzu_pool_arc, &term_node1).await?;
    println!("Created Term Node: {:?}", created_term1);
    let term1_id = created_term1.id.expect("Term Node ID should be present.");

    // CREATE: 새 KnowledgeGraphNode 생성 (Instance 타입)
    println!("\n--- Kuzu CREATE KnowledgeGraphNode (Instance) ---");
    let instance_node1 = KnowledgeGraphNode {
        id: None,
        name: "GPT-4".to_string(),
        node_type: "Instance".to_string(),
        properties: Some(json!({"developer": "OpenAI", "version": "4.0"})),
    };
    let created_instance1 =
        graph_elements::create_knowledge_node(&kuzu_pool_arc, &instance_node1).await?;
    println!("Created Instance Node: {:?}", created_instance1);
    let instance1_id = created_instance1
        .id
        .expect("Instance Node ID should be present.");

    // CREATE: 새 KnowledgeGraphRelation 생성 (IS_A 관계)
    // println!("\n--- Kuzu CREATE KnowledgeRelation (IS_A) ---");
    // let rel_is_a = KnowledgeGraphRelation {
    //     from_node_id: concept2_id,    // 머신러닝
    //     to_node_id: concept1_id,      // 인공지능
    //     rel_type: "IS_A".to_string(), // IS_A 관계 테이블 사용 [cite: src/kuzudb/graph_elements.rs]
    //     properties: Some(r#"{"strength": 0.9}"#.to_string()),
    // };
    // let created_rel_is_a =
    //     graph_elements::create_knowledge_relation(&kuzu_pool_arc, &rel_is_a).await?;
    // println!(
    //     "Created IS_A relation (Machine Learning IS_A AI): {}",
    //     created_rel_is_a
    // );

    // // CREATE: 새 KnowledgeGraphRelation 생성 (DEFINES 관계)
    // println!("\n--- Kuzu CREATE KnowledgeRelation (DEFINES) ---");
    // let rel_defines = KnowledgeGraphRelation {
    //     from_node_id: term1_id,          // AI
    //     to_node_id: concept1_id,         // 인공지능
    //     rel_type: "DEFINES".to_string(), // DEFINES 관계 테이블 사용 [cite: src/kuzudb/graph_elements.rs]
    //     properties: Some(r#"{"source_language": "English"}"#.to_string()),
    // };
    // let created_rel_defines =
    //     graph_elements::create_knowledge_relation(&kuzu_pool_arc, &rel_defines).await?;
    // println!(
    //     "Created DEFINES relation (AI DEFINES 인공지능): {}",
    //     created_rel_defines
    // );

    // // CREATE: 새 KnowledgeGraphRelation 생성 (INSTANCE_OF 관계)
    // println!("\n--- Kuzu CREATE KnowledgeRelation (INSTANCE_OF) ---");
    // let rel_instance_of = KnowledgeGraphRelation {
    //     from_node_id: instance1_id,          // GPT-4
    //     to_node_id: concept1_id,             // 인공지능
    //     rel_type: "INSTANCE_OF".to_string(), // INSTANCE_OF 관계 테이블 사용 [cite: src/kuzudb/graph_elements.rs]
    //     properties: Some(r#"{"version_info": "latest"}"#.to_string()),
    // };
    // let created_rel_instance_of =
    //     graph_elements::create_knowledge_relation(&kuzu_pool_arc, &rel_instance_of).await?;
    // println!(
    //     "Created INSTANCE_OF relation (GPT-4 INSTANCE_OF 인공지능): {}",
    //     created_rel_instance_of
    // );

    // // READ ALL: 모든 KnowledgeGraphNode 조회
    // println!("\n--- Kuzu READ ALL KnowledgeNodes ---");
    // let all_nodes = graph_elements::get_all_knowledge_nodes(&kuzu_pool_arc).await?;
    // println!("All Kuzu nodes:");
    // for node in &all_nodes {
    //     // 참조로 순회하여 소유권 이동 방지
    //     println!("- {:?}", node);
    // }

    // // READ BY TYPE: 특정 타입의 KnowledgeGraphNode 조회 (Concept 타입)
    // println!("\n--- Kuzu READ KnowledgeNodes by Type 'Concept' ---");
    // let concept_nodes_list =
    //     graph_elements::get_knowledge_nodes_by_type(&kuzu_pool_arc, "Concept").await?;
    // println!("'Concept' Kuzu nodes:");
    // for node in &concept_nodes_list {
    //     // 참조로 순회
    //     println!("- {:?}", node);
    // }

    // // UPDATE: KnowledgeGraphNode 속성 업데이트 (인공지능 개념에 정의 추가)
    // println!("\n--- Kuzu UPDATE KnowledgeGraphNode Properties ---");
    // let updated_properties_ai = r#"{"definition": "인간의 지적 능력을 모방하는 기술. 학습, 추론, 문제 해결 등", "last_updated": "2025-06-16"}"#;
    // let updated_ai_node = graph_elements::update_knowledge_node_properties(
    //     &kuzu_pool_arc,
    //     concept1_id,
    //     updated_properties_ai,
    // )
    // .await?;
    // println!(
    //     "Kuzu Node with ID {} updated: {}",
    //     concept1_id, updated_ai_node
    // );

    // // 업데이트된 노드 다시 조회하여 확인
    // let retrieved_updated_node_list =
    //     graph_elements::get_knowledge_nodes_by_type(&kuzu_pool_arc, "Concept").await?;
    // println!(
    //     "Updated Kuzu node details (Concept type): {:?}",
    //     retrieved_updated_node_list
    // );

    // // DELETE: KnowledgeGraphNode 삭제 (GPT-4 인스턴스 삭제)
    // println!("\n--- Kuzu DELETE KnowledgeGraphNode (Instance) ---");
    // let deleted = graph_elements::delete_knowledge_node(&kuzu_pool_arc, instance1_id).await?;
    // println!("Kuzu Node with ID {} deleted: {}", instance1_id, deleted);

    // // 삭제 후 모든 노드 다시 조회하여 확인
    // let remaining_nodes_list = graph_elements::get_all_knowledge_nodes(&kuzu_pool_arc).await?;
    // println!("Kuzu Nodes after deletion:");
    // for node in &remaining_nodes_list {
    //     // 참조로 순회
    //     println!("- {:?}", node);
    // }

    // // 추가적인 지식 그래프 쿼리 예시 (직접 Kuzu Connection 사용)
    // println!("\n--- Additional Kuzu Graph Queries ---");
    // let db_guard_for_query = kuzu_pool_arc.db.lock().map_err(AppError::from)?;
    // let conn_for_query = Connection::new(&db_guard_for_query).map_err(DriverError)?;

    // // '인공지능'과 관련된 모든 노드 및 관계 조회 (2-hop까지)
    // println!("\nNodes and relations connected to '인공지능' (up to 2-hop):");
    // let mut prepared_ai_rels_query = conn_for_query.prepare("MATCH p = (n:KnowledgeGraphNode)-[*1..2]-(m:KnowledgeGraphNode) WHERE n.name = $name RETURN n.name, p").map_err(DriverError)?;
    // let params_ai_rels = vec![("name", Value::String("인공지능".to_string()))];
    // let mut query_result_ai_rels = conn_for_query
    //     .execute(&mut prepared_ai_rels_query, params_ai_rels)
    //     .map_err(DriverError)?;
    // println!("{}", query_result_ai_rels.display()); // Kuzu QueryResult::display() 사용 [cite: tutorials/rust.md]

    // // 'Concept' 타입 노드 중 '러닝'이 들어가는 노드 조회 (텍스트 검색)
    // println!("\n'Concept' nodes with '러닝' in name:");
    // let mut prepared_learning_query = conn_for_query.prepare("MATCH (n:KnowledgeGraphNode) WHERE n.node_type = 'Concept' AND n.name =~ '.*러닝.*' RETURN n.name").map_err(DriverError)?;
    // let params_learning: Vec<(&str, Value)> = Vec::new(); // 파라미터 없음
    // let mut query_result_learning = conn_for_query
    //     .execute(&mut prepared_learning_query, params_learning)
    //     .map_err(DriverError)?;
    // println!("{}", query_result_learning.display());

    time::sleep(Duration::from_secs(1)).await; // 짧은 지연 [cite: duck_query.rs]
    Ok(())
}
