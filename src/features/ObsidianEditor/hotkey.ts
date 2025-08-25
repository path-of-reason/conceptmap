import { EditorView } from "@codemirror/view";

export const useCustomHotkeys = () => {
  return [
    {
      key: "Mod-p",
      preventDefault: true,
      run: (_view: EditorView) => {
        console.log("toggle palette");
        return true;
      },
    },
    {
      key: "Mod-e",
      preventDefault: true,
      run: (_view: EditorView) => {
        console.log("toggle leftSidebar");
        return true;
      },
    },
  ];
};

