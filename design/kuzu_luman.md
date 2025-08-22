## 1. 프로젝트 개요
프로젝트명: Kuzu 기반 제텔카스텐 시스템 백엔드
목표: 루만식 노트 관리 시스템의 핵심 철학인 '유기적 연결'과 '선형적 흐름'을 Kuzu 내장형 그래프 데이터베이스를 활용하여 구현한다. 사용자가 별도 서버 없이 로컬에서 빠르고 안정적으로 노트를 관리할 수 있는 백엔드 시스템을 구축한다.

## 2. 데이터 모델링
모든 노트는 Kuzu의 노드(Node)로 모델링하고, 노트 간의 논리적 관계는 관계(Relationship)로 구현한다.

노드(Nodes)

레이블: :Note

속성(Properties):

id: 노트의 고유 ID (문자열)

title: 노트의 제목 (문자열)

content: 노트의 내용 (문자열)

level: 계층 구조의 깊이 (정수)

관계(Relationships)

:NEXT / :PREV: 같은 계층 내의 노트 간에 선형적 순서를 나타내는 관계. 양방향 관계.

:CHILD_OF / :PARENT_OF: 노트 간의 계층적 종속성을 나타내는 관계. 양방향 관계.

## 3. 핵심 백엔드 기능 및 로직
모든 핵심 기능은 Kuzu에 Cypher 쿼리를 전송하여 실행된다.

### 3.1 노트 추가 및 삭제
루트 노트 추가 (addRootNote):

현재 가장 마지막 루트 노드를 조회한다.

새로운 노드를 생성하고, 조회된 노드의 :NEXT 관계로 연결한다.

level은 0으로 설정한다.

자식 노트 추가 (addChildNote):

부모 노드를 조회한다.

새로운 노드를 생성하고, 부모 노드와 :CHILD_OF 관계로 연결한다.

부모 노드의 기존 자식 노드들과 :NEXT 관계로 연결한다.

level은 부모.level + 1로 설정한다.

중간에 노트 삽입 (addAfterNote):

삽입 위치의 노트 (afterNote)와 그 다음 노트 (nextNote)를 조회한다.

새로운 노드를 생성하고, afterNote와 nextNote 사이에 :NEXT 관계로 삽입한다.

renumberNotes 로직을 실행하여 모든 노드의 ID를 재정렬한다.

### 3.2 노트 ID 재정렬 및 순회 (renumberNotes)
루만의 철학인 '유기성'을 구현하는 가장 중요한 로직이다. 모든 노트 추가/삭제 후 이 함수를 실행한다.

로직: Kuzu에 저장된 모든 노드를 깊이 우선 탐색(Depth-First Traversal) 방식으로 순회하며, 순회 순서에 맞게 노트의 id와 level 속성을 재할당한다.

Cypher 쿼리 예시: MATCH (n:Note) WITH n ORDER BY n.some_logical_order...와 같이 순서가 보장되는 쿼리를 사용하여, 모든 노트의 id와 level 속성을 SET 명령어로 업데이트한다.

### 3.3 노트 조회 및 탐색
단일 노트 조회 (findNote):

Cypher 쿼리: MATCH (n:Note {id: '1.2.1'}) RETURN n

전체 노트 순회 (displayNotes):

Kuzu에 깊이 우선 탐색 쿼리를 보내 모든 노드를 정렬된 상태로 가져온다.

가져온 데이터를 바탕으로 프론트엔드에서 level 속성을 활용해 들여쓰기를 적용하여 출력한다.

논리적 다음 노트 찾기 (getNextNode):

Cypher 쿼리: 현재 노드에서 자식 노드, 다음 형제 노드, 부모의 다음 형제 노드를 순차적으로 탐색하는 쿼리를 작성한다.

예시: MATCH (n:Note {id: '1.2.1'}) OPTIONAL MATCH (n)-[:CHILD_OF]->(:Note)-[:NEXT]->(next) RETURN n, next와 같이 OPTIONAL MATCH를 활용해 복잡한 논리를 표현한다.

## 4. 기술 스택
백엔드 언어: Node.js, Python, C++ 등 Kuzu를 지원하는 언어

데이터베이스: Kuzu Embedded

API: REST API 또는 GraphQL을 활용하여 프론트엔드와 통신

