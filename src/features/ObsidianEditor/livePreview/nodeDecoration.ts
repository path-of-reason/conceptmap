import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { EditorState, Range } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { type DecorationInfo } from "./types.d";
import {
  hiddenMark,
  imageMark,
  internalLinkMark,
  linkMark,
  makeMark,
  makeViewPlugin,
  TaskCheckboxWidget,
} from "./utils";
import { blockNodeProcess } from "./processMap";
import { blockLineStylingPlugin } from "./blockarea";
import { HIDE, STYLE } from "./constant";

const buildDecorations = (
  state: EditorState,
  view: EditorView,
): DecorationSet => {
  const decorationInfos: DecorationInfo[] = [];
  const decorations: Range<Decoration>[] = [];
  const selection = state.selection.main;
  const viewport = view.viewport;

  syntaxTree(state).iterate({
    from: viewport.from,
    to: viewport.to,
    enter: (nodeRef) => {
      if (blockNodeProcess[nodeRef.name]) {
        blockNodeProcess[nodeRef.name]({
          node: nodeRef.node,
          doc: state.doc,
          decorationInfos,
          selection,
          activeStyles: [],
        });
        return false;
      }
      return true;
    },
  });

  decorationInfos.forEach((deco) => {
    if (deco.type === HIDE) decorations.push(hiddenMark(deco));
    if (deco.type === STYLE.LINK) decorations.push(linkMark(deco));
    if (deco.type === STYLE.INTERNALLINK)
      decorations.push(internalLinkMark(deco));
    if (deco.type === STYLE.IMAGE) decorations.push(imageMark(deco));
    if (deco.type === STYLE.TASK_MARKER) {
      decorations.push(
        Decoration.replace({
          widget: new TaskCheckboxWidget(
            deco.from,
            deco.to,
            deco.checked || false,
          ),
        }).range(deco.from, deco.to),
      );
    } else decorations.push(makeMark(deco));
  });

  return Decoration.set(decorations);
};

export const lpStyle = [
  makeViewPlugin(buildDecorations),
  blockLineStylingPlugin,
  // blockCenterStylingPlugin,
];
