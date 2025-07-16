import { Cause, Effect, Exit } from "effect";
import { readFile } from "./fileSystem";
import { PluginApi } from "$lib/plugin/api";
import { loadLeftSidebar } from "$lib/plugin/pluginLoadStore.svelte";

const path =
  "/Users/wistaria/Documents/por/.app/plugins/secondPlugin/dist/main.js";
Effect.runPromiseExit(readFile(path, false)).then((exit) => {
  Exit.match(exit, {
    onSuccess: async (content) => {
      console.log(content.length);
      const blob = new Blob([content], { type: "text/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      const pluginModule = await import(/* @vite-ignore */ blobUrl);
      console.log(pluginModule);
      pluginModule.activate(PluginApi);
      pluginModule.test("hello world");
      loadLeftSidebar();
    },
    onFailure: (cause) => {
      const prettyErrors = Cause.prettyErrors(cause);
      console.error("Error reading file:", prettyErrors);
    },
  });
});
