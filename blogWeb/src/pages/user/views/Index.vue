<template>
  <el-container>

    <!-- header -->
    <el-header>
      <el-row
        class="width"
        type="flex"
        justify="space-between"
      >
        <div id="logo">
          <el-image :src="logo"></el-image>
          <span>梦渊博客</span>
        </div>
        <el-input
          style="width: 50%"
          v-model="search"
        >
          <el-button
            v-model="search"
            slot="append"
            icon="el-icon-search"
            @click="searchArticle"
          ></el-button>
        </el-input>
        <el-dropdown v-if="user.power.user">
          <el-avatar :src="user.avatar"></el-avatar>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button
                @click="logout"
                type="text"
              >退出</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-link
          v-else
          href="/login.html"
        >登录/注册</el-link>
      </el-row>
    </el-header>

    <!-- body -->

    <el-row class="width">
      <el-row :gutter="20">
        <!-- left aside -->
        <el-col :span="4">
          <el-menu
            id="aside"
            mode="vartical"
            :router="true"
            select="chang"
            :default-active="checkedMenu"
            @select="selectMenu"
          >
            <el-menu-item
              index="square"
              route="square"
            >广场</el-menu-item>
            <div v-if="user.power.user">
              <el-menu-item
                v-for="(item, index) in nav"
                :key="index"
                :index="item.route"
                :route="item.route"
              >{{item.text}}</el-menu-item>
            </div>
            <el-menu-item
              v-if="user.power.admin"
              index="siteadmin"
            >站点管理</el-menu-item>
          </el-menu>
        </el-col>

        <!-- main -->
        <el-col :span="14">
          <router-view id="main"></router-view>
        </el-col>

        <!-- right aside -->
        <el-col :span="6">
          <el-container id="info">
            <RightAside></RightAside>
          </el-container>
        </el-col>

      </el-row>
    </el-row>
    <el-footer
      id="footer"
      height="auto"
    >
      <el-row>
        <el-col
          class="hidden-sm-and-down"
          :span="12"
        >
          <el-link
            type="info"
            :underline="false"
            href="https://www.microsoft.com/zh-cn/edge"
            target="blank"
          >推荐使用 新版 Microsoft Edge 浏览器 访问本站</el-link>
        </el-col>
        <el-col :span="12">
          <el-link
            type="info"
            :underline="false"
            target="blank"
            href="https://beian.miit.gov.cn"
          >互联网ICP备案：黔ICP备19012207号-3</el-link>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import logo from "../../../assets/img/logo.png"
import RightAside from "../components/rightAside/RightAside.vue"
import service from "../../../service/user.js"
import Tool from "@/components/Tool.vue"
import config from '../../../config.js'

export default {
  mixins: [Tool],
  created () {
    this.getUserInfo()
    this.checkedMenu = this.$route.name
  },
  data () {
    return {
      search: "",
      ws: null,
      logo,
      checkedMenu: "",
      user: {
        power: "",
        avatar: "",
      },
      tipChatNotice: null,
      tipLoginMessage: "",
      nav: [
        { text: "动态", route: "follow" },
        { text: "互动消息", route: "interaction" },
        { text: "编辑投稿", route: "contribution" },
        { text: "文章管理", route: "myarticle" },
        { text: "个人信息", route: "userinfo" }
      ],
    }
  },
  watch: {
    $route () {
      this.checkedMenu = this.$router.name
    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.go(0)
    },
    searchArticle () {
      this.$router.push("/search?title=" + this.search)
    },
    selectMenu (index) {
      index === 'siteadmin' && window.location.replace('/admin.html')
      if (index !== "square" && !sessionStorage.getItem("authorization")) {
        this.tipLoginMessage("warning", "请登录")
      }
    },
    getUserInfo () {
      service.getUserInfo().then((res) => {
        let data = res.data
        console.log(data)
        if (data.data) {
          this.user.power = data.data.power
          this.user.avatar = data.data.avatar
          sessionStorage.setItem("account", data.data.account)
          sessionStorage.setItem("avatar", data.data.avatar)
          sessionStorage.setItem("name", data.data.name)
          sessionStorage.setItem("key", data.data.key)
          this.initWebSocket(data.data.key)
        }
      })
    },
    initWebSocket (key) {
      this.ws = new WebSocket(config.noticeURL + key)
      this.ws.addEventListener("message", this.onMessage)
      this.ws.addEventListener("open", this.onOpen)
      this.ws.addEventListener("close", this.onClose)
      this.ws.addEventListener("error", this.onError)
      this.tipChatNotice = this.throttle(this.notify, 1000 * 30)
      this.heartCheck(key)
    },
    heartCheck (key) {
      setInterval(() => {
        console.log("再也不掉线了")
        if (this.ws.readyState === 1) {
          this.ws.send(JSON.stringify({ message: 'ping' }))
        } else {
          this.initWebSocket(key)
        }
      }, 1000 * 56)
    },
    onMessage (event) {
      let data = JSON.parse(event.data)
      switch (data.type) {
        case 'chat':
          this.tipChatNotice("success", "您有一条私信", "来自***")
      }
    },
    onOpen () {
      this.$message({ type: "success", message: "通知开启" })
    },
    onClose () {
      this.$message({ type: "waring", message: "通知关闭" })
    },
    onError () {
      this.ws = new WebSocket("wss://shop.weiaiyanyan.com/chat?key=" + this.user.slef.key)
      this.$message({ type: "danger", message: "连接失败，重连中..." })
    },
    notify (type = "success", title = "无标题", message = "无消息") {
      this.$notify({ type: "success", title: "私信提醒", message: "你有一条新消息" })
    }
  },
  components: {
    RightAside,
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  padding: 10px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}
.el-aside {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
#logo {
  display: flex;
  font-size: 1.5rem;
  align-items: center;
  .el-image {
    width: 2.5rem;
    height: 2.5rem;
  }
}
#aside,
#main {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0);
  background-color: #fff;
  padding: 10px;
  .el-menu-item {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.width {
  width: 1200px;
  margin: 0 auto;
}

#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;
}
</style>