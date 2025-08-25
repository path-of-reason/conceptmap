import type {
  BlockNodeProcessParams,
  NodeHideParams,
  NodeProcessParams,
} from "./types.d";
import {
  blockNodeProcess,
  hideNodeProcess,
  inlineNodeProcess,
} from "./processMap";
import { getStyleClass, isInside } from "./utils";
import { pushHideDecoInfo } from "./inline";
import { BLOCK, HIDE, STYLE } from "./constant";
import type { SyntaxNode } from "@lezer/common";

export function processParagraphNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles = [],
}: NodeProcessParams): void {
  const { from, to } = node;
  const child = node.firstChild;
  processParagraph({
    from,
    to,
    child,
    doc,
    decorationInfos,
    selection,
    activeStyles,
  });
}

export function processParagraph({
  from,
  to,
  child,
  doc,
  decorationInfos,
  selection,
  activeStyles = [],
}: BlockNodeProcessParams): void {
  let currentPos = from;

  while (child) {
    // 앞
    if (child.from > currentPos && activeStyles.length > 0)
      decorationInfos.push({
        type: activeStyles[activeStyles.length - 1],
        className: activeStyles.join(" "),
        from: currentPos,
        to: child.from,
      });

    // 중간
    // Blocks
    if (child.name === BLOCK.QUOTEMARK) {
      const quoteMarkLine = doc.lineAt(child.from).number;
      const cursorLine = doc.lineAt(selection.head).number;
      const isInsideLine = quoteMarkLine === cursorLine;
      hideNodeProcess[child.name]({
        isInside: isInsideLine || isInside(selection, child.from, child.to),
        from: child.from,
        to: child.to,
        decorationInfos,
        activeStyles,
      });
    }
    // Inlines
    if (inlineNodeProcess[child.name]) {
      inlineNodeProcess[child.name]({
        node: child,
        doc,
        decorationInfos,
        selection,
        activeStyles,
      });
    }
    currentPos = child.to;
    child = child.nextSibling;
  }
  // 뒤
  if (to > currentPos && activeStyles.length > 0)
    decorationInfos.push({
      type: activeStyles[activeStyles.length - 1],
      className: activeStyles.join(" "),
      from: currentPos,
      to,
    });
}

export function processFencedCodeNode({
  node,
  decorationInfos,
  selection,
}: NodeProcessParams): void {
  const cursorInsideFencedCode = isInside(selection, node.from, node.to);

  let child = node.firstChild;
  while (child) {
    if (child.name === BLOCK.CODEMARK) {
      if (cursorInsideFencedCode) {
        decorationInfos.push({
          type: STYLE.CODEMARK,
          className: STYLE.CODEMARK,
          from: child.from,
          to: child.to,
        });
      } else {
        decorationInfos.push({
          type: HIDE,
          from: child.from,
          to: child.to,
        });
      }
    } else if (child.name === BLOCK.CODEINFO) {
      if (cursorInsideFencedCode) {
        decorationInfos.push({
          type: STYLE.CODEINFO,
          className: STYLE.CODEINFO,
          from: child.from,
          to: child.to,
        });
      } else {
        decorationInfos.push({
          type: STYLE.CODEINFO,
          className: STYLE.CODEINFO,
          from: child.from,
          to: child.to,
        });
      }
    }
    child = child.nextSibling;
  }
}

export function processHeadingNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const cursorInside = isInside(selection, node.from, node.to);
  const style = getStyleClass[node.name] || STYLE.HEADING;
  const headerMark = node.getChild(BLOCK.HEADERMARK)!;
  const textLength = doc.sliceString(headerMark.to + 1, node.to).trim().length;
  activeStyles.push(style); // 현재 헤딩 스타일을 스택에 추가

  if (textLength) {
    pushHideDecoInfo({
      isInside: cursorInside,
      from: headerMark.from,
      to: headerMark.to + 1,
      decorationInfos,
      activeStyles,
    });
    processParagraph({
      from: headerMark.to + 1,
      to: node.to,
      child: headerMark.nextSibling,
      doc,
      decorationInfos,
      selection,
      activeStyles,
    });
  }

  activeStyles.pop(); // 현재 헤딩 스타일을 스택에서 제거
}

export function processBlockquoteNode({
  node, // 현재 Blockquote 노드
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  let child = node.firstChild;
  while (child) {
    if (child.name === BLOCK.QUOTEMARK) {
      const quoteMarkLine = doc.lineAt(child.from).number;
      const cursorLine = doc.lineAt(selection.head).number;
      const isInsideLine = quoteMarkLine === cursorLine;
      pushQuoteMarkInfo({
        isInside: isInsideLine || isInside(selection, child.from, child.to),
        from: child.from,
        to: child.to,
        decorationInfos,
        activeStyles,
      });
    } else if (child.name === BLOCK.PARAGRAPH) {
      processParagraphNode({
        node: child,
        doc,
        decorationInfos,
        selection,
        activeStyles,
      });
    } else if (child.name === BLOCK.BLOCKQUOTE)
      processBlockquoteNode({
        node: child,
        doc,
        decorationInfos,
        selection,
        activeStyles,
      });

    child = child.nextSibling;
  }
}

export const pushQuoteMarkInfo = ({
  isInside,
  from,
  to,
  decorationInfos,
  activeStyles,
}: NodeHideParams) => {
  if (!isInside)
    decorationInfos.push({
      type: STYLE.QUOTE,
      className: activeStyles.join(" ") + " " + STYLE.QUOTE,
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

// function processListItemNode({
//   node,
//   doc,
//   decorationInfos,
//   selection,
//   activeStyles,
//   depth,
// }: NodeProcessParams & { depth: number }): void {
//   const listMarkNode = node.firstChild;
//
//   if (listMarkNode && listMarkNode.name === BLOCK.LISTMARK) {
//     const isInsideListMarkLine =
//       doc.lineAt(listMarkNode.from).number ===
//       doc.lineAt(selection.head).number;
//
//     let finalClassNameForMark: string;
//
//     if (isInsideListMarkLine || isInside(selection, node.from, node.to)) {
//       finalClassNameForMark =
//         `${STYLE.LIST_MARK} ${STYLE.LIST_DEPTH_PREFIX}${depth}`.trim();
//     } else {
//       let listTypeClass = "";
//       if (node.parent?.name === BLOCK.BULLETLIST) {
//         listTypeClass = STYLE.BULLET_LIST_MARK;
//       } else if (node.parent?.name === BLOCK.ORDEREDLIST) {
//         listTypeClass = STYLE.ORDERED_LIST_MARK;
//       }
//       finalClassNameForMark =
//         `${STYLE.LIST_MARK} ${listTypeClass} ${STYLE.LIST_DEPTH_PREFIX}${depth}`.trim();
//     }
//
//     decorationInfos.push({
//       type: STYLE.LIST_MARK,
//       className: finalClassNameForMark,
//       from: listMarkNode.from,
//       to: listMarkNode.to,
//     });
//
//     let currentItemChild = listMarkNode.nextSibling;
//     while (currentItemChild) {
//       const processor = blockNodeProcess[currentItemChild.name];
//       if (processor) {
//         if (
//           currentItemChild.name === BLOCK.BULLETLIST ||
//           currentItemChild.name === BLOCK.ORDEREDLIST
//         ) {
//           (processor as any)(
//             {
//               node: currentItemChild,
//               doc,
//               decorationInfos,
//               selection,
//               activeStyles,
//             },
//             depth + 1,
//           );
//         } else {
//           processor({
//             node: currentItemChild,
//             doc,
//             decorationInfos,
//             selection,
//             activeStyles,
//           });
//         }
//       }
//       currentItemChild = currentItemChild.nextSibling;
//     }
//   } else {
//     // This case (ListItem without a ListMark as first child) should ideally not happen with a valid Markdown grammar.
//     // If it can, process all children of listItemNode directly here.
//     // For now, assuming ListMark is always first.
//     // You could add a loop here: let currentItemChild = listItemNode.firstChild; while (currentItemChild) { ... }
//     // if ListItems can exist without a leading ListMark according to the grammar.
//   }
// }

// Helper function (user's version)
function processListItemNode({
  node, // Renamed from listItemNode to match NodeProcessParams
  doc,
  decorationInfos,
  selection,
  activeStyles,
  depth,
}: NodeProcessParams & { depth: number }): void {
  const listMarkNode = node.firstChild;

  if (listMarkNode && listMarkNode.name === BLOCK.LISTMARK) {
    const isInsideListMarkLine =
      doc.lineAt(listMarkNode.from).number ===
      doc.lineAt(selection.head).number;

    let finalClassNameForMark: string;

    // User's condition: node is ListItem
    if (isInsideListMarkLine || isInside(selection, node.from, node.to)) {
      finalClassNameForMark =
        `${STYLE.LIST_MARK} ${STYLE.LIST_DEPTH_PREFIX}${depth}`.trim();
    } else {
      let listTypeClass = "";
      // node.parent should be BulletList or OrderedList
      if (node.parent?.name === BLOCK.BULLETLIST) {
        listTypeClass = STYLE.BULLET_LIST_MARK;
      } else if (node.parent?.name === BLOCK.ORDEREDLIST) {
        listTypeClass = STYLE.ORDERED_LIST_MARK;
      }
      finalClassNameForMark =
        `${STYLE.LIST_MARK} ${listTypeClass} ${STYLE.LIST_DEPTH_PREFIX}${depth}`.trim();
    }

    decorationInfos.push({
      type: STYLE.LIST_MARK,
      className: finalClassNameForMark,
      from: listMarkNode.from,
      to: listMarkNode.to,
    });

    // Updated child processing loop
    let currentItemChild = listMarkNode
      ? listMarkNode.nextSibling
      : node.firstChild;
    while (currentItemChild) {
      if (currentItemChild.name === BLOCK.TASK) {
        processTaskNode({
          node: currentItemChild,
          doc,
          decorationInfos,
          selection,
          activeStyles: [...activeStyles], // Pass a copy of activeStyles from ListItem
        });
      } else {
        const processor = blockNodeProcess[currentItemChild.name];
        if (processor) {
          if (
            currentItemChild.name === BLOCK.BULLETLIST ||
            currentItemChild.name === BLOCK.ORDEREDLIST
          ) {
            (processor as any)(
              {
                node: currentItemChild,
                doc,
                decorationInfos,
                selection,
                activeStyles,
              },
              depth + 1,
            );
          } else {
            processor({
              node: currentItemChild,
              doc,
              decorationInfos,
              selection,
              activeStyles,
            });
          }
        }
      }
      currentItemChild = currentItemChild.nextSibling;
    }
  } else {
    // If no ListMark is the first child, process all children of ListItem directly
    // This might happen if grammar allows ListItem without a leading ListMark,
    // or if the first child isn't a ListMark for some reason.
    let currentItemChild = node.firstChild;
    while (currentItemChild) {
      if (currentItemChild.name === BLOCK.TASK) {
        processTaskNode({
          node: currentItemChild,
          doc,
          decorationInfos,
          selection,
          activeStyles: [...activeStyles],
        });
      } else {
        const processor = blockNodeProcess[currentItemChild.name];
        if (processor) {
          if (
            currentItemChild.name === BLOCK.BULLETLIST ||
            currentItemChild.name === BLOCK.ORDEREDLIST
          ) {
            (processor as any)(
              {
                node: currentItemChild,
                doc,
                decorationInfos,
                selection,
                activeStyles,
              },
              depth + 1,
            );
          } else {
            processor({
              node: currentItemChild,
              doc,
              decorationInfos,
              selection,
              activeStyles,
            });
          }
        }
      }
      currentItemChild = currentItemChild.nextSibling;
    }
  }
}

export function processListNode(
  params: NodeProcessParams,
  depth: number = 1,
): void {
  const { node, doc, decorationInfos, selection, activeStyles } = params;

  let child = node.firstChild;
  while (child) {
    if (child.name === BLOCK.LISTITEM) {
      processListItemNode({
        node: child,
        doc,
        decorationInfos,
        selection,
        activeStyles: [...activeStyles],
        depth,
      });
    }
    child = child.nextSibling;
  }
}

export function processTaskNode({
  node,
  doc,
  decorationInfos,
  selection,
  activeStyles,
}: NodeProcessParams): void {
  const taskMarkerNode = node.firstChild;
  let taskContentNode: SyntaxNode | null = null;

  if (
    taskMarkerNode &&
    taskMarkerNode.name === BLOCK.TASKMARKER &&
    !isInside(selection, node.from, node.to)
  ) {
    const markerText = doc.sliceString(taskMarkerNode.from, taskMarkerNode.to);
    const isChecked = markerText.toLowerCase() === "[x]";
    decorationInfos.push({
      type: STYLE.TASK_MARKER,
      from: taskMarkerNode.from,
      to: taskMarkerNode.to,
      checked: isChecked,
    });
    taskContentNode = taskMarkerNode.nextSibling;
  } else taskContentNode = node.firstChild;

  if (taskContentNode) {
    const taskContentActiveStyles = [...activeStyles];
    const isChecked = taskMarkerNode
      ? doc
          .sliceString(taskMarkerNode.from, taskMarkerNode.to)
          .toLowerCase() === "[x]"
      : false;
    if (isChecked) taskContentActiveStyles.push(STYLE.COMPLETED_TASK);

    let child: SyntaxNode | null = taskContentNode;
    while (child) {
      if (child.name === BLOCK.PARAGRAPH) {
        processParagraphNode({
          node: child,
          doc,
          decorationInfos,
          selection,
          activeStyles: taskContentActiveStyles,
        });
      } else if (blockNodeProcess[child.name])
        blockNodeProcess[child.name]({
          node: child,
          doc,
          decorationInfos,
          selection,
          activeStyles: taskContentActiveStyles,
        });

      child = child.nextSibling;
    }
  }
}
