import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import "@/assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router).use(createPinia()).mount("#app");
