import { EditorState, SelectionRange } from "@codemirror/state";
import { type DecorationInfo } from "./types.d";
import {
  type DecorationSet,
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { STYLE } from "./constant";

export const isInside = (selection: SelectionRange, from: number, to: number) =>
  selection.from <= to && selection.to >= from;
export const getStyleClass: {
  [key in string]: string;
} = {
  StrongEmphasis: STYLE.BOLD,
  Emphasis: STYLE.ITALIC,
  InternalLink: STYLE.INTERNALLINK,
  InlineCode: STYLE.INLINECODE,
  Strikethrough: STYLE.STRIKE,
  Superscript: STYLE.SUPER,
  Subscript: STYLE.SUB,
  ATXHeading1: STYLE.H1,
  ATXHeading2: STYLE.H2,
  ATXHeading3: STYLE.H3,
  ATXHeading4: STYLE.H4,
  ATXHeading5: STYLE.H5,
  ATXHeading6: STYLE.H6,
};

export const hiddenMark = (spec: DecorationInfo) =>
  Decoration.replace({}).range(spec.from, spec.to);

export const makeMark = (spec: DecorationInfo) =>
  Decoration.mark({ class: spec.className }).range(spec.from, spec.to);

export const internalLinkMark = (spec: DecorationInfo) =>
  Decoration.replace({
    widget: new InternalLinkWidget(spec),
  }).range(spec.from, spec.to);
// Decoration.mark({
//   tagName: "a",
//   class: spec.className + " " + "cm-internal-link-emoji-prefix",
//   attributes: {
//     href: spec.url
//       ? spec.url!.startsWith("http://") || spec.url!.startsWith("https://")
//         ? spec.url
//         : "https://" + spec.url
//       : "",
//     target: "_blank",
//   },
// }).range(spec.from, spec.to);

export const linkMark = (spec: DecorationInfo) =>
  Decoration.mark({
    tagName: "a",
    class: spec.className,
    attributes: {
      href: spec.url
        ? spec.url!.startsWith("http://") || spec.url!.startsWith("https://")
          ? spec.url
          : "https://" + spec.url
        : "",
      target: "_blank",
    },
  }).range(spec.from, spec.to);

export const quoteMark = (spec: DecorationInfo) =>
  Decoration.replace({ widget: new QuoteWidget(spec) }).range(
    spec.from,
    spec.to,
  );
export const imageMark = (spec: DecorationInfo) =>
  Decoration.replace({
    widget: new ImgWidget(spec),
  }).range(spec.from, spec.to);

export const taskMark = (spec: DecorationInfo) =>
  Decoration.replace({
    widget: new TaskCheckboxWidget(spec.from, spec.to, spec.checked || false),
  }).range(spec.from, spec.to);

export const makeViewPlugin = (
  builder: (state: EditorState, view: EditorView) => DecorationSet,
) => {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = builder(view.state, view);
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged)
          this.decorations = builder(update.state, update.view);
      }
    },
    { decorations: (v) => v.decorations },
  );
};

class QuoteWidget extends WidgetType {
  constructor(readonly spec: DecorationInfo) {
    super();
  }

  eq(other: QuoteWidget) {
    return other.spec.type === this.spec.type;
  }

  toDOM() {
    const span = document.createElement("span");
    return span;
  }

  ignoreEvent() {
    return false;
  }
}
class ImgWidget extends WidgetType {
  constructor(readonly spec: DecorationInfo) {
    super();
  }

  eq(other: ImgWidget) {
    return (
      other.spec.url === this.spec.url &&
      other.spec.alt === this.spec.alt &&
      other.spec.imageWidth === this.spec.imageWidth
    );
  }

  toDOM() {
    const img = document.createElement("img");
    const url = this.spec.url || "";
    const alt = this.spec.alt || "";
    const widthSpec = this.spec.imageWidth || "";

    if (
      url &&
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("//") &&
      !url.startsWith("data:")
    )
      img.src = "https://" + url;
    else img.src = url;

    img.alt = alt;
    img.title = alt;

    if (widthSpec) {
      if (widthSpec.endsWith("%")) {
        img.style.width = widthSpec;
        img.style.height = "auto";
      } else {
        const widthValue = parseInt(widthSpec, 10);
        if (!isNaN(widthValue) && widthValue > 0) {
          img.style.width = widthValue + "px";
          img.style.height = "auto";
        }
      }
    }
    if (!img.style.width) {
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
    }
    img.style.verticalAlign = "bottom";
    img.style.marginLeft = "auto";
    img.style.marginRight = "auto";
    img.style.borderRadius = "10px";

    if (this.spec.className) img.className = this.spec.className;

    return img;
  }

  ignoreEvent() {
    return false;
  }
}

export class TaskCheckboxWidget extends WidgetType {
  readonly originalRange: { from: number; to: number };
  readonly checked: boolean;

  constructor(from: number, to: number, checked: boolean) {
    super();
    this.originalRange = { from, to };
    this.checked = checked;
  }

  eq(other: TaskCheckboxWidget): boolean {
    return (
      other.checked === this.checked &&
      other.originalRange.from === this.originalRange.from &&
      other.originalRange.to === this.originalRange.to
    );
  }

  toDOM(view: EditorView): HTMLElement {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "cm-task-checkbox"; // For styling the checkbox itself
    checkbox.checked = this.checked;

    checkbox.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault(); // Prevent default browser action for checkbox click

      const currentText = view.state.doc.sliceString(
        this.originalRange.from,
        this.originalRange.to,
      );
      let newText = "[ ]"; // Default to unchecked
      if (currentText === "[ ]") {
        newText = "[x]";
      } else if (currentText === "[x]" || currentText === "[X]") {
        newText = "[ ]";
      }
      // Add other task marker variants if your parser supports them, e.g. [-], [>]

      view.dispatch({
        changes: {
          from: this.originalRange.from,
          to: this.originalRange.to,
          insert: newText,
        },
      });
    });

    return checkbox;
  }

  ignoreEvent(event: Event): boolean {
    // Ignore click events on the checkbox itself, as we handle them.
    return event.type === "click" || event.type === "mousedown";
  }
}

class InternalLinkWidget extends WidgetType {
  // DecorationInfo 스펙을 받아서 위젯을 구성합니다.
  constructor(readonly spec: DecorationInfo) {
    super();
  }

  // 위젯의 상태가 동일한지 비교하여 불필요한 DOM 재갱신을 막습니다.
  // 여기서는 링크의 URL, 클래스 등을 기반으로 비교할 수 있습니다.
  eq(other: InternalLinkWidget) {
    return (
      other.spec.url === this.spec.url &&
      other.spec.className === this.spec.className &&
      other.spec.from === this.spec.from && // 시작/끝 위치도 비교하여 고유성 확보
      other.spec.to === this.spec.to
    );
  }

  // 실제 HTML DOM 요소를 생성하여 반환합니다.
  toDOM(view: EditorView): HTMLElement {
    // view 인자를 받아서 에디터 상태에 접근 가능 (선택 사항)
    const linkElement = document.createElement("a");
    // 링크의 기본 클래스 적용
    linkElement.className = this.spec.className || "";

    // URL 구성 (기존 internalLinkMark 로직과 동일)
    const href = this.spec.url
      ? this.spec.url.startsWith("http://") ||
        this.spec.url.startsWith("https://")
        ? this.spec.url
        : "https://" + this.spec.url
      : "";
    linkElement.href = href;
    linkElement.target = "_blank"; // 새 탭에서 열기

    // 🍎 이모지 텍스트 노드 추가
    const emojiSpan = document.createElement("span");
    emojiSpan.textContent = "🍎";
    emojiSpan.style.marginRight = "4px"; // 이모지와 텍스트 사이 간격
    linkElement.appendChild(emojiSpan);

    // 실제 링크 텍스트 내용 추가
    // DecorationInfo의 from/to는 [[...]] 전체 범위이므로,
    // 실제 링크 내용은 from+2부터 to-2까지 잘라내야 합니다.
    const linkContent = view.state.doc.sliceString(
      this.spec.from + 2,
      this.spec.to - 2,
    );
    linkElement.appendChild(document.createTextNode(linkContent));

    return linkElement;
  }

  // 위젯에 발생하는 이벤트를 에디터가 무시할지 여부를 결정합니다.
  // false를 반환하면 이벤트가 버블링되어 에디터에 영향을 줄 수 있습니다.
  ignoreEvent() {
    return false; // 링크 클릭 이벤트를 허용해야 함
  }
}
