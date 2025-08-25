import { LAYOUT } from "$lib/constant/layout";
import { SectionConfig } from "../sectionConfig.svelte";
import { API } from "../api";
import type { Config, SectionType } from "$lib/types/layout";

export const initSection = () => {
  const initialConfigs: { id: SectionType; config: Partial<Config> }[] = [
    {
      id: LAYOUT.LEFT_SIDEBAR,
      config: { collapsed: false, isHotkeyContext: true },
    },
    {
      id: LAYOUT.RIGHT_SIDEBAR,
      config: { collapsed: true, isHotkeyContext: true },
    },
    {
      id: LAYOUT.HEADER_BAR,
      config: { direction: "horizontal", default: 25, min: 0, max: 500 },
    },
    {
      id: LAYOUT.STATUS_BAR,
      config: { direction: "horizontal", default: 20, min: 0, max: 500 },
    },
  ];

  // Set the configs and initialize ContextApi
  initialConfigs.forEach(({ id, config }) => {
    SectionConfig.set(id, config);
    if (config.isHotkeyContext && !config.collapsed) {
      API.context.enter(id);
    }
  });
};