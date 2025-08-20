import { LAYOUT } from "$lib/constant/layout";
import { SectionConfig } from "../sectionConfig";
import { API } from "../api";

export const initSection = () => {
  SectionConfig.setList([
    {
      id: LAYOUT.LEFT_SIDEBAR,
      config: { ...SectionConfig.default, collapsed: false, isHotkeyContext: true },
    },
    {
      id: LAYOUT.RIGHT_SIDEBAR,
      config: { ...SectionConfig.default, collapsed: true, isHotkeyContext: true },
    },
    {
      id: LAYOUT.HEADER_BAR,
      config: { direction: "horizontal", default: 25, min: 0, max: 500 },
    },
    // {
    //   id: LAYOUT.SEARCH_BAR,
    //   config: { direction: "horizontal", default: 32, min: 0, max: 500 },
    // },
    {
      id: LAYOUT.STATUS_BAR,
      config: { direction: "horizontal", default: 20, min: 0, max: 500 },
    },
  ]);

  // Initialize ContextApi based on initial section states
  SectionConfig.map.forEach((config, id) => {
    if (config.isHotkeyContext && !config.collapsed) {
      API.context.enter(id);
    }
  });
};
