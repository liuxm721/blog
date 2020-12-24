<template>
  <el-row class="container">
    <el-avatar :src="avatar"></el-avatar>
    <el-button
      type="text"
      @click="zone"
    >{{name}}</el-button>
  </el-row>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    },
    name: {
      type: String,
      default: "未知用户"
    },
    userKey: {
      type: String,
      default: ""
    }
  },
  methods: {
    zone () {
      this.$router.push({ name: "zone", query: { key: this.userKey } })
    }
  },
}
</script>

<style lang='scss' scoped>
.container {
  display: flex;
  align-items: center;
  .el-avatar {
    margin-right: 5px;
  }
}
</style>
