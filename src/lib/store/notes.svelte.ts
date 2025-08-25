import { Effect, Exit, Cause } from "effect";
import { createNote } from "$lib/tauri/note";
import type { Note } from "$lib/types/note";

const notesState = $state<{
  notes: Note[];
  loading: boolean;
  error: string | null;
}>({ notes: [], loading: false, error: null });

/**
 * 새 노트를 생성하고 스토어에 추가합니다.
 * @param title 노트 제목
 * @param content 노트 내용
 * @param parent_uuid 부모 노트의 UUID (선택 사항)
 */
const addNote = async (
  title: string,
  content: string,
  parent_uuid: string | null,
) => {
  notesState.loading = true;
  notesState.error = null;

  const exit = await Effect.runPromiseExit(
    createNote(title, content, parent_uuid),
  );

  Exit.match(exit, {
    onSuccess: (newNote) => {
      notesState.notes.push(newNote);
      // TODO: 정렬 로직 추가 필요 (rank 기반)
    },
    onFailure: (cause) => {
      notesState.error = Cause.prettyErrors(cause).toString();
    },
  });

  notesState.loading = false;
};

export const NotesApi = {
  state: notesState,
  addNote,
};
