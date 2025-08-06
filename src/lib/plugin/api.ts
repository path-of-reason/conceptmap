// // import { hotkeys } from "$lib/hooks/useKeyboard.svelte";
// import { mount, type SvelteComponent } from "svelte";
// import { useSectionStore } from "@/layout/resizable-pane/sectionStore.svelte";

// // 뷰 타입 정의: 뷰의 고유 ID와 뷰를 렌더링할 Svelte 컴포넌트
// export type PluginView = {
//   id: string; // 뷰의 고유 식별자 (예: 'my-plugin/todo-list')
//   name: string; // 사용자에게 표시될 이름 (예: '할 일 목록')
//   component: typeof SvelteComponent; // 뷰를 렌더링할 Svelte 컴포넌트 클래스
//   icon?: string; // 뷰를 나타낼 아이콘 (선택 사항)
//   // 기타 필요한 메타데이터
// };

// // 등록된 모든 뷰를 관리하는 Map
// const registeredViews = new Map<string, PluginView>();

// /**
//  * 플러그인이 새로운 뷰를 시스템에 등록합니다.
//  * @param view - 등록할 PluginView 객체
//  */
// function registerView(view: PluginView): void {
//   if (registeredViews.has(view.id)) {
//     console.warn(
//       `View with ID "${view.id}" is already registered. Overwriting.`,
//     );
//   }
//   // const div = document.createElement("div");
//   // mount(component, options);
//   registeredViews.set(view.id, view);
//   console.log(`View "${view.name}" (${view.id}) registered.`);
// }

// /**
//  * 등록된 모든 뷰 목록을 가져옵니다.
//  * @returns PluginView[]
//  */
// function getRegisteredViews(): PluginView[] {
//   return Array.from(registeredViews.values());
// }

// /**
//  * ID로 특정 뷰를 가져옵니다.
//  * @param viewId - 뷰의 고유 ID
//  * @returns PluginView | undefined
//  */
// function getView(viewId: string): PluginView | undefined {
//   return registeredViews.get(viewId);
// }

// export const PluginApi = {
//   mount,
//   // hotkeys,
//   useSectionStore,
//   registeredViews,
//   registerView,
//   getRegisteredViews,
//   getView,
// };
