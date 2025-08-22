import { Note, NoteLinkedList } from "./Note"; // 앞에서 개선한 파일

function log(msg: any) {
  // 간단 출력 헬퍼
  if (typeof msg === "string") console.log(msg);
  else console.dir(msg, { depth: 10 });
}

// 1. 트리 구축
const z = new NoteLinkedList();
const root1 = z.addRootNote("루트1", "r1");
const root2 = z.addRootNote("루트2", "r2");
const child11 = z.addChildNote(root1, "r1-자식1", "c11");
const child12 = z.addChildNote(root1, "r1-자식2", "c12");
const child13 = z.addChildNote(root1, "r1-자식3", "c13");

console.log(z.getDisplayId(child13));
log("--- 앵커 지정 전 displayIdCache ---");
z.displayNotesCached(); // 전부 undefined로 나올 것

// 2. 루트1을 앵커로 지정, 하위 전체 번호 갱신
z.markAsAnchor(root1);
log("--- 루트1을 앵커 등록 후 ---");
z.displayNotesCached(); // 루트1과 그 하위만 표시Id 노출
const note = z.findNoteByDisplayId("1.2");
if (note) {
  console.log("1.2 번 찾은 노트:", note.title);
} else {
  console.log("해당 표시ID의 노트가 없습니다.");
}

// 3. 국소 삽입 및 넘버링 확인
const inserted = z.addAfterNote(child12.persistentId, "r1-자식2a", "c12a");
log("--- r1-자식2 뒤에 삽입 후(루트1 하위 국소 update) ---");
z.displayNotesCached(); // 1.1, 1.2, 1.3(신규), 1.4(기존 1.3) 등 확인

// 4. 루트2를 별도 앵커로 등록
z.markAsAnchor(root2);
log("--- 루트2을 별도 앵커 등록 후 ---");
z.displayNotesCached(); // 루트2 및 그 하위만 번호 생김

// 5. 루트2 하위에 자식 추가 후 캐시국소변화 확인
const c21 = z.addChildNote(root2, "r2-자식1", "r2c1");
log("--- 루트2 하위에 자식 추가 후 ---");
z.displayNotesCached(); // 루트2.1 생성 확인

// 6. 부분 앵커: 특정 자식만 단독 앵커로 잡을 수도 있음
z.markAsAnchor(child13);
log("--- r1-자식3만 단독 앵커 지정 후 ---");
z.displayNotesCached(); // r1-자식3과 그 아래만 displayId 보임

// 7. displayIdCache 내용 직접 확인
log("--- displayIdCache mapping(내부 구조 그대로 확인) ---");
log(z["displayIdCache"]);

// 8. 노드들의 displayId 직접 개별 조회
log("--- 각 노드의 displayId ---");
[root1, root2, child11, child12, child13, inserted!, c21!].forEach((n) => {
  log(`"${n.title}" displayId: ${z.getDisplayId(n)}`);
});
