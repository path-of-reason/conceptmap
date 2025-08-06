import type { Command } from "$lib/types/command";

const commandMap = new Map<string, Command>();
const executeCommand = (key: string) => commandMap.get(key)?.action();
const addCommand = (cmd: Command) => commandMap.set(cmd.key, cmd);
const addCommandList = (cmds: Command[]) => cmds.forEach(addCommand);
const getCommandDescription = (key: string) => commandMap.get(key)?.description;
const getCommandAction = (key: string) => commandMap.get(key)?.action;

export const CommandApi = {
  commandMap,
  getCommandDescription,
  getCommandAction,
  executeCommand,
  addCommandList,
};
