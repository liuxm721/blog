import Vue from "vue"
import VueRouter from "vue-router"
import Index from "./views/Index.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import Validator from "./components/Validator.vue"
import Reset from "./components/Reset.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Index,
    redirect: "/login",
    children: [
      {
        path: "login",
        component: Login
      },
      {
        path: "register",
        component: Register
      },
      {
        path: "validator",
        component: Validator
      },
      {
        path: "reset",
        component: Reset
      }
    ]
  }
]

const router = new VueRouter({ routes })

export default router
