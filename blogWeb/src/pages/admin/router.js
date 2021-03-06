import Vue from "vue"
import VueRouter from "vue-router"
import Index from "./views/Index.vue"
import service from "../../service/admin.js"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Index,
    redirect: "/index",
    children: [
      {
        path: "index",
        component: Index
      }
    ]
  }
]

const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  service.getAdmin().then(res => {
    let data = res.data
    console.log(data)
    if (data.status) {
      next()
    }
  })
})

export default router
