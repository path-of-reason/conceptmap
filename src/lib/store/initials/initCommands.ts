import { CMDKEYS } from "$lib/constant/commandKey";
import { API } from "$lib/store/api";
import { TauriApi } from "$lib/tauri/api";
import { Effect } from "effect";

export const initCommand = () => {
  API.command.addCommandList([
    {
      key: CMDKEYS.LAYOUT.ZOOM.IN,
      description: "LAYOUT: zoom in",
      action: API.layout.zoomIn,
    },
    {
      key: CMDKEYS.LAYOUT.ZOOM.OUT,
      description: "LAYOUT: zoom out",
      action: API.layout.zoomOut,
    },
  ]);
  // layout command
  API.command.addCommandList([
    {
      key: CMDKEYS.LEFTSIDEBAR.NEXT,
      description: "LAYOUT: next left sidebar view",
      action: API.view.nextLeftView,
    },
    {
      key: CMDKEYS.LEFTSIDEBAR.PREV,
      description: "LAYOUT: prev left sidebar view",
      action: API.view.prevLeftView,
    },
    {
      key: CMDKEYS.RIGHTSIDEBAR.NEXT,
      description: "LAYOUT: next right sidebar view",
      action: API.view.nextRightView,
    },
    {
      key: CMDKEYS.RIGHTSIDEBAR.PREV,
      description: "LAYOUT: prev right sidebar view",
      action: API.view.prevRightView,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.ZEN,
      description: "LAYOUT: toggle zen mode",
      action: API.section.toggleZenMode,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.HEADER,
      description: "LAYOUT: toggle header bar",
      action: API.section.toggleHeader,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.STATUS,
      description: "LAYOUT: toggle status bar",
      action: API.section.toggleStatusbar,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.LEFT,
      description: "LAYOUT: toggle left side bar",
      action: API.section.toggleLeftSidebar,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.RIGHT,
      description: "LAYOUT: toggle right side bar",
      action: API.section.toggleRightSidebar,
    },
    {
      key: CMDKEYS.LAYOUT.TOGGLE.MODAL,
      description: "LAYOUT: toggle modal",
      action: API.modal.toggleModal,
    },
    {
      key: CMDKEYS.LAYOUT.MODAL.OPEN_PALETTE,
      description: "MODAL: open command palette",
      action: () => API.modal.openModal("pallete"),
    },
    {
      key: CMDKEYS.LAYOUT.MODAL.OPEN_VAULT_SETUP,
      description: "MODAL: open vault setup modal",
      action: () => API.modal.openModal("vaultSetup"),
    },
    {
      key: CMDKEYS.LAYOUT.MODAL.CLOSE,
      description: "MODAL: close modal",
      action: API.modal.closeModal,
    },
  ]);
  // workspace command
  API.command.addCommandList([
    {
      key: CMDKEYS.WORKSPACE.TOGGLE.LAYOUTMODE,
      description: "WORKSPACE: toggle layout mode",
      action: API.workspace.toggleLayoutMode,
    },
    {
      key: CMDKEYS.WORKSPACE.TAB.NEW,
      description: "WORKSPACE: add new tab",
      action: API.workspace.createNewTab,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.INCREASE.WIDTH,
      description: "WORKSPACE: increase cell width",
      action: API.workspace.CellActions.increaseCellWidth,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.DECREASE.WIDTH,
      description: "WORKSPACE: decrease cell width",
      action: API.workspace.CellActions.decreaseCellWidth,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.INCREASE.HEIGHT,
      description: "WORKSPACE: increase cell height",
      action: API.workspace.CellActions.increaseCellHeight,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.DECREASE.HEIGHT,
      description: "WORKSPACE: decrease cell height",
      action: API.workspace.CellActions.decreaseCellHeight,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.SPLIT.VERTICAL,
      description: "WORKSPACE: split vertical cell grid",
      action: API.workspace.CellActions.splitVertical,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.SPLIT.HORIZONTAL,
      description: "WORKSPACE: split horizontal cell grid",
      action: API.workspace.CellActions.splitHorizontal,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.REMOVE.VERTICAL,
      description: "WORKSPACE: remove vertical cell grid",
      action: API.workspace.CellActions.removeVertical,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.REMOVE.HORIZONTAL,
      description: "WORKSPACE: remove horizontal cell grid",
      action: API.workspace.CellActions.removeHorizontal,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.FOCUS.UP,
      description: "WORKSPACE: focus cell up",
      action: API.workspace.CellActions.moveFocusUp,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.FOCUS.LEFT,
      description: "WORKSPACE: focus cell left",
      action: API.workspace.CellActions.moveFocusLeft,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.FOCUS.RIGHT,
      description: "WORKSPACE: focus cell right",
      action: API.workspace.CellActions.moveFocusRight,
    },
    {
      key: CMDKEYS.WORKSPACE.CELL.FOCUS.DOWN,
      description: "WORKSPACE: focus cell down",
      action: API.workspace.CellActions.moveFocusDown,
    },
    {
      key: CMDKEYS.WORKSPACE.TAB.NEXT,
      description: "WORKSPACE: next tab",
      action: API.workspace.nextTab,
    },
    {
      key: CMDKEYS.WORKSPACE.TAB.PREV,
      description: "WORKSPACE: prev tab",
      action: API.workspace.prevTab,
    },
  ]);

  // Kuzu test command
  const kuzuTestAction = () => {
    const effect = TauriApi.kuzu.kuzuTest();
    Effect.runPromise(effect)
      .then((result: string[]) => {
        console.log("Kuzu Test Success:", result);
      })
      .catch((error) => {
        console.error("Kuzu Test Failed:", error);
      });
  };

  API.command.addCommandList([
    {
      key: CMDKEYS.KUZU.TEST,
      description: "KUZU: run kuzu test command",
      action: kuzuTestAction,
    },
  ]);
};
