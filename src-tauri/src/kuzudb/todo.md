### **이전 계획 복기: 2단계 - '역할' 기능 추가**

우리의 원래 계획은 다음과 같았습니다.

> 1단계('간단한 다중 저자')가 완료된 후, `Authored` 관계(Relationship)에 `role: STRING` 속성을 추가한다. 그리고 프론트엔드에서 노트를 생성/수정할 때 이 '역할'을 선택적으로 지정할 수 있도록 API(`payload`)를 확장한다.
>
> 이때, 사용자가 역할을 지정하지 않으면 `role` 속성은 `NULL`(빈 값)로 저장되거나 'author' 같은 기본값으로 저장되도록 처리한다. 이렇게 하면 **기본 사용자는 역할을 신경 쓸 필요가 없고, 고급 사용자만 필요할 때 역할을 지정**할 수 있게 된다.

이 계획의 핵심은 **하위 호환성을 유지하면서 점진적으로 기능을 확장**하는 것입니다.

---

### **토의: '역할' 기능 추가를 위한 구체적인 실행 계획**

위 계획을 실제로 코드에 반영하기 위해, 다음과 같이 각 계층별 수정안을 제안합니다.

#### **1단계: Domain 모델 수정 (`domain/models.rs`)**

*   **`payloads` 수정 (입력 모델 변경):**
    *   단순히 `Vec<String>`으로 저자 이름을 받던 것을, 이름과 역할을 함께 받을 수 있는 새로운 구조체로 변경합니다.
    *   `payloads` 모듈 안에 `AuthorPayload { name: String, role: Option<String> }`와 같은 구조체를 정의합니다.
    *   `payloads::create::BiblioCard`, `payloads::create::QuoteCard` 등의 `authors` 필드 타입을 `Vec<String>`에서 `Vec<AuthorPayload>`로 변경합니다. `update` 페이로드도 동일하게 변경합니다.
*   **`NoteAggregate` 수정 (출력 모델 변경):**
    *   UI에 저자 이름과 역할을 함께 전달하기 위해 `NoteAggregate`의 `authors` 필드도 변경합니다.
    *   최상단에 `Author { name: String, role: Option<String> }` 구조체를 정의합니다.
    *   `NoteAggregate`의 `authors` 필드 타입을 `Vec<String>`에서 `Vec<Author>`로 변경합니다.

#### **2단계: 데이터베이스 스키마 및 Repository 수정**

*   **`domain/schema.rs`:**
    *   `create_schema` 함수에서 `Authored` 관계 테이블을 정의하는 쿼리를 수정하여 `role` 속성을 추가합니다.
      ```cypher
      // 기존
      CREATE REL TABLE IF NOT EXISTS Authored(FROM Person TO Note);
      // 변경
      CREATE REL TABLE IF NOT EXISTS Authored(FROM Person TO Note, role STRING);
      ```
*   **`repository/relations.rs`:**
    *   `link_person_to_note`: `role: Option<&str>` 파라미터를 추가로 받도록 시그니처를 변경합니다. Cypher 쿼리도 `SET r.role = $role` 구문을 추가하여 역할을 저장하도록 수정합니다.
    *   `get_authors_for_note`: 반환 타입을 `Result<Vec<String>>`에서 `Result<Vec<Author>>` (또는 `Result<Vec<(String, Option<String>)>>`)로 변경하고, 쿼리에서 `p.name`과 함께 `r.role`도 가져오도록 수정합니다.
*   **`repository/nodes.rs`:**
    *   `get_all_notes_and_relations`: `Authored` 관계를 가져오는 쿼리를 수정하여 `role` 속성까지 함께 가져옵니다. 반환 튜플의 타입도 `Vec<(String, String)>`에서 `Vec<(String, Option<String>, String)>` (person_name, role, note_id)으로 변경합니다.

#### **3단계: Service 비즈니스 로직 수정 (`service/note.rs`)**

*   **`create_new_note` / `update_note`:**
    *   변경된 `AuthorPayload` 벡터를 순회하면서, `link_person_to_note`를 호출할 때 `role` 정보를 함께 넘겨주도록 로직을 수정합니다.
*   **`get_all_notes` / `get_note_aggregate_by_id`:**
    *   `role` 정보까지 반환하는 새로운 리포지토리 함수를 호출하고, 그 결과를 `NoteAggregate`의 `authors: Vec<Author>` 필드에 맞게 채워 넣도록 로직을 수정합니다.

#### **4. 테스트 코드 수정 (`service/note.rs`의 `#[cfg(test)]`)**

*   `BiblioCard`와 `QuoteCard`를 생성하는 모든 테스트에서, `authors` 필드에 `AuthorPayload` 구조체를 사용하도록 수정합니다.
*   일부 테스트에서는 `role`을 `Some("주 저자".to_string())`로 지정하고, 다른 테스트에서는 `None`으로 두어 두 가지 경우를 모두 검증합니다.
*   결과를 검증하는 `assert_eq!` 구문에서, `NoteAggregate`의 `authors` 필드가 `Author` 구조체의 벡터와 일치하는지 확인하도록 수정합니다.


