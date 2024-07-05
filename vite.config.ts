import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { defineConfig } from "vite";
// import VueDevTools from "vite-plugin-vue-devtools";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : "/topoNew/",
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/] // <--
    }),
    Markdown({}),
    // VueDevTools(),
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
      "/action/topo/index": {
        target: "http://172.19.139.246:10003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/action\/topo\/index/, "/index")
      },
      "/action/topo/dataSource": {
        target: "http://172.19.139.246:6818/",
        // target: "http://172.19.139.246:10003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/action\/topo\/dataSource/, "/dataSource")
      },
      "/action": {
        // target: "http://172.19.139.246:6722/",
        target: "http://172.19.139.253:10017",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/action/, "")
      },

      "/wiscom": {
        target: "http://172.19.42.25:6818/",
        // target: "http://172.19.42.25:6722/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wiscom/, "")
      }
    }
  }
});
