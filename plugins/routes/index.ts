// plugins/my-first-plugin/index.ts
// import LeftSidebar from "./LeftSidebar.svelte";
// import type { PluginView } from "$lib/plugin/api"; // 코어에서 제공하는 타입 임포트
// import type { PluginView } from "../../src/lib/plugin/api"; // 코어에서 제공하는 타입 임포트

// 플러그인 진입점 (코어에서 호출)
// export function activate(api: { registerView: (view: PluginView) => void }) {
//   api.registerView({
//     id: "leftsidebar-view",
//     name: "Left Sidebar View",
//     component: LeftSidebar,
//     icon: "👋",
//   });
// 핫키 시스템에 명령 등록 (이전에 구현한 hotkeys API를 활용)
// 예를 들어, 이 뷰를 특정 Pane에 로드하는 핫키를 등록할 수 있습니다.
// hotkeys.register(['control', 'alt', 'v'], () => {
//     // TODO: 이 뷰를 특정 Pane에 로드하는 로직 (layoutStore를 통해 Pane 상태 변경)
// }, 'Activate My Sample View', { mode: 'normal' });
// }
