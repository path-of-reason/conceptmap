<script lang="ts">
  import * as Icons from "@lucide/svelte/icons";
  import { goto } from "$app/navigation";
  import { API } from "$lib/store/api";

  let address = $state("");
  const keydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (address.includes("http"))
        window.location = address as string & Location;
      else goto(address);
    }
    if (e.key === "Escape") {
      document.getElementById("searchbar")?.blur();
    }
  };
  API.hotkey.registerAll([
    {
      hotkeySequence: ["meta", "k"],
      callback: () => {
        console.log("focus searchbar");
        document.getElementById("searchbar")?.focus();
      },
      description: "focus searchbar",
      options: { mode: "normal" },
    },
    {
      hotkeySequence: ["space", "k"],
      callback: () => {
        console.log("focus searchbar");
        document.getElementById("searchbar")?.focus();
      },
      description: "focus searchbar",
      options: { mode: "leader" },
    },
  ]);
</script>

<div class="w-full px-1 flex">
  <div class="flex items-center gap-1 pr-2">
    <button class="text-white/50">
      <Icons.CircleChevronLeft />
    </button>
    <button class="text-white/50">
      <Icons.CircleChevronRight />
    </button>
    <button class="text-white/50">
      <Icons.CircleChevronUp />
    </button>
  </div>
  <input
    id="searchbar"
    class="grow bg-black/20 text-white/70 rounded-sm outline-none px-2"
    type="text"
    bind:value={address}
    onkeydown={keydown}
  />
</div>
