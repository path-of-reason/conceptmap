import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
export const appWindow = new Window("my-label");

appWindow.once("tauri://created", async function () {
  const webview = new Webview(appWindow, "my-label", {
    url: "https://github.com/tauri-apps/tauri",

    // create a webview with specific logical position and size
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  });

  webview.once("tauri://created", function () {
    // webview successfully created
  });
  webview.once("tauri://error", function (e) {
    // an error happened creating the webview
  });
});
