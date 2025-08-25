<script lang="ts">
  import { EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

  // 필요한 개별 확장들을 import 합니다.
  import { keymap } from "@codemirror/view";
  import { history, historyKeymap } from "@codemirror/commands";
  import { defaultKeymap } from "@codemirror/commands";
  import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
  import { highlightActiveLine } from "@codemirror/view";
  import { indentOnInput } from "@codemirror/language";
  import { bracketMatching } from "@codemirror/language";
  import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
  import { rectangularSelection } from "@codemirror/view";
  import { crosshairCursor } from "@codemirror/view";
  import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
  import { lintKeymap } from "@codemirror/lint";
  import { indentWithTab } from "@codemirror/commands";

  // 로컬 파일 임포트 (경로 조정 필요)
  import { vim } from "./vim/index"; // .js 파일이므로 확장자 생략
  import { lpStyle } from "./livePreview/nodeDecoration";
  import { useCustomHotkeys } from "./hotkey";
  import { theme } from "./theme/index"; // 테마 폴더 스킵했지만, 일단 임포트

  import "./typo.css";
  import { internalLinkExtension } from "./parserExtension/internalLink";

  let { initialDoc } = $props<{
    initialDoc: string;
  }>();

  let editorView: EditorView | null = $state(null); // useRef -> let variable

  const hotkeys = useCustomHotkeys(); // Custom hook -> regular function call

  // 초기화 코드
  const useEditor = (el: HTMLDivElement) => {
    $effect(() => {
      const extensions = [
        vim(),
        lpStyle,
        theme,
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...hotkeys,
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...searchKeymap,
          ...lintKeymap,
          indentWithTab,
        ]),
        markdown({
          base: markdownLanguage,
          extensions: [internalLinkExtension],
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const doc = update.state.doc.toString();
            // saveContent(doc); // save changes 프롭스로 받을 필요가 없겟는데?
          }
        }),
        EditorView.lineWrapping,
      ];
      // if (onBlur)
      //   extensions.push(
      //     EditorView.domEventHandlers({
      //       blur: (_event, _view) => {
      //         onBlur();
      //         return false;
      //       },
      //     }),
      //   );
      const startState = EditorState.create({
        doc: initialDoc,
        extensions,
      });
      editorView = new EditorView({
        state: startState,
        parent: el,
      });

      if (editorView && initialDoc !== editorView.state.doc.toString()) {
        editorView.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: initialDoc,
          },
        });
      }

      return () => {
        if (editorView) editorView.destroy();
      };
    });
  };
</script>

<div class="relative h-full w-full overflow-hidden">
  <div use:useEditor class="cm-editor-custom h-full w-full"></div>
</div>
