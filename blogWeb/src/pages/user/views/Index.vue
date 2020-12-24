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
          <span>深壹博客</span>
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
        <el-dropdown v-if="isUser">
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
          href="http://192.168.3.78/login.html"
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
              v-for="(item, index) in nav"
              :key="index"
              :index="item.route"
              :route="item.route"
            >{{item.text}}</el-menu-item>

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
  </el-container>
</template>

<script>
import logo from "../../../assets/img/logo.png"
import RightAside from "../components/rightAside/RightAside.vue"
import service from "../../../service/user.js"
import Tool from "@/components/Tool.vue"

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
        { text: "广场", route: "square" },
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
  computed: {
    isUser () {
      return !!this.user.power.includes("user")
    },
  },
  methods: {
    logout () {
      sessionStorage.removeItem("authorization")
      sessionStorage.removeItem("avatar")
      sessionStorage.removeItem("account")
      this.$router.go(0)
    },
    searchArticle () {
      this.$router.push("/search?title=" + this.search)
    },
    selectMenu (index) {
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
      this.ws = new WebSocket("ws://192.168.3.78:8090/notice?key=" + key)
      this.ws.addEventListener("message", this.onMessage)
      this.ws.addEventListener("open", this.onOpen)
      this.ws.addEventListener("close", this.onClose)
      this.ws.addEventListener("error", this.onError)
      this.tipChatNotice = this.throttle(this.notify, 1000 * 60)
    },
    onMessage (event) {
      let data = JSON.parse(event.data)
      switch (data.type) {
        case 'chat':
          this.tipChatNotice("success", "您有一条私信", "来自***")
      }
    },
    onOpen () {
      this.$message({ type: "success", message: "连接成功" })
    },
    onClose () {
      this.$message({ type: "waring", message: "连接关闭" })
    },
    onError () {
      this.ws = new WebSocket("ws://192.168.3.78:8090/chat?key=" + this.user.slef.key)
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
</style>