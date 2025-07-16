import { PluginApi } from "./api";

type PluginManifest = {
  id: string;
  name: string;
  main: string; // 플러그인 진입점 파일 경로 (예: './index.js')
  version: string;
  description?: string;
};

/**
 * 특정 플러그인을 로드하고 활성화합니다.
 * @param manifestPath - 플러그인 manifest.json 파일의 경로
 */
export async function loadPlugin(manifestPath: string): Promise<void> {
  try {
    const manifest: PluginManifest = await fetch(manifestPath).then((res) =>
      res.json(),
    );
    const pluginBasePath = manifestPath.substring(
      0,
      manifestPath.lastIndexOf("/"),
    );
    const entryPointUrl = `${pluginBasePath}/${manifest.main}`;

    // 동적으로 모듈 임포트
    const pluginModule = await import(/* @vite-ignore */ entryPointUrl);

    // 플러그인 진입점에서 registerView 등을 호출하도록 가정
    if (typeof pluginModule.activate === "function") {
      console.log(`Activating plugin: ${manifest.name}`);
      pluginModule.activate({ registerView: PluginApi.registerView }); // 플러그인에 API 전달
    } else {
      console.warn(
        `Plugin "${manifest.name}" does not have an 'activate' function.`,
      );
    }
  } catch (error) {
    console.error(`Failed to load plugin from ${manifestPath}:`, error);
  }
}

/**
 * 모든 플러그인을 스캔하고 로드합니다.
 * (이것은 매우 기본적인 예시이며, 실제로는 빌드 시스템과 통합되거나 더 복잡한 로직이 필요합니다.)
 */
export async function loadAllPlugins(): Promise<void> {
  const pluginManifests = [
    "/plugins/my-first-plugin/manifest.json",
    // '/plugins/another-plugin/manifest.json',
  ];

  for (const manifest of pluginManifests) {
    await loadPlugin(manifest);
  }
}
