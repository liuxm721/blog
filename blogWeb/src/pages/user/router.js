import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

import Index from "./views/Index.vue"
import Square from "./components/square/Square.vue"
import Follow from "./components/follow/Follow.vue"
import Contribution from "./components/contribution/Contribution.vue"
import MyArticle from "./components/myArticle/MyArticle.vue"
import ArticleDetail from "./components/articleDetail/ArticleDetail.vue"
import Search from "./components/search/Search.vue"
import Interaction from "./components/interaction/Interaction.vue"
import Zone from "./components/zone/Zone.vue"
import UserInfo from "./components/userInfo/UserInfo.vue"

let routes = [
  {
    path: "/",
    component: Index,
    redirect: "/square",
    children: [
      {
        path: "square",
        name: "square",
        component: Square,
      },
      {
        path: "articledetail",
        name: "articledetail",
        component: ArticleDetail
      },
      {
        path: "follow",
        name: "follow",
        component: Follow
      },
      {
        path: "contribution",
        name: "contribution",
        component: Contribution
      },
      {
        path: "myarticle",
        name: "myarticle",
        component: MyArticle
      },
      {
        path: "search",
        name: "search",
        component: Search
      },
      {
        path: "interaction",
        name: "interaction",
        component: Interaction,
      },
      {
        path: "zone",
        name: "zone",
        component: Zone
      },
      {
        path: "userinfo",
        name: "userinfo",
        component: UserInfo
      }
    ]

  }
]

let router = new VueRouter({ routes })

let visitor = ["/square", "/articledetail", "/search", "/zone"]

router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem("authorization")) {
    next()
  } else if (visitor.includes(to.path)) {
    next()
  }
})

export default router