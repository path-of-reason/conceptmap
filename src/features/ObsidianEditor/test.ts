console.log();
console.log();
console.log();
console.log("---------------------start");

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

// const textPrint = (str: string) => {
//   const state = EditorState.create({
//     doc: str,
//     extensions: [markdown({ base: markdownLanguage })],
//   });
//   const tree = syntaxTree(state);
//   console.log("\n-------------------------------");
//   console.log("test:", `\`${str}\``);
//   console.log("-------------------------------");
//
//   let currentDepth = 0;
//   const indentChar = "  ";
//
//   tree.iterate({
//     from: 0,
//     to: tree.length,
//     enter: (nodeRef) => {
//       const { from, to, name } = nodeRef;
//       const indent = indentChar.repeat(currentDepth);
//
//       console.log(`${from}-${to}\t| ${indent}${name} in`);
//       currentDepth++;
//     },
//     leave: (nodeRef) => {
//       currentDepth--;
//
//       const { from, to, name } = nodeRef;
//       const indent = indentChar.repeat(currentDepth);
//
//       console.log(`${from}-${to}\t| ${indent}${name} out`);
//     },
//   });
// };
const textPrintStyled = (str: string) => {
  const state = EditorState.create({
    doc: str,
    extensions: [markdown({ base: markdownLanguage })],
  });
  const tree = syntaxTree(state);
  console.log("\n-------------------------------");
  console.log("test:", `\`${str}\``);
  console.log("-------------------------------");

  let depthPrefixes: string[] = []; // 각 깊이 레벨의 접두사 ("│   ", "    ")를 저장

  tree.iterate({
    from: 0,
    to: tree.length,
    enter: (nodeRef) => {
      const { from, to, name } = nodeRef;

      // 현재 깊이에 맞는 접두사 생성
      let prefix = "";
      for (let i = 0; i < depthPrefixes.length; i++) {
        prefix += depthPrefixes[i];
      }

      // 현재 노드가 (부모 입장에서) 마지막 자식인지 여부를 알아야 └ 또는 ├ 결정 가능.
      // 이 정보는 iterate만으로는 알기 어려움.
      // 일단은 간단하게 "├─ " 또는 "└─ " 대신 일관된 마커 사용.
      const nodeMarker = "├─ "; // 또는 그냥 현재 들여쓰기 유지하고 이름만 출력

      console.log(`${from}-${to}\t| ${prefix}${nodeMarker}${name}`);

      // 다음 깊이를 위해 현재 레벨에 세로선 추가 (단, 현재 노드가 마지막 자식이면 공백 추가해야 함)
      // 이 부분도 마지막 자식 여부 판단이 필요함.
      // 간단한 버전: 항상 세로선 추가
      depthPrefixes.push("│  ");
    },
    leave: () => {
      depthPrefixes.pop(); // 현재 깊이의 접두사 제거
    },
  });
};

const case1 = [
  `---
hello: world
---
|asd|asd|
|---|---|
|asd|asd|
  `,
];

case1.forEach((s) => textPrintStyled(s));
