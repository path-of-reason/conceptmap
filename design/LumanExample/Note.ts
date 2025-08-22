// Note.ts (LexoRank 버전)
import { nanoid } from "nanoid";
type DisplayIdCache = Map<string, string>;
export type NoteId = string; // 표시용(동적 계산 결과), 저장에는 사용하지 않음
export type RankKey = string;

export class Note {
  constructor(
    public persistentId: string, // 영구 불변 ID (uuid 등)
    public title: string,
    public content: string,
    public rank: RankKey, // 정렬/삽입을 위한 LexoRank 문자열
    public prev: Note | null = null,
    public next: Note | null = null,
    public child: Note | null = null,
    public parent: Note | null = null,
  ) {}

  // 자식우선탐색(DFS)에서의 논리적 "다음" 노드
  public getNextNode(): Note | null {
    if (this.child) return this.child;
    let current: Note | null = this;
    while (current) {
      if (current.next) return current.next;
      current = current.parent;
    }
    return null;
  }

  public print(displayId?: string) {
    const idStr = displayId ? `[${displayId}]` : "";
    console.log(`${idStr} ${this.title}`);
    return this;
  }
}

// 유틸: 간단 UUID (데모용)
function simpleUUID() {
  return nanoid();
}

// DFS 기반 표시용 넘버링 생성기
// - 같은 부모의 자식들은 rank ASC로 순회해야 하므로,
//   child/next 포인터만으로는 부족할 수 있다(동기화가 되어 있다면 가능).
// - 여기서는 포인터를 신뢰하면서도, 같은 레벨 형제끼리 rank 오름차순이 되도록
//   삽입 시 prev/next를 올바르게 연결해주는 것을 전제로 함.
// - 필요 시 "자식 목록을 수집→rank로 소팅→연결" 과정을 별도 메소드로 보강.
function generateDisplayIds(rootHead: Note | null): Map<string, string> {
  const displayMap = new Map<string, string>();
  if (!rootHead) return displayMap;

  // 루트 레벨 순회: 이미 next 체인으로 연결되어 있다고 가정
  // 각 레벨에서의 카운터 스택으로 번호 생성
  // 예: [1], [1.1], [1.2], [1], ...
  const stack: number[] = [];
  let current: Note | null = rootHead;

  // 현재 레벨 계산을 위해 parent 체인을 이용하거나,
  // 저장 시 level을 업데이트해도 된다.
  const levelOf = (n: Note): number => {
    let lv = 0,
      p = n.parent;
    while (p) {
      lv++;
      p = p.parent;
    }
    return lv;
  };

  // 스택을 현재 노드의 레벨에 맞게 조정
  const alignStack = (targetLevel: number) => {
    while (stack.length > targetLevel + 1) stack.pop();
    while (stack.length < targetLevel + 1) stack.push(0);
  };

  while (current) {
    const lv = levelOf(current);
    alignStack(lv);
    stack[stack.length - 1] += 1;
    const displayId = stack.join(".");
    displayMap.set(current.persistentId, displayId);
    current = current.getNextNode();
  }
  return displayMap;
}

import { between, nextKey } from "./LexoRank";

export class NoteLinkedList {
  private head: Note | null = null;
  private displayIdCache: DisplayIdCache = new Map();
  private displayIdToNote: Map<string, Note> = new Map();

  // 3. 인덱스(앵커) 노트 집합 명시적으로 관리
  private anchorNotes: Set<Note> = new Set();

  // 4. 표시용 인덱스 노트 등록 함수 추가(실전에서는 UI/메타에서 선택)
  public markAsAnchor(note: Note) {
    this.anchorNotes.add(note);
    // 즉시 해당 note와 하위의 displayId 갱신(재귀)
    this.updateDisplayIdCacheFromAnchor(note);
  }

  // ---------- anchor 관련 ----------
  private isAnchor(note: Note | null): boolean {
    return !!note && this.anchorNotes.has(note);
  }

  // 주요 변경(삽입/삭제/이동) 시, 부모가 anchor면 그 서브트리만 부분 갱신
  private updateIfAnchor(note: Note | null) {
    if (this.isAnchor(note)) {
      this.updateDisplayIdCacheFromAnchor(note!);
    }
  }

  // 5. displayIdCache의 부분 갱신 함수
  private updateDisplayIdCacheFromAnchor(anchor: Note) {
    // 앵커보다 위(조상)는 건드리지 않고, anchor와 그 하위 노드만 displayId를 세팅
    // anchor의 displayId는 displayIdCache에서 읽거나 직접 지정
    const parentDisplay = anchor.parent
      ? (this.displayIdCache.get(anchor.parent.persistentId) ?? "")
      : "";
    this._recurseUpdateDisplayId(anchor, parentDisplay, this.displayIdCache);
  }

  // 6. 실제 재귀 동작
  private _recurseUpdateDisplayId(
    node: Note,
    parentDisplay: string,
    cache: DisplayIdCache,
  ) {
    // parentDisplay + sibling_index로 나를 만든다
    let siblings: Note[] = [];
    // 가장 앞 형제 찾기 → 형제 순서대로 배열
    let first = node.parent ? node.parent.child : this.head;
    if (first) {
      while (first.prev && first.prev.parent === node.parent)
        first = first.prev;
      let cur: Note | null = first;
      while (cur && cur.parent === node.parent) {
        siblings.push(cur);
        cur = cur.next;
      }
    }
    // 이 siblings 배열에서 node의 인덱스를 찾아 번호를 조립
    const idx = siblings.indexOf(node) + 1;
    const myDisplayId = parentDisplay ? `${parentDisplay}.${idx}` : `${idx}`;
    cache.set(node.persistentId, myDisplayId);
    this.displayIdToNote.set(myDisplayId, node);

    // 실제로는 siblings 배열을 순회하며 각 형제/자식 전체에 대해 적용
    // → 그래야 anchor 아래 부분 전체 재계산도 한번에 됨
    siblings.forEach((sib, i) => {
      const sibDisplayId = parentDisplay
        ? `${parentDisplay}.${i + 1}`
        : `${i + 1}`;
      cache.set(sib.persistentId, sibDisplayId);
      this.displayIdToNote.set(sibDisplayId, sib);
      // 각각의 자식에게 재귀
      if (sib.child)
        this._recurseUpdateDisplayId(sib.child, sibDisplayId, cache);
    });
  }
  public findNoteByDisplayId(displayId: string): Note | undefined {
    return this.displayIdToNote.get(displayId);
  }
  // 7. 주요 변경(삽입/삭제/이동) 시 "변경 노드의 부모"가 anchor에 속해있으면
  //    그 부모의 하위 displayIdCache만 updateDisplayIdCacheFromAnchor로 갱신
  //    (아니라면 displayIdCache를 따로 손대지 않음!)

  // 8. 표시/조회할 때만, displayIdCache에서 해당 노드의 표시값을 읽음
  public getDisplayId(note: Note): string | undefined {
    return this.displayIdCache.get(note.persistentId);
  }

  // 예시: anchor 기준 갱신 호출(직접/변경 시)
  // z.markAsAnchor(n1); // "n1" 인덱스/앵커노트로 등록, 그 하위 displayId 부분 캐시 갱신

  // displayIdCache에서만 표시 번호 읽어 출력
  public displayNotesCached(): void {
    let current: Note | null = this.head;
    while (current) {
      const level = this.computeLevel(current);
      const indentStr = " ".repeat(level * 4);
      const id = this.getDisplayId(current) || "";
      console.log(`${indentStr}[${id}] ${current.title}`);
      current = current.getNextNode();
    }
  }
  // 헬퍼: 같은 부모의 마지막 형제 찾기
  private findLastSibling(parent: Note | null): Note | null {
    if (!parent) {
      // 루트 레벨의 마지막
      if (!this.head) return null;
      let cur = this.head;
      while (cur.next && !cur.parent) cur = cur.next;
      return cur;
    } else {
      if (!parent.child) return null;
      let cur = parent.child;
      while (cur.next && cur.parent === parent) cur = cur.next;
      return cur;
    }
  }

  // 헬퍼: 같은 부모의 첫 형제
  private firstSibling(parent: Note | null): Note | null {
    return parent ? parent.child : this.head;
  }

  // 헬퍼: after와 next 사이의 중간 rank 생성
  private generateRankBetween(after: Note | null, next: Note | null): RankKey {
    const a = after ? after.rank : null;
    const b = next ? next.rank : null;
    return between(a, b);
  }

  // 노트 검색: persistentId 또는 표시ID가 아닌, 간단한 DFS 검색(데모)
  public findByPersistentId(pid: string): Note | null {
    const findRecursive = (n: Note | null): Note | null => {
      if (!n) return null;
      if (n.persistentId === pid) return n;
      const inChild = findRecursive(n.child);
      if (inChild) return inChild;
      return findRecursive(n.next);
    };
    return findRecursive(this.head);
  }

  // 루트 노트 추가: 맨 뒤 삽입
  public addRootNote(title: string, content: string): Note {
    const last = this.findLastSibling(null);
    const rank = last ? nextKey(last.rank) : "U";
    const n = new Note(simpleUUID(), title, content, rank);
    if (!this.head) {
      this.head = n;
      this.markAsAnchor(n);
    } else {
      last!.next = n;
      n.prev = last;
    }
    // 루트 자체가 앵커라면 루트 범위 갱신
    this.updateIfAnchor(null);
    return n;
  }

  public addChildNote(parentNode: Note, title: string, content: string): Note {
    const lastChild = this.findLastSibling(parentNode);
    const rank = lastChild
      ? nextKey(lastChild.rank)
      : this.generateRankBetween(null, parentNode.child);
    const n = new Note(simpleUUID(), title, content, rank);
    n.parent = parentNode;
    if (!parentNode.child) {
      parentNode.child = n;
    } else {
      lastChild!.next = n;
      n.prev = lastChild;
    }
    this.updateIfAnchor(parentNode); // 부모가 anchor면 그 범위만 갱신
    return n;
  }

  public addAfterNote(
    afterNoteId: string,
    title: string,
    content: string,
  ): Note | null {
    const after = this.findByPersistentId(afterNoteId);
    if (!after) return null;
    const next =
      after.next && after.next.parent === after.parent ? after.next : null;
    const rank = this.generateRankBetween(after, next);
    const n = new Note(simpleUUID(), title, content, rank);
    n.prev = after;
    n.next = next;
    if (next) next.prev = n;
    after.next = n;
    n.parent = after.parent;
    // n.parent가 anchor면 갱신
    this.updateIfAnchor(n.parent);
    return n;
  }

  // 표시용: DFS로 순회하며 rank 기반으로 이미 연결돼 있다고 가정하고 출력
  public displayNotes(): void {
    console.log("Display ----------------------");
    const displayMap = generateDisplayIds(this.head);
    let current: Note | null = this.head;
    while (current) {
      const level = this.computeLevel(current);
      const indentStr = " ".repeat(level * 4);
      const id = displayMap.get(current.persistentId) || "";
      console.log(
        `${indentStr}[${id}] ${current.title} (rank=${current.rank})`,
      );
      current = current.getNextNode();
    }
  }

  private computeLevel(n: Note): number {
    let lv = 0,
      p = n.parent;
    while (p) {
      lv++;
      p = p.parent;
    }
    return lv;
  }
}
