import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import {
  defineConfig,
  loadEnv,
  type ProxyOptions,
  type UserConfig,
} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }: { mode: string }): UserConfig => {
  // 환경변수 불러오기
  const env = loadEnv(mode, process.cwd(), "");

  // Proxy Setting -- dev 모드에서만 적용
  const proxySettings: Record<string, string | ProxyOptions> =
    mode !== "production"
      ? {
          "/api": {
            target: env.VITE_API_SERVER,
            changeOrigin: true,
            secure: false,
            configure: (proxy) => {
              proxy.on("proxyReq", (proxyReq) => {
                proxyReq.removeHeader("origin");
              });
            },
          },
        }
      : {}; // dev 모드가 아닐 때는 프록시 설정을 빈 객체로 둠

  return defineConfig({
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routeFileIgnorePattern: "((step\\d+)|utils)\\.tsx?$|_shared",
      }),
      react(),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: env.VITE_BASE_PATH,
    server: {
      host: true, // 네트워크에서 접근 가능하도록 설정
      port: parseInt(env.VITE_BASE_PORT, 10) || 5173,
      strictPort: true, // 포트 고정 (이미 사용 중이면 에러 발생)
      proxy: proxySettings,
    },

    build: {
      outDir: env.VITE_MODE,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return undefined;
            }

            const packagePath = id.split("node_modules/")[1];
            const packageName = packagePath.startsWith("@")
              ? packagePath.split("/").slice(0, 2).join("/")
              : packagePath.split("/")[0];

            return `vendor-${packageName.replace(/[@/]/g, "-")}`;
          },
        },
      },
    },
  });
};
