<script lang="ts">
  import { onMount } from 'svelte'; // onMount 임포트
  import "$lib/store/initials"
  import "../app.css";
  import AppLayout from "@/layout/AppLayout.svelte";
  import { LogApi } from "$lib/store/log.svelte"; // LogApi 임포트

  let { children } = $props();

  onMount(() => {
    // console.log 메서드들을 재정의하여 LogApi로 로그를 보냅니다.
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    const originalConsoleInfo = console.info;

    console.log = function(...args) {
      originalConsoleLog.apply(console, args);
      LogApi.log(...args);
    };
    console.warn = function(...args) {
      originalConsoleWarn.apply(console, args);
      LogApi.warn(...args);
    };
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
      LogApi.error(...args);
    };
    console.info = function(...args) {
      originalConsoleInfo.apply(console, args);
      LogApi.info(...args);
    };

    // 기존 console 객체의 다른 메서드들도 필요하다면 재정의할 수 있습니다。
  });
</script>

<div class="w-screen h-screen bg-transparent">
  <AppLayout>
    {@render children?.()}
  </AppLayout>
</div>
