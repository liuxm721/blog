import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import 'element-ui/lib/theme-chalk/display.css'
import Vue from "vue"
import App from "./App.vue"
import "../../assets/css/init.css"
import "../../assets/img/favicon.ico"
import router from "./router.js"
import InfiniteScroll from 'v-infinite-scroll'
Vue.use(InfiniteScroll)
Vue.use(ElementUI)

new Vue({
    render: h => h(App),
    router
}).$mount("#app")