import {
  type DecorationSet,
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
// import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

function buildBlockCenterDecorations(view: EditorView): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  const viewport = view.viewport;
  const doc = view.state.doc;
  const startLine = doc.lineAt(viewport.from);
  const endLine = doc.lineAt(viewport.to);
  let pointer = viewport.from;

  for (const linestr of doc.iterLines(startLine.number, endLine.number + 1)) {
    const line = doc.lineAt(pointer);
    decorations.push(
      Decoration.replace({
        widget: new LineCenterWidget(),
        block: true,
      }).range(line.from, line.to + 1),
    );
    console.log(line.from, line.to + 1, linestr);
    pointer += linestr.length + 1;
  }
  return Decoration.set(decorations, true);
}

export const blockCenterStylingPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildBlockCenterDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet)
        this.decorations = buildBlockCenterDecorations(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);

class LineCenterWidget extends WidgetType {
  readonly maxWidth = "1000px";
  constructor() {
    super();
  }
  toDOM() {
    const wrapper = document.createElement("div");
    // wrapper.style.width = "100%"; // 라인 너비만큼 확장
    // wrapper.style.display = "flex";
    // wrapper.style.justifyContent = "center";

    // const content = document.createElement("span");
    // content.style.maxWidth = this.maxWidth;
    // content.style.width = "100%"; // maxWidth보다 작으면 확장
    // content.style.margin = "0 auto";
    // content.style.boxSizing = "border-box"; // 패딩, 마진이 width에 포함되도록
    // // content.style.border = "1px solid red"; // for debugging
    // wrapper.appendChild(content);
    return wrapper;
  }

  eq(other: LineCenterWidget) {
    return other.maxWidth === this.maxWidth;
  }
}
