# 계층적 관계 (Hierarchical Relations):

IS_A (Subclass-of / Type-of): 가장 기본적인 상위-하위 개념 관계.
예: (고양이)-[:IS_A]->(포유류)
PART_OF / HAS_PART (Part-Whole Relations): 전체-부분 관계.
예: (자동차)-[:HAS_PART]->(엔진), (엔진)-[:PART_OF]->(자동차)
INSTANCE_OF (Individual-Class Relations): 개별적인 사례가 특정 클래스/개념의 인스턴스임을 나타냄.
예: (내 노트북)-[:INSTANCE_OF]->(노트북 컴퓨터)
CATEGORY_OF: 특정 노드가 다른 노드의 범주를 나타냄. (IS_A와 유사하나, 좀 더 분류적인 의미)
예: (스포츠카)-[:CATEGORY_OF]->(자동차)
연관성/의미론적 관계 (Associative / Semantic Relations):

RELATED_TO / ASSOCIATED_WITH: 가장 일반적인 연관 관계. 구체적인 관계 의미가 불분명할 때 사용.
DEFINES / DEFINED_BY: 개념이 용어에 의해 정의되거나, 용어가 개념을 정의함.
예: (인공지능)-[:DEFINED_BY]->(AI)
REFERS_TO / MENTIONS: 특정 엔티티가 다른 엔티티를 참조하거나 언급함 (이전에 제안했던 MENTIONS는 여기에 해당).
예: (문서)-[:REFERS_TO]->(개념X)
SYNONYM_OF / ALIAS_FOR: 용어가 다른 용어의 동의어/별칭임.
예: (ML)-[:SYNONYM_OF]->(머신러닝)
CONTRASTS_WITH / ANTONYM_OF: 반의어 관계나 대조되는 관계.
예: (참)-[:CONTRASTS_WITH]->(거짓)
CAUSES / EFFECT_OF: 인과 관계.
예: (흡연)-[:CAUSES]->(폐암)
PURPOSE_OF / USED_FOR: 목적이나 용도.
예: (자동차)-[:USED_FOR]->(운송)
HAS_PROPERTY / DESCRIBES: 노드가 특정 속성을 가짐.
예: (사람)-[:HAS_PROPERTY]->(나이)
LOCATED_IN / CONTAINS: 지리적/포함 관계.
예: (서울)-[:LOCATED_IN]->(대한민국), (대한민국)-[:CONTAINS]->(서울)
시간적 관계 (Temporal Relations):

PRECEDES / FOLLOWS: 사건/개념의 시간적 선후 관계.
예: (생산단계)-[:PRECEDES]->(유통단계)
OCCURS_DURING: 특정 기간 동안 발생.
예: (회의)-[:OCCURS_DURING]->(오전)
역할 관계 (Role Relations):

HAS_AUTHOR / AUTHORED_BY: 저자 관계.
예: (책)-[:HAS_AUTHOR]->(작가), (작가)-[:AUTHORED_BY]->(책)
PERFORMS / PERFORMED_BY: 행위와 주체.
예: (수술)-[:PERFORMED_BY]->(의사)
MANAGES / MANAGED_BY: 관리 관계.
예: (팀리더)-[:MANAGES]->(프로젝트)
비교/유사성 관계 (Comparison / Similarity Relations):

SIMILAR_TO / ANALOGOUS_TO: 유사성.
예: (강아지)-[:SIMILAR_TO]->(늑대)

# 지식 그래프 설계를 위한 고려사항:

구체성 vs. 일반성: 관계 타입을 너무 많고 구체적으로 만들면 모델링은 정교해지지만, 쿼리가 복잡해지고 데이터 입력이 어려워질 수 있습니다. 반대로 너무 일반적인 관계(예: RELATED_TO)만 사용하면 그래프의 의미론적 가치가 떨어질 수 있습니다. 이 사이의 균형점을 찾는 것이 중요합니다.
단방향 vs. 양방향: Kuzu의 관계는 기본적으로 방향성을 가집니다. (FROM A TO B)는 A에서 B로 가는 관계를 의미합니다. 만약 B에서 A로 가는 역방향 관계가 동일한 의미를 가진다면, CREATE REL TABLE로 양방향 관계를 따로 정의하거나, 쿼리에서 - (양방향 매칭)을 사용하는 방식을 고려해야 합니다. 의미적으로 역방향 관계가 있다면 IS_A와 HAS_A처럼 명확히 구분하는 것이 좋습니다.
속성 추가: 관계 자체도 속성(예: strength, date_of_relation, source_document)을 가질 수 있음을 기억하세요.
