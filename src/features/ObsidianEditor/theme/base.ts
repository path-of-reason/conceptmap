export const baseStyles = {
  "&": {
    height: "100%",
    outline: "none",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "var(--color-foreground)",
  },
  ".cm-scroller": {
    overflow: "auto",
    height: "100%",
    direction: "ltr",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--color-muted-foreground)",
    borderRight: "1px solid var(--color-border)",
    fontSize: "0.875rem",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "rgb(100, 100, 100, 0.5)",
    borderRadius: "5px",
  },
  ".cm-selectionBackground": {
    // backgroundColor: "var(--color-accent)",
  },
  ".cm-selectionBackground.cm-focused": {
    // backgroundColor: "var(--color-accent-foreground)",
  },
  ".cm-vimMode .cm-line": {
    caretColor: "transparent !important",
  },
  ".cm-fat-cursor": {
    position: "absolute",
    background: "greenyellow",
    border: "none",
    whiteSpace: "pre",
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    background: "none",
    outline: "solid 1px greenyellow !important",
    color: "transparent !important",
  },
  ".cm-cursor": {
    borderLeftWidth: "2px",
    borderLeftColor: "var(--color-foreground)",
  },

  ".cm-content": {
    // caretColor: "greenyellow",
  },
  ".cm-line": {
    maxWidth: "800px", // 원하는 고정 길이
    margin: "0 auto", // 가운데 정렬
    padding: "0", // 이전에 있던 18% 패딩을 제거
    boxSizing: "border-box", // 필요하다면 추가
  },
};
