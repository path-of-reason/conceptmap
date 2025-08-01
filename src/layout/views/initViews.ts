import { ViewApi } from "./ViewApi.svelte";
import LeftTab from "./left/LeftTab.svelte";
import Route from "./left/Route.svelte";
import * as Icons from "@lucide/svelte/icons";

ViewApi.registerViewList([
  {
    type: "leftSidebar",
    id: "leftTab",
    name: "Left Tab",
    component: LeftTab,
    icon: Icons.AppWindow,
  },
  {
    type: "leftSidebar",
    id: "route",
    name: "Route",
    component: Route,
    icon: Icons.Route,
  },
]);
