import { Data, Effect } from "effect";
import { invokeTauri, TauriInvokeError } from "./utils";

// Kuzu 관련 에러 타입을 정의합니다.
export class KuzuError extends Data.TaggedError("KuzuError")<{
  message: string;
  cause?: unknown;
}> {}

// TODO:  kuzu_test 삭제, create_note 커맨드로 변경함.
// 조회 커맨드 만들고, 각각 테스트 해볼 것
// Rust의 `kuzu_test` 커맨드를 호출하는 함수입니다.
export const kuzuTest = (): Effect.Effect<
  string[],
  KuzuError | TauriInvokeError
> =>
  invokeTauri<string[]>("kuzu_test").pipe(
    Effect.mapError((cause) => {
      // TauriInvokeError를 더 구체적인 KuzuError로 래핑합니다.
      if (cause instanceof TauriInvokeError) {
        return new KuzuError({
          message: `Kuzu test command failed: ${cause.message}`,
          cause,
        });
      }
      return cause;
    }),
  );
