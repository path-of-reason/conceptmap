import { EditorState, SelectionRange } from "@codemirror/state";
import { type SyntaxNode } from "@lezer/common";

export type InlineStyleType =
  | "StrongEmphasis"
  | "EmphasisMark"
  | "Emphasis"
  | "InlineCode"
  | "CodeMark"
  | "Strikethrough"
  | "StrikethroughMark"
  | "Image"
  | "Link"
  | "LinkMark"
  | "URL"
  | "Subscript"
  | "SubscriptMark"
  | "Superscript"
  | "SuperscriptMark";

export type BlockStyleType =
  | "Document"
  | "Paragraph"
  | "ATXHeading1"
  | "ATXHeading2"
  | "ATXHeading3"
  | "ATXHeading4"
  | "ATXHeading5"
  | "ATXHeading6"
  | "HeaderMark"
  | "Blockquote"
  | "QuoteMark"
  | "FencedCode"
  | "CodeInfo"
  | "CodeBlock"
  | "CodeText"
  | "BulletList"
  | "OrderedList"
  | "ListItem"
  | "ListMark"
  | "Task" // Task 노드가 ListItem과 별개로 있다면
  | "TaskMarker" // Task의 마여러분의 마커
  | "HTMLTag" // 목록에 없었음
  | "HorizontalRule";
// | "HTMLBlock"; // 목록에 없었음

export interface DecorationInfo {
  from: number;
  to: number;
  type: string;
  className?: string;
  url?: string;
  alt?: string;
  imageWidth?: string;
  checked?: boolean;
}

export type NodeProcessParams = {
  node: SyntaxNode;
  doc: EditorState["doc"];
  decorationInfos: DecorationInfo[];
  selection: SelectionRange;
  activeStyles: string[];
};
export type BlockNodeProcessParams = {
  from: number;
  to: number;
  child: SyntaxNode | null;
  doc: EditorState["doc"];
  decorationInfos: DecorationInfo[];
  selection: SelectionRange;
  activeStyles: string[];
};

export type NodeHideParams = {
  isInside: boolean;
  from;
  to;
  decorationInfos: DecorationInfo[];
  activeStyles: string[];
  doc?: EditorState["doc"];
};
