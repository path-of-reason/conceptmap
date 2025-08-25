# 플러그인을 생성하는 파일 : `nodeDecoration.ts`
트리순회 로직과 순회 이후 
데코레이션을 작성하는 로직으로 구성

```ts ./nodeDecoration.ts

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


export const lpStyle = [
  makeViewPlugin(buildDecorations),
  blockLineStylingPlugin,
  theme,
];
```

트리순회는 각 라인의 블록조회로 이루어지는데
모든 블록노드와 인라인노드의 시각화처리는 `processMap`에 저장되어있다.

# `processMap.ts`

```ts ./processMap.ts
export const hideNodeProcess: {
  [key in string]: (params: NodeHideParams) => void;
} = {
  EmphasisMark: pushHideDecoInfo,
  StrongEmphasisMark: pushHideDecoInfo,
  StrikethroughMark: pushHideDecoInfo,
  SuperscriptMark: pushHideDecoInfo,
  SubscriptMark: pushHideDecoInfo,
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
  Image: processImageNode,
  Link: processLinkNode,
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
  [BLOCK.BULLETLIST]: processListNode, // Added
  [BLOCK.ORDEREDLIST]: processListNode, // Added
};
```
# `block.ts`
```ts ./block.ts
...
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

```
가장 단순하게 처리되는 헤딩블럭을 살펴보면, 
헤더마크가 나타났을때, 커서가 해당 블럭 바깥에 있을때, 숨김처리가 진행되는것을 확인할 수 있다.
`pushHideDecoInfo`는 데코레이션 배열 `decorationInfos`에 시각화 데이터를 푸시한다.
`processParagraph`함수를 통해 내부 문장블록처리를 넘긴다.
다른 블록노드를 만날수도 있고 경우에 따라 다르게 진행되기 때문에 
여러 로직을 돌아다니면서 내부노드들을 모두 순차적으로 시각화처리하게 된다.


이게 플러그인이 작동하는 큰 구조라고 볼 수 있으며,
라인블록에 대한 데코레이션은 
내부요소의 데코레이션이 먼저 작동한 후 혹은 작동하기 이전에
처리 가능하기 때문에 별도의 플러그인으로 제작되었다.
순회를 두번진행하지만 화면에 보이는 뷰포트 내의 텍스트만 처리하기 때문에
성능적인 면에서 무리하게 작동하지 않는 방식으로 제작되었다.

# `blockarea.ts`
별도로 작동하는 라인데코레이션 플러그인이다.
파일 하나에 모든 로직이 다 들어있어 다른 파일과 독립적으로 작동한다.
코드블럭과 인용블럭을 묶음처리하기 위해 제작되었다.
불렛리스트의 작동방식을 옵시디언처럼 고도화시킨다면
이 영역을 더 잘 개선해야할것이다.


