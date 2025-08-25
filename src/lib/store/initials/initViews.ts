import { API } from "$lib/store/api";
import { icons } from "@lucide/svelte";
import Route from "@/layout/views/left/Route.svelte";
import LeftTabView from "@/layout/views/left/LeftTabView.svelte";
import Shortcuts from "@/layout/views/right/Shortcuts.svelte";
import LayoutVisibleState from "@/layout/views/right/LayoutState.svelte";
import CommandPalette from "@/layout/views/modal/Palette.svelte";
import VaultSetup from "@/layout/views/modal/VaultSetup.svelte";
import { LAYOUT } from "$lib/constant/layout";

export const initView = () => {
  API.view.registerViewList([
    {
      type: LAYOUT.LEFT_SIDEBAR,
      id: "route",
      name: "Route",
      component: Route,
      icon: icons.Route,
    },
    {
      type: LAYOUT.LEFT_SIDEBAR, // Added this new entry
      id: "leftTabView",
      name: "Left Tab View",
      component: LeftTabView,
      icon: icons.ListOrdered, // Using ListOrdered icon
    },
    {
      type: LAYOUT.RIGHT_SIDEBAR,
      id: "hotkeys",
      name: "keyboard shortcuts",
      component: Shortcuts,
      icon: icons.Keyboard,
    },
    {
      type: LAYOUT.RIGHT_SIDEBAR,
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

