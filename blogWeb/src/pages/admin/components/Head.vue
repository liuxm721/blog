<template>
  <el-row
    type="flex"
    justify="space-between"
    align="center"
    class="header"
  >
    <div>
      <el-image
        :src="logo"
        fit="cover"
      ></el-image>
      <span>梦渊博客</span>
    </div>
    <div>
      <el-link
        href="/"
        :underline="false"
        icon="el-icon-s-home"
      >返回博客</el-link>
      <el-dropdown @command="clickdrop">
        <el-avatar :src="avatar"></el-avatar>
        <el-dropdown-menu>
          <el-dropdown-item command='exit'>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-row>
</template>

<script>
import logo from "../../../assets/img/logo.png"
export default {
  data () {
    return {
      logo,
      avatar: sessionStorage.getItem('avatar')
    }
  },
  methods: {
    clickdrop (fn) {
      console.log(fn)
      this[fn]()
    },
    exit () {
      sessionStorage.clear()
      this.$router.go(0)
    }
  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
.header > div {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  .el-image {
    width: 40px;
    height: 40px;
    margin-right: 15px;
  }
  .el-link {
    margin-right: 15px;
  }
}
</style>
