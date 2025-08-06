import type { Config, Direction } from "$lib/types/layout";

const defaultConfig: Config = {
  direction: "vertical" as Direction,
  default: 400,
  min: 0,
  max: 700,
  collapsed: false,
};
const layoutConfig = new Map<string, Config>();

const setSectionConfigs = (configs: { id: string; config?: Config }[]) =>
  configs.forEach(({ id, config }) =>
    layoutConfig.set(id, { ...defaultConfig, ...config }),
  );
const setSectionConfig = (id: string, config?: Config) => {
  layoutConfig.set(id, { ...defaultConfig, ...config });
};
const getSectionConfig = (id: string) => {
  if (!layoutConfig.has(id)) setSectionConfig(id);
  return layoutConfig.get(id)!;
};

export const SectionConfig = {
  default: defaultConfig,
  get: getSectionConfig,
  set: setSectionConfig,
  map: layoutConfig,
  setList: setSectionConfigs,
};
