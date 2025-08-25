import { Data, Effect } from 'effect';
import { invokeTauri, TauriInvokeError } from './utils';
import { VaultApi } from '$lib/store/vault.svelte';
import type { Note } from '$lib/types/note';

// Error Types
export class NoteOperationError extends Data.TaggedError("NoteOperationError")<{
  operation: "create";
  message: string;
  cause?: unknown;
}> {}

// Tauri 커맨드 이름 상수
const INVOKE = {
  CREATE_NOTE: "create_note",
};

/**
 * 백엔드 Tauri 커맨드를 호출하여 새 노트를 생성합니다.
 * @param title 노트 제목
 * @param content 노트 내용
 * @param parent_uuid 부모 노트의 UUID (선택 사항)
 * @returns 생성된 Note 객체를 포함하는 Effect
 */
export const createNote = (
  title: string,
  content: string,
  parent_uuid: string | null,
): Effect.Effect<Note, NoteOperationError | TauriInvokeError> =>
  Effect.gen(function* () {
    const vaultPath = VaultApi.state.path;

    if (!vaultPath) {
      return yield* Effect.fail(
        new NoteOperationError({
          operation: "create",
          message: "현재 활성화된 Vault 경로가 없습니다.",
        }),
      );
    }

    return yield* invokeTauri<Note>(INVOKE.CREATE_NOTE, {
      title,
      content,
      parent_uuid,
      vaultPath,
    }).pipe(
      Effect.mapError((cause) => {
        if (cause instanceof TauriInvokeError) {
          return new NoteOperationError({
            operation: "create",
            message: `노트 생성 실패: ${cause.message}`,
            cause,
          });
        }
        return cause;
      }),
    );
  });
