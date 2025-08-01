import { invoke } from "@tauri-apps/api/core";

export const loadTime = async () => {
  try {
    const loadTimeMs = (await invoke("get_load_time")) as number;
    console.log(`Initial app load time: ${loadTimeMs}ms`);
    return loadTimeMs;
  } catch (error) {
    console.error("Failed to get load time:", error);
  }
};

// 모든 리소스(이미지, 스크립트 등)까지 완전히 로드된 시점을 측정하고 싶다면 'load' 이벤트를 사용
// window.addEventListener('load', async () => {
//     try {
//         const loadTimeMs = await invoke('get_load_time');
//         console.log(`Full app load time (after all resources): ${loadTimeMs}ms`);
//     } catch (error) {
//         console.error("Failed to get full load time:", error);
//     }
// });
