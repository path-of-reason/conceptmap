import { cubicOut, cubicInOut, linear } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function customSlide(
  node: HTMLElement,
  params?: { duration?: number; easing?: (t: number) => number },
): TransitionConfig {
  const { duration = 300, easing = linear } = params || {};

  // 초기 너비, 패딩, 보더 값을 측정합니다.
  // 이 값들은 요소가 나타날 때의 최종 크기 또는 사라질 때의 시작 크기가 됩니다.
  const style = getComputedStyle(node);
  const initialWidth = node.offsetWidth; // 요소의 현재 렌더링된 너비
  const initialPaddingLeft = parseFloat(style.paddingLeft);
  const initialPaddingRight = parseFloat(style.paddingRight);
  const initialBorderLeftWidth = parseFloat(style.borderLeftWidth);
  const initialBorderRightWidth = parseFloat(style.borderRightWidth);

  return {
    duration,
    easing,
    css: (t) => {
      // `t`는 애니메이션 진행도 (0 = 시작, 1 = 끝)
      // 나타날 때는 0 -> 1 (width: 0 -> initialWidth)
      // 사라질 때는 1 -> 0 (width: initialWidth -> 0)
      const eased_t = easing(t); // 이징 함수 적용
      // 너비, 패딩, 보더를 애니메이션 진행도에 따라 계산합니다.
      const width = eased_t * initialWidth;
      const paddingLeft = eased_t * initialPaddingLeft;
      const paddingRight = eased_t * initialPaddingRight;
      const borderLeftWidth = eased_t * initialBorderLeftWidth;
      const borderRightWidth = eased_t * initialBorderRightWidth;
      const opacity = eased_t; // 투명도도 함께 조절하여 부드럽게 만듭니다.
      return `
        overflow: hidden;
        width: ${width}px;
        min-width: 0px !important; /* Flexbox의 기본 min-width 제약을 무력화 */
        padding-left: ${paddingLeft}px;
        padding-right: ${paddingRight}px;
        border-left-width: ${borderLeftWidth}px;
        border-right-width: ${borderRightWidth}px;
      `;
    },
  };
}
