import {
  processBlockquoteNode,
  processFencedCodeNode,
  processHeadingNode,
  processListNode,
  processParagraphNode,
  pushQuoteMarkInfo,
} from "./block";
import { BLOCK } from "./constant";
import {
  pushHideDecoInfo,
  processImageNode,
  processInlineCodeNode,
  processLinkNode,
  processStyleNode,
  processInternalLinkNode,
} from "./inline";
import type { NodeHideParams, NodeProcessParams } from "./types.d";

export const hideNodeProcess: {
  [key in string]: (params: NodeHideParams) => void;
} = {
  EmphasisMark: pushHideDecoInfo,
  StrongEmphasisMark: pushHideDecoInfo,
  StrikethroughMark: pushHideDecoInfo,
  SuperscriptMark: pushHideDecoInfo,
  SubscriptMark: pushHideDecoInfo,
  InternalLinkMark: pushHideDecoInfo,
  QuoteMark: pushQuoteMarkInfo,
};

export const inlineNodeProcess: {
  [key in string]: (params: NodeProcessParams) => void;
} = {
  StrongEmphasis: processStyleNode,
  Emphasis: processStyleNode,
  Strikethrough: processStyleNode,
  Superscript: processStyleNode,
  Subscript: processStyleNode,
  InternalLink: processInternalLinkNode,
  Link: processLinkNode,
  Image: processImageNode,
  InlineCode: processInlineCodeNode,
};

export const blockNodeProcess: {
  [key in string]: (params: NodeProcessParams) => void;
} = {
  ATXHeading1: processHeadingNode,
  ATXHeading2: processHeadingNode,
  ATXHeading3: processHeadingNode,
  ATXHeading4: processHeadingNode,
  ATXHeading5: processHeadingNode,
  ATXHeading6: processHeadingNode,
  [BLOCK.PARAGRAPH]: processParagraphNode,
  [BLOCK.BLOCKQUOTE]: processBlockquoteNode,
  [BLOCK.FENCEDCODE]: processFencedCodeNode,
  [BLOCK.BULLETLIST]: processListNode,
  [BLOCK.ORDEREDLIST]: processListNode,
};
