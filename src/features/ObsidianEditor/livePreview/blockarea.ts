import {
  type DecorationSet,
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { BLOCK, STYLE } from "./constant";
import { Range } from "@codemirror/state";
import { isInside } from "./utils";

function buildBlockLineDecorations(view: EditorView): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  const viewport = view.viewport;

  syntaxTree(view.state).iterate({
    from: viewport.from,
    to: viewport.to,
    enter: (nodeRef) => {
      const nodeName = nodeRef.name;
      const doc = view.state.doc;
      const selection = view.state.selection.main;

      if (
        nodeName === BLOCK.BLOCKQUOTE ||
        nodeName === BLOCK.FENCEDCODE ||
        nodeName === BLOCK.BULLETLIST ||
        nodeName === BLOCK.ORDEREDLIST
      ) {
        let areaClass = "";

        if (nodeName === BLOCK.BLOCKQUOTE) areaClass = STYLE.BLOCKQUOTE_AREA;
        else if (nodeName === BLOCK.FENCEDCODE)
          areaClass = STYLE.FENCEDCODE_AREA;
        else if (
          nodeName === BLOCK.BULLETLIST ||
          nodeName === BLOCK.ORDEREDLIST
        )
          areaClass = STYLE.LIST_AREA;

        const fromLineNode = doc.lineAt(nodeRef.from);
        const toLineNode = doc.lineAt(nodeRef.to);

        for (let ln = fromLineNode.number; ln <= toLineNode.number; ln++) {
          const line = doc.line(ln);
          let lineClasses = areaClass;

          if (nodeName === BLOCK.BLOCKQUOTE) {
            if (ln === fromLineNode.number)
              lineClasses += " " + STYLE.BLOCKQUOTE_FIRST;
            if (ln === toLineNode.number)
              lineClasses += " " + STYLE.BLOCKQUOTE_LAST;
          } else if (nodeName === BLOCK.FENCEDCODE) {
            if (ln === fromLineNode.number)
              lineClasses += " " + STYLE.FENCEDCODE_FIRST;
            if (ln === toLineNode.number)
              lineClasses += " " + STYLE.FENCEDCODE_LAST;
          }
          if (lineClasses)
            decorations.push(
              Decoration.line({
                class: lineClasses.trim(),
              }).range(line.from),
            );
        }
        return false;
      } else if (nodeName === BLOCK.HORIZONTALRULE) {
        const hrLine = doc.lineAt(nodeRef.from);
        const cursorLineNumber = doc.lineAt(selection.head).number;
        if (
          hrLine.number !== cursorLineNumber &&
          !isInside(selection, hrLine.from, hrLine.to)
        )
          decorations.push(
            Decoration.line({
              class: STYLE.HR_LINE,
            }).range(hrLine.from),
          );
        return false;
      }
    },
  });
  return Decoration.set(decorations, true);
}

export const blockLineStylingPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildBlockLineDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet)
        this.decorations = buildBlockLineDecorations(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
