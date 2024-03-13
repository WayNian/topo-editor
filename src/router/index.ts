import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/editor",
      name: "editor",
      component: () => import("../views/editor/index.vue")
    },
    {
      path: "/parse",
      name: "parse",
      component: () => import("../views/parse/index.vue")
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login/index.vue")
    }
  ]
});

export default router;
