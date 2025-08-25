import type { NodeHideParams, NodeProcessParams } from "./types.d";
import { getStyleClass, isInside } from "./utils";
import { type SyntaxNode } from "@lezer/common";
import { inlineNodeProcess, hideNodeProcess } from "./processMap";
import { HIDE, STYLE } from "./constant";

// StrongEmphasis: processStyleNode,
// Emphasis: processStyleNode,
// Strikethrough: processStyleNode,
// Superscript: processStyleNode,
// Subscript: processStyleNode,
export function processStyleNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const cursorInside = isInside(selection, node.from, node.to);
  const currentStyle = getStyleClass[node.name] || "";
  activeStyles.push(currentStyle); // 현재 스타일을 스택에 추가

  console.log("nodename", node.name);

  let currentPos = node.from;
  let child: SyntaxNode | null = node.firstChild;

  while (child) {
    // 중간내용
    if (child.from > currentPos) {
      if (activeStyles.length > 0) {
        decorationInfos.push({
          type: activeStyles[activeStyles.length - 1],
          className: activeStyles.join(" "),
          from: currentPos,
          to: child.from,
        });
      }
    }

    // 마크 숨기기 처리
    if (hideNodeProcess[child.name])
      hideNodeProcess[child.name]({
        isInside: cursorInside,
        from: child.from,
        to: child.to,
        decorationInfos,
        activeStyles,
      });
    // 중첩된 노드 처리
    if (inlineNodeProcess[child.name])
      inlineNodeProcess[child.name]({
        node: child,
        doc,
        decorationInfos,
        selection,
        activeStyles,
      });

    // 중첩된 내부 자식노드 처리
    currentPos = child.to;
    child = child.nextSibling;
  }

  // 끝부분
  if (node.to > currentPos && activeStyles.length > 0)
    decorationInfos.push({
      type: activeStyles[activeStyles.length - 1],
      className: activeStyles.join(" "),
      from: currentPos,
      to: node.to,
    });

  activeStyles.pop(); // 현재 스타일을 스택에서 제거
}

export function processInlineCodeNode({
  node,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const currentStyle = getStyleClass[node.name] || STYLE.INLINECODE;

  activeStyles.push(currentStyle);
  const cursorInside = isInside(selection, node.from, node.to);
  const { from, to } = node;

  if (cursorInside) {
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" "),
      from: node.from,
      to: node.to,
    });
  } else {
    decorationInfos.push({
      type: "hide",
      from,
      to: from + 1,
    });
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" "),
      from: from + 1,
      to: to - 1,
    });
    decorationInfos.push({
      type: "hide",
      from: to - 1,
      to,
    });
  }
  activeStyles.pop();
}

export function processInternalLinkNode({
  node,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const currentStyle = getStyleClass[node.name] || STYLE.INTERNALLINK;

  activeStyles.push(currentStyle);
  const cursorInside = isInside(selection, node.from, node.to);
  const { from, to } = node;

  if (cursorInside) {
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" "),
      from: node.from + 2,
      to: node.to - 2,
    });
  } else {
    decorationInfos.push({
      type: "hide",
      from,
      to: from + 2,
    });
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" "),
      from: from + 2,
      to: to - 2,
    });
    decorationInfos.push({
      type: "hide",
      from: to - 2,
      to,
    });
  }
  activeStyles.pop();
}

export function processLinkNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const currentStyle = getStyleClass[node.name] || STYLE.LINK;
  activeStyles.push(currentStyle);
  const { from, to } = node;
  const urlNode = node.getChild("URL");
  let urlText = urlNode ? doc.sliceString(urlNode.from, urlNode.to) : "";
  let linkText = doc.sliceString(from + 1, urlNode ? urlNode.from - 2 : to - 3);
  const isValid = linkText.concat(urlText).length > 0;

  if (isValid) {
    if (isInside(selection, node.from, node.to)) {
      decorationInfos.push({
        type: currentStyle,
        className: activeStyles.join(" "),
        from: from,
        to: to,
        url: urlText,
      });
    } else {
      decorationInfos.push({ type: HIDE, from, to: from + 1 });
      if (linkText)
        decorationInfos.push({
          type: currentStyle,
          className: activeStyles.join(" "),
          from: from + 1,
          to: urlNode ? urlNode.from - 2 : to - 3,
          url: urlText,
        });
      decorationInfos.push({
        type: HIDE,
        from: urlNode ? urlNode.from - 2 : to - 3,
        to,
      });
    }
  }
  activeStyles.pop();
}

export function processImageNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const { from, to } = node;
  const urlNode = node.getChild("URL");
  if (!urlNode) return;
  let urlText = urlNode ? doc.sliceString(urlNode.from, urlNode.to) : "";
  let rawAltText = doc.sliceString(
    from + 2,
    urlNode ? urlNode.from - 2 : to - 3,
  );
  let displayAltText = rawAltText;
  const currentStyle = getStyleClass[node.name] || STYLE.IMAGE;
  const altPartsRegex = /^(.*?)(?:\|(1?\d{1,2}%|\d{1,4}(?:px)?))?$/i;
  const altMatch = rawAltText.match(altPartsRegex);
  let imageWidthSpecifier = "";
  if (altMatch) {
    displayAltText = altMatch[1] || "";
    imageWidthSpecifier = altMatch[2] || "";
  }

  // 커서가 안이면
  if (isInside(selection, node.from, node.to)) {
    // !를 이미지로 대체
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" ") + " " + currentStyle,
      from: from,
      to: from + 1,
      alt: displayAltText ? displayAltText : "",
      url: urlText,
      imageWidth: imageWidthSpecifier,
    });
    // 나머지 링크
    decorationInfos.push({
      type: STYLE.LINK,
      className: activeStyles.join(" ") + " " + STYLE.LINK,
      from: from + 1,
      to: to,
      url: urlText,
    });
  } else {
    decorationInfos.push({ type: HIDE, from, to: from + 2 });
    decorationInfos.push({
      type: currentStyle,
      className: activeStyles.join(" ") + " " + currentStyle,
      from: from + 2,
      to: urlNode ? urlNode.from - 2 : to - 3,
      alt: displayAltText,
      url: urlText,
      imageWidth: imageWidthSpecifier,
    });
    decorationInfos.push({
      type: HIDE,
      from: urlNode ? urlNode.from - 2 : to - 3,
      to,
    });
  }
}

export const pushHideDecoInfo = ({
  isInside,
  from,
  to,
  decorationInfos,
  activeStyles,
}: NodeHideParams) => {
  if (!isInside)
    decorationInfos.push({
      type: HIDE,
      from,
      to,
    });
  else
    decorationInfos.push({
      type: activeStyles[activeStyles.length - 1],
      className: activeStyles.join(" "),
      from,
      to,
    });
};
