<template>
  <el-row>

    <!-- background -->
    <el-col
      :span="14"
      class="hidden-sm-and-down fill-height"
    >
      <el-image
        :src="loginBg"
        fit="cover"
        class="fill-height"
      ></el-image>
    </el-col>

    <!-- login / register -->
    <el-col
      :span="24"
      :md="10"
      class="relative fill-height"
      style="overflow: auto"
    >
      <el-row>
        <el-col
          :span="18"
          :offset="3"
          style="margin-top: 20vh"
        >
          <!-- logo -->
          <el-row
            type="flex"
            id="logo"
          >
            <el-image
              :src="logo"
              fit="cover"
            ></el-image>
            <span>梦渊博客</span>
          </el-row>
          <!-- switch module -->
          <router-view></router-view>
        </el-col>
      </el-row>

      <!-- footer -->
      <el-row id="footer">
        <hr>
        <el-col class="hidden-sm-and-down">
          <el-link
            type="info"
            :underline="false"
            href="https://www.microsoft.com/zh-cn/edge"
            target="blank"
          >推荐使用 新版 Microsoft Edge 浏览器 访问本站</el-link>
        </el-col>
        <el-col>
          <el-link
            type="info"
            :underline="false"
            target="blank"
            href="https://beian.miit.gov.cn"
          >互联网ICP备案：黔ICP备19012207号-3</el-link>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import loginBg from "../../../assets/img/login_bg.jpg"
import logo from "../../../assets/img/logo.png"
export default {
  data () {
    return {
      loginBg,
      logo,
      flag: true,
    }
  },
};
</script>
<style lang="scss" scoped>
.fill-height {
  height: 100vh;
}
#logo {
  .el-image {
    width: 2.5rem;
    height: 2.5rem;
  }
  span {
    font-size: 2rem;
    letter-spacing: 0.5rem;
    margin-left: 0.5rem;
  }
}
#footer {
  margin-top: 20vh;
  margin-bottom: 10px;
  text-align: center;
}
hr {
  margin: 10px 10%;
}
</style>