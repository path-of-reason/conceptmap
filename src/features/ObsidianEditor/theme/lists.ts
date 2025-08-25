// src/themes/my-theme/lists.ts
export const listStyles = {
  // --- List Styles ---
  ".cm-list-area": {},
  ".cm-list-mark": {
    fontWeight: "bold",
    color: "#888",
  },
  ".cm-ordered-list-mark": {},
  ".cm-bullet-list-mark": {
    color: "transparent",
    position: "relative",
  },
  ".cm-bullet-list-mark::before": {
    content: '"•"',
    position: "absolute",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    textAlign: "center",
    color: "#888",
    userSelect: "none",
  },
  "input.cm-task-checkbox": {
    appearance: "none",
    backgroundColor: "transparent",
    border: "2px solid #fff",
    borderRadius: "4px",
    width: "1.2em",
    height: "1.2em",
    marginRight: "0.5em",
    verticalAlign: "middle",
    cursor: "pointer",
    position: "relative",
    transition:
      "border-color 0.2s ease-in-out, background-color 0.2s ease-in-out",

    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "0.3em",
      height: "0.6em",
      borderBottom: "2px solid #000",
      borderLeft: "2px solid #000",
      transition: "transform 0.2s cubic-bezier(0.21, 0.68, 0.5, 1.6)",
      opacity: 0,
    },

    "&:checked": {
      backgroundColor: "greenyellow",
      borderColor: "greenyellow",
      "&::before": {
        transform:
          "translate(-50%, -50%) rotate(-135deg) scaleY(-1) scale(1.1)",
        opacity: 1,
      },
    },
  },
  ".cm-completed-task": {
    textDecoration: "line-through",
    color: "#888",
    opacity: 0.7,
  },
};
