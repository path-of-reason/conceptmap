import type { LayoutState } from "$lib/types/layout";

let layoutState = $state<LayoutState>({
  isSectionResize: false,
  zoomLevel: 1,
});

const setZoom = (level: number) => {
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3.0;
  layoutState.zoomLevel = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, layoutState.zoomLevel + level),
  );
  document.body.style.zoom = layoutState.zoomLevel.toString();
};

const zoomIn = () => setZoom(0.1);
const zoomOut = () => setZoom(-0.1);
const setSectionResize = (bool: boolean) =>
  (layoutState.isSectionResize = bool);

export const LayoutApi = {
  state: layoutState,
  setSectionResize,
  zoomIn,
  zoomOut,
};
