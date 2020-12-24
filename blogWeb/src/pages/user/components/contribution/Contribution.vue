<template>
  <el-tabs
    v-model="checkedTab"
    @tab-click="changeTab"
  >
    <el-tab-pane
      label="编辑"
      name="edit"
      lazy
    >
      <Edit></Edit>
    </el-tab-pane>

    <el-tab-pane
      label="草稿"
      name="draft"
      lazy
    >
      <DraftList></DraftList>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

import DraftList from "./DraftList.vue"
import Edit from "./Edit.vue"

export default {
  data () {
    return {
      checkedTab: "",
    }
  },
  methods: {
    changeTab (vm) {
      this.$router.push({ path: "/contribution", query: { tab: vm.name } })
    }
  },
  components: {
    DraftList,
    Edit
  },
  watch: {
    $route () {
      this.checkedTab = this.$route.query.tab || "edit"
    }
  },
  mounted () {
    this.checkedTab = this.$route.query.tab || "edit"
  }
};
</script>

<style lang="scss">
</style>