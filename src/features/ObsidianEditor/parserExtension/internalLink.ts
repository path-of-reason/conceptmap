import { type MarkdownExtension } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";

let Punctuation = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;

const InternalLinkDelim = {
  resolve: "InternalLink",
  mark: "InternalLinkMark",
};
export const internalLinkExtension: MarkdownExtension = {
  defineNodes: [
    {
      name: "InternalLink",
      style: { "InternalLink/...": t.link }, // 노드와 그 자식에 링크 스타일 적용
    },
    {
      name: "InternalLinkMark",
      style: t.processingInstruction, // 마크(`[[`, `]]`)에 스타일 적용
    },
  ],
  parseInline: [
    {
      name: "InternalLinkOpen",
      parse(cx, next, pos) {
        if (
          next != 91 /* '[' */ ||
          cx.char(pos + 1) != 91 ||
          cx.char(pos + 2) == 91
        )
          return -1;
        let before = cx.slice(pos - 1, pos),
          after = cx.slice(pos + 2, pos + 3);
        let sBefore = /\s|^$/.test(before),
          sAfter = /\s|^$/.test(after);
        let pBefore = Punctuation.test(before),
          pAfter = Punctuation.test(after);
        // 열린 델리미터로 추가 (Mark.Open)
        return cx.addDelimiter(
          InternalLinkDelim,
          pos,
          pos + 2,
          !sAfter && (!pAfter || sBefore || pBefore), // canOpen
          !sBefore && (!pBefore || sAfter || pAfter), // canClose (이중 대괄호가 스스로 닫을 수도 있다면)
        );
      },
      before: "Link", // link로 인식되기 전에 우선순위
    },
    {
      name: "InternalLinkClose",
      parse(cx, next, pos) {
        // 93 === ']'
        if (next != 93 || cx.char(pos + 1) != 93) return -1;

        // `InternalLinkDelim` 타입의 열린 델리미터를 찾습니다.
        // resolve 속성을 가진 델리미터는 cx.resolveMarkers에 의해 자동으로 처리되므로,
        // 이곳에서는 단순히 닫는 델리미터를 추가하기만 합니다.
        return cx.addDelimiter(
          InternalLinkDelim,
          pos,
          pos + 2,
          false, // 열린 역할 아님
          true,
        );
      },
      after: "LinkEnd",
    },
  ],
};
