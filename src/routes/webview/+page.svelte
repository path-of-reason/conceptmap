<script lang="ts">
  // import { Webview } from "@tauri-apps/api/webview";
  // import { Window } from "@tauri-apps/api/window";
  // import { getCurrentWindow } from "@tauri-apps/api/window";
  // import { onMount } from "svelte";
  // import { WebviewWindow } from "@tauri-apps/api/webviewWindow"; // For window-specific operations
  // import { invoke } from "@tauri-apps/api/core";

  // async function openNewWebViewWindow() {
  //   try {
  //     // Create or manage a new window (which uses WebView under the hood)
  //     console.log("hello webview");
  //     const webview = new WebviewWindow("main", {
  //       url: "https://www.google.com", // Load a specific URL
  //       title: "My Tauri App Window",
  //       width: 800,
  //       height: 600,
  //     });

  //     await webview.once("tauri://created", async () => {
  //       console.log("New WebView window created!");
  //       webview.show();
  //     });
  //     webview.emit("tauri://created", { message: "Hello from Svelte!" });
  //   } catch (error) {
  //     console.error("WebView operation failed:", error);
  //   }
  // }

  // async function openNewWebView() {
  //   try {
  //     const appWindow = new Window("main");
  //     console.log("hello webview");
  //     const webview = new Webview(appWindow, "main", {
  //       url: "https://www.google.com", // Load a specific URL
  //       x: 0,
  //       y: 0,
  //       width: 800,
  //       height: 600,
  //     });

  //     await webview.once("tauri://created", async () => {
  //       console.log("New WebView window created!");
  //       webview.show();
  //     });
  //     webview.emit("tauri://created", { message: "Hello from Svelte!" });
  //   } catch (error) {
  //     console.error("WebView operation failed:", error);
  //   }
  // }

  // let { data }: PageProps = $props();

  // const appWindow = new Window("main");

  // onMount(() => {
  //   console.log(data.url);
  //   // div 위치·크기 계산
  //   const anchor = document.getElementById("webview-anchor")!;
  //   const rect = anchor.getBoundingClientRect();
  //   console.log(rect);

  //   const webview = new Webview(appWindow, "sub-webview", {
  //     url: "https://" + data.url,
  //     x: rect.left,
  //     y: rect.top,
  //     width: rect.width,
  //     height: rect.height,
  //   });
  //   webview.show();

  //   // 창 크기가 바뀔 때마다 재조정
  //   // window.addEventListener("resize", () => {
  //   //   const r = anchor.getBoundingClientRect();
  //   //   webview.
  //   //   webview.setBounds({
  //   //     x: r.left,
  //   //     y: r.top,
  //   //     width: r.width,
  //   //     height: r.height,
  //   //   });
  //   // });
  // });
</script>
