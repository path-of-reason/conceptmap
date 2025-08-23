import { ViewApi } from "./view.svelte";
import { HotkeyApi } from "./hotkey.svelte";
import { WorkspaceApi } from "./workspace";
import { SectionApi } from "./section.svelte";
import { CommandApi } from "./command";
import { LayoutApi } from "./layout.svelte";
import { ModalApi } from "./modal.svelte";
import { ContextApi } from "./context.svelte";
import { CommandHistoryApi } from "./commandHistoryStore.svelte"; // Added import
import { VaultApi } from "./vault.svelte";
import { LogApi } from "./log.svelte";

export const API = {
  // window
  section: SectionApi,
  view: ViewApi,
  workspace: WorkspaceApi,
  layout: LayoutApi,
  modal: ModalApi,
  vault: VaultApi,
  log: LogApi,

  // command
  command: CommandApi,
  hotkey: HotkeyApi,
  context: ContextApi,
  commandHistory: CommandHistoryApi, // Added to API
};
