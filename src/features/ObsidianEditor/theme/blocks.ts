export const blockStyles = {
  // blocks
  ".cm-hr": {
    position: "relative",
    color: "transparent",
    height: "1em",
  },
  ".cm-hr::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "0",
    right: "0",
    height: "2px",
    backgroundColor: "var(--color-muted-foreground, #ccc)",
    transform: "translateY(-50%)",
  },
  ".cm-heading": {
    fontWeight: "bold",
    color: "var(--color-primary)",
  },
  ".cm-h1": {
    fontSize: "2em",
    margin: "0.67em 0",
  },
  ".cm-h2": {
    fontSize: "1.5em",
    margin: "0.83em 0",
  },
  ".cm-h3": {
    fontSize: "1.17em",
    margin: "1em 0",
  },
  ".cm-h4": {
    fontSize: "1em",
    margin: "1.33em 0",
  },
  ".cm-h5": {
    fontSize: "0.83em",
    margin: "1.67em 0",
  },
  ".cm-h6": {
    fontSize: "0.67em",
    margin: "2.33em 0",
  },
  ".cm-quote": {
    color: "transparent",
    position: "relative",
  },
  ".cm-quote::before": {
    content: '""',
    position: "absolute",
    left: "0",
    top: "0",
    bottom: "0",
    width: "4px",
    backgroundColor: "rgba(100,100,240, 0.5)",
  },
  ".cm-blockquote-area": {
    backgroundColor: "rgba(128, 128, 128, 0.15)",
    padding: "0 0 0 0 !important",
    lineHeight: "1.2em",
    // marginLeft: "calc(18% - 10px)",
    // marginRight: "calc(18% - 10px)",
  },
  ".cm-blockquote-first": {
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    overflow: "hidden",
  },
  ".cm-blockquote-last": {
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    overflow: "hidden",
  },
  ".cm-fencedcode-area": {
    backgroundColor: "rgba(200, 200, 200, 0.08)",
    fontFamily:
      "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace)",
    padding: "0px 0px 0px 7px !important",
    // marginLeft: "calc(18% - 10px)",
    // marginRight: "calc(18% - 10px)",
  },
  ".cm-fencedcode-first": {
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    backgroundColor: "rgba(100,100,100, 0.1)",
  },
  ".cm-fencedcode-last": {
    paddingBottom: "3px",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  ".cm-codemark": {
    color: "var(--color-muted-foreground, #888)",
  },
  ".cm-codeinfo": {
    fontStyle: "italic",
    color: "var(--color-muted-foreground, #888)",
    fontSize: "0.9em",
  },
};
