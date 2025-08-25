// src/themes/my-theme/inline.ts
export const inlineStyles = {
  // inlines
  ".cm-italic": {
    fontStyle: "italic",
    color: "#afb",
  },
  ".cm-bold": {
    fontWeight: "bold",
    color: "#e13",
  },
  ".cm-inlinecode": {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "0.9em",
    borderRadius: "3px",
    padding: "0.15em 0.3em",
    whiteSpace: "pre",
    backgroundColor: "white",
    color: "black",
  },
  ".cm-internal-link": {
    color: "var(--link-color, #a9f)",
    fontWeight: "bold",
    backgroundColor: "white",
    padding: "0px 2px 0px 2px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  ".cm-link": {
    color: "var(--link-color, #a9f)",
    textDecoration: "underline",
    fontWeight: "bold",
    cursor: "pointer",
  },
  ".cm-strike": {
    textDecoration: "line-through",
    color: "#888",
    fontSize: "1rem",
  },
  ".cm-super": {
    color: "#888",
    verticalAlign: "super",
    fontSize: "smaller",
  },
  ".cm-sub": {
    color: "#888",
    verticalAlign: "sub",
    fontSize: "smaller",
  },
};
