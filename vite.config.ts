import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget =
    env.VITE_API_PROXY || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "react-code-base": path.resolve(
          __dirname,
          "react_code_base/src/index.ts",
        ),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
        "/media": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
