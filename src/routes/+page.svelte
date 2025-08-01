<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

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
