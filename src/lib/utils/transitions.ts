import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

interface SlideFadeParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  axis?: "x" | "y";
}

export function slideFade(
  node: Element,
  { delay = 0, duration = 400, easing = cubicOut }: SlideFadeParams = {},
): TransitionConfig {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const height = parseFloat(style.height);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);
  const borderTopWidth = parseFloat(style.borderTopWidth);
  const borderBottomWidth = parseFloat(style.borderBottomWidth);

  return {
    delay,
    duration,
    easing,
    css: (t: number) =>
      `
      overflow: hidden;
      opacity: ${0 + target_opacity * t};
      height: ${t * height}px;
      padding-top: ${t * paddingTop}px;
      padding-bottom: ${t * paddingBottom}px;
      margin-top: ${t * marginTop}px;
      margin-bottom: ${t * marginBottom}px;
      border-top-width: ${t * borderTopWidth}px;
      border-bottom-width: ${t * borderBottomWidth}px;
      min-height: 0;
      `,
  };
}
