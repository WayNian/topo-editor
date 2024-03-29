import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";
import VueDevTools from "vite-plugin-vue-devtools";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    UnoCSS(),
    svgLoader({
      defaultImport: "url"
    }),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 3003,
    host: "0.0.0.0",
    proxy: {
      "/action": {
        // target: "http://172.19.139.246:6722/",
        target: "http://172.19.42.25:10017",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/action/, "")
      },
      "/file": {
        target: "http://172.19.139.246:6722/file",
        // target: "http://172.19.42.25:6722/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/file/, "")
      }
    }
  }
});
