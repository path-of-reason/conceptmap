import type { VaultsAndCurrent } from "$lib/types/vault";
import { invokeTauri } from "./utils";
import { Effect, Data } from "effect";

class VaultOperationError extends Data.TaggedError("VaultOperationError")<{
  operation: string; // 확장성 위해 "add" | "remove" 등 여러 타입
  message: string;
  cause?: unknown;
}> {}
// 실제 백엔드 커맨드를 이 상수에 맞춰 등록해야 함
const INVOKE = {
  ADD: "add_vault",
  REMOVE: "remove_vault",
  LOAD_ALL: "load_vaults",
  SET_CURRENT: "set_current_vault",
  GET_CURRENT: "get_current_vault",
  LOAD_ALL_WITH_CURRENT: "load_vaults_and_current",
};

// vault 추가
const addVault = (path: string) =>
  invokeTauri<void>(INVOKE.ADD, { path }).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "add",
          message: `Failed to add vault: ${cause.message}`,
          cause,
        }),
    ),
  );

// vault 삭제
const removeVault = (path: string) =>
  invokeTauri<void>(INVOKE.REMOVE, { path }).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "remove",
          message: `Failed to remove vault: ${cause.message}`,
          cause,
        }),
    ),
  );

// vault 전체 목록
export const loadVaults = () =>
  invokeTauri<string[]>(INVOKE.LOAD_ALL, {}).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "load_all",
          message: `Failed to load vaults: ${cause.message}`,
          cause,
        }),
    ),
  );

// 현재 볼트 설정
const setCurrentVault = (path: string) =>
  invokeTauri<void>(INVOKE.SET_CURRENT, { path }).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "set_current",
          message: `Failed to set current vault: ${cause.message}`,
          cause,
        }),
    ),
  );

// 현재 볼트 조회
const getCurrentVault = () =>
  invokeTauri<string | null>(INVOKE.GET_CURRENT, {}).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "get_current",
          message: `Failed to get current vault: ${cause.message}`,
          cause,
        }),
    ),
  );

// vault 목록+current 동시 로드 (앱 초기화)
const loadVaultsAndCurrent = () =>
  invokeTauri<VaultsAndCurrent>(INVOKE.LOAD_ALL_WITH_CURRENT, {}).pipe(
    Effect.mapError(
      (cause) =>
        new VaultOperationError({
          operation: "load_all_with_current",
          message: `Failed to load vaults and current: ${cause.message}`,
          cause,
        }),
    ),
  );

export const VaultApi = {
  addVault,
  removeVault,
  loadVaults,
  setCurrentVault,
  getCurrentVault,
  loadVaultsAndCurrent,
  VaultOperationError,
};
