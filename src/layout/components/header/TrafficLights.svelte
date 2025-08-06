<script lang="ts">
  import { slide } from "svelte/transition";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  const appWindow = getCurrentWindow();
  const close = () => appWindow.close();
  const minimize = () => appWindow.minimize();
  const maximize = async () => {
    const result = await appWindow.isFullscreen();
    appWindow.setFullscreen(!result);
  };
</script>

<div class="flex-none flex items-center h-full gap-2 px-2" transition:slide>
  <button
    onclick={close}
    tabindex="-1"
    class="relative w-3 h-3 rounded-full bg-[#ff6159] border border-black/10 group focus:outline-none"
  >
    <span
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
    >
      <!-- X 아이콘 (닫기) -->
      <span class="block w-2 h-0.5 bg-[#4d0000] rotate-45"></span>
      <span class="block w-2 h-0.5 bg-[#4d0000] -rotate-45 absolute"></span>
    </span>
  </button>
  <button
    onclick={minimize}
    tabindex="-1"
    class="relative w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 group focus:outline-none"
  >
    <span
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
    >
      <!-- - 아이콘 (최소화) -->
      <span class="block w-2 h-0.5 bg-[#995700]"></span>
    </span>
  </button>
  <button
    onclick={maximize}
    tabindex="-1"
    class="relative w-3 h-3 rounded-full bg-[#28c941] border border-black/10 group focus:outline-none"
  >
    <span
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
    >
      <!-- + 아이콘 (최대화) -->
      <span class="block w-2 h-0.5 bg-[#006500]"></span>
      <span class="block h-2 w-0.5 bg-[#006500] absolute"></span>
    </span>
  </button>
</div>
