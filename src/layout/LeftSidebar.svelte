<script lang="ts">
  import { slide } from "svelte/transition";
  import { useLayoutStore } from "./resizable-pane/layoutStore.svelte";
  // import { load } from "$lib/plugin/pluginLoadStore.svelte";
  // import { PluginApi } from "$lib/plugin/api";
  import { mount } from "svelte";
  import { Exit, Effect, Cause } from "effect";
  import { readFile } from "$lib/tauri/fileSystem";

  const { sectionState } = useLayoutStore<"vertical">({
    id: "leftSidebar",
  });
  let div: HTMLDivElement;

  const loadPlugin = () => {
    const path =
      "/Users/wistaria/Documents/por/.app/plugins/secondPlugin/dist/main.js";
    Effect.runPromiseExit(readFile(path, false)).then((exit) => {
      Exit.match(exit, {
        onSuccess: async (content) => {
          try {
            console.log(content.length);
            const blob = new Blob([content], { type: "text/javascript" });
            const blobUrl = URL.createObjectURL(blob);
            const pluginModule = await import(/* @vite-ignore */ blobUrl);
            console.log(pluginModule);
            const component = pluginModule.bundle.component;
            mount(component, {
              target: div,
            });
          } catch (error) {
            console.error("Error loading plugin:", error);
          }
        },
        onFailure: (cause) => {
          const prettyErrors = Cause.prettyErrors(cause);
          console.error("Error reading file:", prettyErrors);
        },
      });
    });
  };
</script>

<div bind:this={div}></div>
<div class="rounded-lg overflow-hidden bg-amber-400 w-full h-full">
  {#if !sectionState.collapsed}
    <div transition:slide class="w-full text-center bg-emerald-400 text-nowrap">
      original
    </div>
  {/if}
  <button onclick={loadPlugin}>load plugin</button>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
  <div>hello Lorem ipsum dolor hello Lorem ipsum dolor</div>
</div>
