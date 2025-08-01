import { LAYOUT } from "../constant";
import { SectionConfig } from "./sectionConfig";

SectionConfig.setList([
  {
    id: LAYOUT.LEFT_SIDEBAR,
    config: { ...SectionConfig.default },
  },
  {
    id: LAYOUT.RIGHT_SIDEBAR,
    config: { ...SectionConfig.default, collapsed: true },
  },
  {
    id: LAYOUT.HEADER_BAR,
    config: { direction: "horizontal", default: 25, min: 0, max: 500 },
  },
  {
    id: LAYOUT.SEARCH_BAR,
    config: { direction: "horizontal", default: 32, min: 0, max: 500 },
  },
  {
    id: LAYOUT.STATUS_BAR,
    config: { direction: "horizontal", default: 20, min: 0, max: 500 },
  },
]);
