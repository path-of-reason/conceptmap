import { initCommand } from "./initCommands";
import { initView } from "./initViews";
import { initHotkey } from "./initHotkeys";
import { initSection } from "./initSections";

const init = () => {
  initCommand();
  initHotkey();
  initSection();
  initView();
};

init();
