<template>
  <el-tabs
    v-model="checkedTab"
    @tab-click="changeTab"
  >
    <el-tab-pane
      label="回复我的"
      name="1"
    >待开发</el-tab-pane>
    <el-tab-pane
      label="收到的赞"
      name="2"
    >待开发</el-tab-pane>
    <el-tab-pane
      label="私信"
      name="3"
      lazy
    >
      <ChatList></ChatList>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ChatList from "./ChatList.vue"
export default {
  data () {
    return {
      checkedTab: "1",
    }
  },
  watch: {
    $route () {
      this.checkedTab = this.$route.query.tab || "1"
    }
  },
  methods: {
    changeTab (vm) {
      this.$router.push("/interaction?tab=" + vm.name)
    }
  },
  components: {
    ChatList,
  },
  mounted () {
    this.checkedTab = this.$route.query.tab || "1"
    this.chat = this.$route.query.key || ""
  }
}
</script>

<style lang='scss' scoped>
</style>
