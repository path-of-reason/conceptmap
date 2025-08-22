const HISTORY_KEY = "command_history"; // Not used since persistence is removed
const MAX_HISTORY_SIZE = 10;

let commandHistoryState = $state<{ history: string[] }>({ history: [] });

const addCommand = (commandKey: string) => {
  // Remove existing entry if it exists
  const filteredHistory = commandHistoryState.history.filter(
    (key) => key !== commandKey,
  );
  // Add to the beginning
  const newHistory = [commandKey, ...filteredHistory];
  // Limit size
  commandHistoryState.history = newHistory.slice(0, MAX_HISTORY_SIZE);
};

const clearHistory = () => {
  commandHistoryState.history = [];
};

export const CommandHistoryApi = {
  state: commandHistoryState, // Export the state object
  addCommand,
  clearHistory,
};
