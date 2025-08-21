// Note.ts
export type NoteId = string;

export class Note {
  constructor(
    public noteId: NoteId,
    public title: string,
    public content: string,
    public prev: Note | null = null,
    public next: Note | null = null,
    public child: Note | null = null,
    public parent: Note | null = null,
    public level: number = 0,
  ) {}

  // 자식우선탐색
  public getNextNode(): Note | null {
    if (this.child) return this.child;
    let current: Note | null = this;
    while (current) {
      if (current.next) return current.next;
      current = current.parent;
    }
    return null;
  }

  public print() {
    console.log(`[${this.noteId}] ${this.title}`);
    return this;
  }
}

/**
 * 주어진 노트에서 재귀적으로 특정 ID의 노드를 찾습니다.
 * @param note 현재 탐색할 노트.
 * @param noteId 찾을 노트의 ID.
 * @returns 찾은 노드 객체 또는 null.
 */
export function findNoteRecursive(
  note: Note | null,
  noteId: NoteId,
): Note | null {
  if (!note) {
    return null;
  }
  if (note.noteId === noteId) {
    return note;
  }

  // 자식 노드에서 먼저 탐색
  const foundInChildren = findNoteRecursive(note.child, noteId);
  if (foundInChildren) {
    return foundInChildren;
  }

  // 다음 형제 노드에서 탐색
  return findNoteRecursive(note.next, noteId);
}

export class NoteLinkedList {
  private head: Note | null = null;

  public findNote(noteId: NoteId): Note | null {
    return findNoteRecursive(this.head, noteId);
  }

  public addRootNote(title: string, content: string): Note {
    const newNote = new Note("", title, content);
    newNote.level = 0; // 루트 노드는 레벨 0

    if (!this.head) {
      this.head = newNote;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNote;
      newNote.prev = current;
    }
    this.renumberNotes();
    return newNote;
  }

  public addChildNote(
    parentNode: Note,
    title: string,
    content: string,
  ): Note | null {
    if (!parentNode) {
      return null;
    }
    const newNote = new Note("", title, content);
    newNote.parent = parentNode;
    newNote.level = parentNode.level + 1; // 부모 레벨 + 1

    if (!parentNode.child) {
      parentNode.child = newNote;
    } else {
      let lastChild = parentNode.child;
      while (lastChild.next) {
        lastChild = lastChild.next;
      }
      lastChild.next = newNote;
      newNote.prev = lastChild;
    }
    this.renumberNotes();
    return newNote;
  }

  public addAfterNote(
    afterNoteId: NoteId,
    title: string,
    content: string,
  ): Note | null {
    const afterNote = this.findNote(afterNoteId);
    if (!afterNote) {
      return null;
    }
    const newNote = new Note("", title, content); // 아이디를 비워둠
    const nextNote = afterNote.next;

    newNote.prev = afterNote;
    newNote.next = nextNote;
    afterNote.next = newNote;
    if (nextNote) {
      nextNote.prev = newNote;
    }
    this.renumberNotes(); // 모든 아이디 재할당
    return newNote;
  }

  private renumberNotes(): void {
    let rootNoteCounter = 1;
    let currentRoot = this.head;

    while (currentRoot) {
      currentRoot.noteId = rootNoteCounter.toString();
      this.renumberChildren(currentRoot.child, currentRoot.noteId);
      currentRoot = currentRoot.next;
      rootNoteCounter++;
    }
  }

  private renumberChildren(childHead: Note | null, parentId: string): void {
    if (!childHead) return;

    let childCounter = 1;
    let currentChild: Note | null = childHead;

    while (currentChild) {
      currentChild.noteId = `${parentId}.${childCounter}`;
      this.renumberChildren(currentChild.child, currentChild.noteId);
      currentChild = currentChild.next;
      childCounter++;
    }
  }

  public displayNotes(): void {
    let current: Note | null = this.head;
    while (current) {
      const indentStr = " ".repeat(current.level * 4);
      console.log(`${indentStr}[${current.noteId}] ${current.title}`);
      current = current.getNextNode(); // getNextNode 사용
    }
  }
}
const zettelkasten = new NoteLinkedList();

const note1 = zettelkasten.addRootNote("지텔카스텐 시스템", "내용1");
const note2 = zettelkasten.addRootNote("연결 리스트", "내용2");

zettelkasten.addChildNote(note1, "원자적 사고", "내용1-1");
const childNote2 = zettelkasten.addChildNote(note1, "노트 간 연결", "내용1-2");
zettelkasten.addChildNote(childNote2!, "양방향 링크", "내용1-2-1");
zettelkasten.addAfterNote("1", "삽입된 노트", "내용1a");
zettelkasten.addAfterNote("2", "또다른 삽입", "내용2a");
console.log("--- 초기 상태 ---");
zettelkasten.displayNotes();

// 특정 노트 조회하기
console.log("--- 노트 조회 테스트 ---");

const findNode = (id: string) => {
  const foundNote = zettelkasten.findNote(id);
  return foundNote;
};
findNode("1")
  ?.print()
  ?.getNextNode()
  ?.print()
  .getNextNode()
  ?.print()
  .getNextNode()
  ?.print()
  .getNextNode()
  ?.print()
  .getNextNode()
  ?.print();
