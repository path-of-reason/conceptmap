import { API } from "$lib/store/api";
import { icons } from "@lucide/svelte";
import LeftTab from "@/layout/views/left/LeftTab.svelte";
import Route from "@/layout/views/left/Route.svelte";
import LeftTabView from "@/layout/views/left/LeftTabView.svelte";
import Shortcuts from "@/layout/views/right/Shortcuts.svelte";
import LayoutVisibleState from "@/layout/views/right/LayoutState.svelte";
import CommandPalette from "@/layout/views/modal/Palette.svelte";
import VaultSetup from "@/layout/views/modal/VaultSetup.svelte";

export const initView = () => {
  API.view.registerViewList([
    {
      type: "leftSidebar",
      id: "leftTab",
      name: "Left Tab",
      component: LeftTab,
      icon: icons.AppWindow,
    },
    {
      type: "leftSidebar",
      id: "route",
      name: "Route",
      component: Route,
      icon: icons.Route,
    },
    {
      type: "leftSidebar", // Added this new entry
      id: "leftTabView",
      name: "Left Tab View",
      component: LeftTabView,
      icon: icons.ListOrdered, // Using ListOrdered icon
    },
    {
      type: "rightSidebar",
      id: "hotkeys",
      name: "keyboard shortcuts",
      component: Shortcuts,
      icon: icons.Keyboard,
    },
    {
      type: "rightSidebar",
      id: "layoutVisibleState",
      name: "layout visible state",
      component: LayoutVisibleState,
      icon: icons.View,
    },
  ]);
  API.modal.registerModalViewAll([
    {
      id: "pallete",
      type: "full",
      component: CommandPalette,
    },
    {
      id: "vaultSetup", // 볼트 설정 모달 ID
      type: "full", // 모달 유형
      component: VaultSetup, // 볼트 설정 모달 컴포넌트
    },
  ]);
};
