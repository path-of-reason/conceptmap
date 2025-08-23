export type LogMessage = {
  timestamp: string;
  level: "log" | "warn" | "error" | "info";
  message: string;
  originalArgs?: any[]; // Store original args for better formatting
};

const MAX_LOG_ENTRIES = 1000; // 최대 로그 엔트리 수

const logState = $state<{
  logs: LogMessage[];
  filterLevel: "all" | "log" | "warn" | "error" | "info";
  searchText: string;
}>({
  // filterLevel과 searchText 상태 추가
  logs: [],
  filterLevel: "all",
  searchText: "",
});

const addLog = (level: LogMessage["level"], ...args: any[]) => {
  const timestamp = new Date().toLocaleTimeString();
  const message = args
    .map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg); // Fallback for circular or complex objects
        }
      }
      return String(arg);
    })
    .join(" ");

  const newLog: LogMessage = { timestamp, level, message, originalArgs: args }; // originalArgs 저장

  logState.logs.push(newLog);

  // 최대 엔트리 수를 초과하면 가장 오래된 로그를 제거
  if (logState.logs.length > MAX_LOG_ENTRIES) {
    logState.logs.shift();
  }
};

const clearLogs = () => {
  logState.logs = [];
};

const setFilterLevel = (level: LogMessage["level"] | "all") => {
  logState.filterLevel = level;
};

const setSearchText = (text: string) => {
  logState.searchText = text;
};

const filteredLogs = () => {
  let logs = logState.logs;
  if (logState.filterLevel !== "all") {
    logs = logs.filter((log) => log.level === logState.filterLevel);
  }
  if (logState.searchText) {
    const searchLower = logState.searchText.toLowerCase();
    logs = logs.filter((log) =>
      log.message.toLowerCase().includes(searchLower),
    );
  }
  return logs;
};

export const LogApi = {
  state: logState,
  addLog,
  clearLogs, // clearLogs 함수 export
  setFilterLevel, // setFilterLevel 함수 export
  setSearchText, // setSearchText 함수 export
  filteredLogs,
  // 편의를 위해 console 메서드와 유사한 함수들을 export
  log: (...args: any[]) => addLog("log", ...args),
  info: (...args: any[]) => addLog("info", ...args),
  warn: (...args: any[]) => addLog("warn", ...args),
  error: (...args: any[]) => addLog("error", ...args),
};
