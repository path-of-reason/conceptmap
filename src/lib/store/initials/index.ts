import { initCommand } from "./initCommands";
import { initView } from "./initViews";
import { initHotkey } from "./initHotkeys";
import { initSection } from "./initSections";
import { initVault } from "./initVault"; // initVault 임포트

const init = () => {
  initCommand();
  initHotkey();
  initSection();
  initView();
  initVault();
};

init();
