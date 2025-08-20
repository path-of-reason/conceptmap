<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import TabUi from "@/layout/components/header/TabUI.svelte";

  let name = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    greetMsg = await invoke("greet", { name });
  }
</script>

<main class="h-full text-lg text-black">
  <h1>Welcome to Tauri + Svelte</h1>
  sadfasdfasdfsadf
</main>
