import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/index.vue";
import { getToken } from "@/utils/http/token";

const router = createRouter({
  history: createWebHistory("/topoNew/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      redirect: "/editor",
      children: [
        {
          path: "/meta-icon",
          name: "MetaIcon",
          component: () => import("../views/meta/index.vue")
        }
      ]
    },
    {
      path: "/editor",
      name: "Editor",
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

// router.beforeEach((to, from, next) => {
//   const token = getToken();
//   console.log("🚀 ~ router.beforeEach ~ token:", token);
//   if (to.name !== "Login" && !token) {
//     next({ name: "Login" });
//   } else {
//     next();
//   }
// });
export default router;
