<script lang="ts">
  import Grid from "../../layout/work-space/Grid.svelte";
  import {
    CellUtil,
    useLayoutStore,
  } from "../../layout/work-space/layoutStore.svelte";
  import Bookmark from "../../layout/work-space/Bookmark.svelte";
  import { hotkeys } from "$lib/hooks/useKeyboard.svelte";

  const { layoutStore } = useLayoutStore();

  hotkeys.registers([
    {
      hotkeySequence: ["space", "tab"],
      callback: () => {
        layoutStore.root.mode =
          layoutStore.root.mode === "grid" ? "bookmark" : "grid";
      },
      description: "toggle Workspace layout mode",
      options: { mode: "leader" },
    },
    {
      hotkeySequence: ["meta", "shift", "-"],
      callback: CellUtil.decreaseCellWidth,
      description: "focused panel width -",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["meta", "shift", "="],
      callback: CellUtil.increaseCellWidth,
      description: "focused panel width +",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["space", "s", "v"],
      callback: CellUtil.splitVertical,
      description: "Split panel vertical",
      options: { mode: "leader" },
    },
    {
      hotkeySequence: ["space", "d", "v"],
      callback: CellUtil.removeVertical,
      description: "Delete panel vertical",
      options: { mode: "leader" },
    },
    {
      hotkeySequence: ["space", "s", "h"],
      callback: CellUtil.splitHorizontal,
      description: "Split panel horizontal",
      options: { mode: "leader" },
    },
    {
      hotkeySequence: ["space", "d", "h"],
      callback: CellUtil.removeHorizontal,
      description: "Delete panel horizontal",
      options: { mode: "leader" },
    },
    {
      hotkeySequence: ["ctrl", "h"],
      callback: CellUtil.moveFocusLeft,
      description: "Move left focus cell",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["ctrl", "j"],
      callback: CellUtil.moveFocusDown,
      description: "Move down focus cell",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["ctrl", "k"],
      callback: CellUtil.moveFocusUp,
      description: "Move up focus cell",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["ctrl", "l"],
      callback: CellUtil.moveFocusRight,
      description: "Move right focus cell",
      options: { mode: "normal" },
    },
  ]);
</script>

<div class="h-full w-full overflow-hidden">
  {#if layoutStore.root.mode === "grid"}
    <Grid />
  {:else if layoutStore.root.mode === "bookmark"}
    <Bookmark />
  {/if}
</div>
