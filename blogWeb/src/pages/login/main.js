import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import "element-ui/lib/theme-chalk/display.css"
import Vue from "vue"
import App from "./App.vue"
import "../../assets/css/init.css"
import router from "./router.js"

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router
}).$mount("#app")