import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import GMap from "@/components/GMap";
import x from "@/components/x";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/music/:place/:lat/:lon",
      name: "GMap",
      component: GMap
    },
    {
      path: "/x",
      name: "x",
      component: x
    }
  ]
});
