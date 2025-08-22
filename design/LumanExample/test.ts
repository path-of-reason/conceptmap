import { NoteLinkedList } from "./Note";

function run() {
  const z = new NoteLinkedList();

  // 1) 루트 삽입
  const r1 = z.addRootNote("루트1", "r1");
  const r2 = z.addRootNote("루트2", "r2");
  const r3 = z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");
  z.addRootNote("루트3", "r3");

  z.displayNotes();
  // 2) 자식 삽입
  const c11 = z.addChildNote(r1, "r1-자식1", "c11");
  const c12 = z.addChildNote(r1, "r1-자식2", "c12");
  const c121 = z.addChildNote(c12, "r1-자식2-자식1", "c121");
  const c122 = z.addChildNote(c12, "r1-자식2-자식2", "c122");
  z.displayNotes();

  // 3) 중간 삽입 (루트 레벨)
  const afterR1 = z.addAfterNote(r1.persistentId, "루트1 뒤 삽입", "r1a");

  // 4) 중간 삽입 (자식 레벨)
  const afterC11 = z.addAfterNote(c11.persistentId, "r1-자식1 뒤 삽입", "c11a");

  console.log("=== Display ===");
  z.displayNotes();

  console.log("\n=== 검증 (눈으로 확인) ===");
  console.log("- 루트 순서: 루트1 -> (루트1 뒤 삽입) -> 루트2 -> 루트3");
  console.log("- r1의 자식 순서: r1-자식1 -> (r1-자식1 뒤 삽입) -> r1-자식2");
  console.log("- r1-자식2의 자식 순서: r1-자식2-자식1 -> r1-자식2-자식2");
}

run();
