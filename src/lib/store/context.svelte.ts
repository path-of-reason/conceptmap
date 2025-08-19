type ContextState = {
  // Manages the history of LOCAL contexts. 'global' is not included here.
  contextStack: string[];
};

const contextState = $state<ContextState>({
  contextStack: [],
});

/**
 * Enters a new local context, pushing it onto the stack.
 */
const enter = (context: string) => {
  if (!context || context === "global") return;
  // Avoid duplicates if already at the top of the stack
  if (contextState.contextStack.at(-1) === context) return;
  contextState.contextStack.push(context);
};

/**
 * Leaves a specific local context, removing it from the stack.
 */
const leave = (context: string) => {
  if (!context || context === "global") return;
  const index = contextState.contextStack.lastIndexOf(context);
  if (index > -1) {
    contextState.contextStack.splice(index, 1);
  }
};

/**
 * Gets the currently active local context (the top of the stack).
 */
const getActiveLocalContext = (): string | null => {
  return contextState.contextStack.at(-1) ?? null;
};

export const ContextApi = {
  contextState,
  enter,
  leave,
  getActiveLocalContext,
};
