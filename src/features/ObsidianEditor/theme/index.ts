// src/themes/my-theme/index.ts
import { EditorView } from "@codemirror/view";
import { baseStyles } from "./base";
import { syntaxHighlightingStyles } from "./syntax";
import { inlineStyles } from "./inline";
import { blockStyles } from "./blocks";
import { listStyles } from "./lists";

export const theme = EditorView.theme(
  {
    ...baseStyles,
    ...syntaxHighlightingStyles,
    ...inlineStyles,
    ...blockStyles,
    ...listStyles,
  },
  { dark: true },
);
