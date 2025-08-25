import type { Config, Direction, SectionType } from "$lib/types/layout";

const defaultConfig: Config = {
  direction: "vertical" as Direction,
  default: 400,
  min: 0,
  max: 700,
  collapsed: false,
  isHotkeyContext: false,
};

const configs = $state<Record<string, Config>>({});

function getConfig(id: SectionType): Config {
    if (!configs[id]) {
        configs[id] = { ...defaultConfig };
    }
    return configs[id];
}

function updateDefaultSize(id: SectionType, size: number) {
    const config = getConfig(id);
    config.default = size;
}

function setConfig(id: SectionType, newConfig?: Partial<Config>) {
    const config = getConfig(id);
    Object.assign(config, newConfig);
}


export const SectionConfig = {
  get: getConfig,
  updateDefaultSize,
  set: setConfig,
};