<script lang="ts">
  import { onMount } from "svelte";
  import { layoutState, ViewApi } from "../views/ViewApi.svelte";

  let { children } = $props();

  const position = (main:HTMLElement)=>{
    const setPosition = ()=>{
      const {clientTop, clientLeft, clientWidth, clientHeight} =main
      ViewApi.setMainPosition(clientLeft, clientTop, clientWidth, clientHeight);
    }
    setPosition()
    window.addEventListener('resize', setPosition)
    $effect(()=>{
      return ()=>{
        window.removeEventListener('resize',  setPosition)
      }
    })
  }

</script>

<main use:position class={[
  "w-full h-full rounded-md overflow-y-scroll",
  "bg-black/20 text-white/50",
  layoutState.isResize && "select-none"
]}>

  {@render children?.()}
</main>
