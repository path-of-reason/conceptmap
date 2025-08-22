import * as fs from "./fs";
import * as dialog from "./dialog";
import * as terminal from "./terminal";
import * as kuzu from "./kuzu";
import * as vault from "./vault"; // Add this line

/**
 * Tauri 백엔드와 통신하는 모든 API의 단일 진입점.
 * 애플리케이션의 다른 부분에서는 이 객체를 통해서만 Tauri 기능에 접근해야 합니다.
 */
export const TauriApi = {
  fs,
  dialog,
  terminal,
  kuzu,
  vault, // Add this line
};
