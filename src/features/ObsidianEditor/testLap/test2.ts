// import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { internalLinkExtension } from "./internalLink";

// **bold**
// **bold*italic**italic***

// 에디터 상태 생성 (실제 에디터 뷰가 있다고 가정)
// const h = `# heading1 **as\`da\`sd** hello`;
// const c = "%%comment%% $$math$$ $inline math$ ==highlight==";
// const task = `
//     indented code
// - [ ] Task - [x] Task checked <u>hello **asd** world</u>
// `;
// const blockquote = `
// > first
// > second
// > third
// `;
// const script = `
// false[^위첨자false]
// [^위첨자false]: *아래첨자* true
// ~asdasd~
// ^asd^
// `;
// const marks = `
// **bold**
//   *italic*
//   \`inline code\`
// ~~strike~~
// link[^linkmark]
// [[db]]
// ![[db]]
// [link](url)
// ![link](url)
// ==highlight==
// `;
// const doc = `
// 인라인 마크들: 내부중첩을 허용하는 경우와 그렇지 않은 경우로 나뉨
// **볼드*이탤릭true* true**와 \`인라인코드false\` 그리고 ~~striketrue~~.[^위첨자false]
// [링크false](url)
// ![이미지false](url)
//
// [^위첨자false]: *아래첨자* true
//
// 블록마크들: 인라인마크들의 중첩을 허용, 블록마크 중첩은 케이스가 있음
// # 헤딩true: 다른 블록 중첩 불가
//
// * ### 리스트true: 헤딩블록만 중첩 가능
//   - 리스트 아이템true
//   1. 순서리스트true
//   - [ ] task true
//
// > 인용true
// > > 인용 내 인용: 처리가능
// > > > - 인용 내 리스트: 데코레이터 처리 불가
// > > > 1. 인용 내 리스트: 데코레이터 처리 불가
// > # 인용 내 헤딩: **불가**
// >
//
// ---
// +++
// ***
//
// \`\`\`javascript 코드블럭 내 중첩 불가 false
// function hello() {
// \`\`\`
// `;

// const nest = `**bold*italic\`code~~strike~~\`***`;

const boldCase = `
  [[helloworld]]
  [asdads]
  \`\`\`\`md
  \`\`\`rs
    pub fn main() {
      let mut var = vec![1,2,3];
    }
  \`\`\`
  \`\`\`\`
`;
const state = EditorState.create({
  doc: boldCase,
  extensions: [
    markdown({
      base: markdownLanguage,
      extensions: [internalLinkExtension],
    }),
  ],
});

// 구문 트리 얻기
// 트리 순회 및 헤더 텍스트 추출
console.log();
console.log();
console.log();
console.log("---------------------start");

const tree = syntaxTree(state);
tree.iterate({
  from: 0,
  enter: (nodeRef) => {
    const { from, to, name } = nodeRef;
    // const child = node.firstChild;
    console.log("in ", from, to, "\t", name);
  },
  leave: (nodeRef) => {
    const { from, to, name } = nodeRef;
    // const child = node.firstChild;
    console.log("out", from, to, "\t", name);
  },
});

// type Deco = {
//   type: string;
//   class?: string;
//   from: number;
//   to: number;
// };
//
// const decorations: Deco[] = [];
// const activeStyles: string[] = [];
// let lastPos = 0; // 문서 시작 위치 (혹은 현재 처리중인 부모 노드의 시작점)
//
// tree.iterate({
//   from: 0,
//   enter: (nodeRef) => {
//     const { type, from, to } = nodeRef;
//
//     // 1. 현재 위치(from)와 lastPos 사이에 텍스트가 있다면,
//     if (from > lastPos && activeStyles.length > 0) {
//       decorations.push({
//         type: activeStyles[activeStyles.length - 1],
//         class: activeStyles.join(" "),
//         from: lastPos,
//         to: from,
//       });
//     }
//
//     if (type.name === "StrongEmphasis") activeStyles.push("cm-bold");
//     else if (type.name === "Emphasis") activeStyles.push("cm-italic");
//     else if (type.name === "EmphasisMark") {
//       decorations.push({
//         type: "hide",
//         from: from,
//         to: to,
//       });
//     }
//
//     lastPos = to;
//   },
//   leave: (nodeRef) => {
//     const { type, to } = nodeRef;
//
//     // 1. 현재 노드의 끝(to)과 lastPos 사이에 텍스트가 있다면 처리
//     //    (이 경우는 주로 현재 노드가 끝나고, 부모 노드의 다음 형제 노드로 가기 전)
//     if (to > lastPos && activeStyles.length > 0) {
//       // 이 부분은 enter에서 처리하는 것과 중복될 수 있거나,
//       // 혹은 enter에서 lastPos을 업데이트 하는 방식에 따라 다르게 동작해야 함.
//       // 예를 들어, enter에서 자식 없는 노드의 텍스트를 처리하고,
//       // leave에서는 해당 노드의 스타일을 스택에서 제거하는 역할만 할 수 있음.
//     }
//
//     if (type.name === "StrongEmphasis") {
//       if (activeStyles[activeStyles.length - 1] === "cm-bold") {
//         activeStyles.pop();
//       }
//     } else if (type.name === "Emphasis") {
//       if (activeStyles[activeStyles.length - 1] === "cm-italic") {
//         activeStyles.pop();
//       }
//     }
//
//     // leave 시점의 lastPos 업데이트도 중요.
//     // 만약 현재 노드(to) 이후에 부모 노드의 텍스트가 바로 이어진다면,
//     // 그 텍스트를 처리하기 위해 lastPos을 to로 설정해야 함.
//     lastPos = to;
//   },
// });
//
// console.log(decorations);
