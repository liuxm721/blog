<template>
  <el-tabs
    :router="true"
    v-model="checkedTab"
    @tab-click="changeTab"
  >
    <el-tab-pane
      label="全部"
      name="all"
    >
      <ArticleList :articleList="articleList"></ArticleList>
      <el-pagination
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @current-change="getUserArticleList"
      ></el-pagination>
    </el-tab-pane>
    <el-tab-pane
      v-for="(item, index) in followList"
      :key="index"
      :label="item.name"
      :name="item.key"
      lazy
    >
      <ArticleList :articleList="articleList"></ArticleList>
      <el-pagination
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @current-change="getUserArticleList"
      ></el-pagination>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import service from "../../../../service/user.js"
import ArticleList from "../../../../components/ArticleList.vue"

export default {
  data () {
    return {
      followList: [],
      checkedTab: "all",
      articleList: null,
      pagination: {
        total: 0,
        pageSize: 10
      }
    }
  },
  mounted: async function () {
    await this.getFollows()
    this.articleList || this.getUserArticleList(1)
  },
  methods: {
    changeTab (vm) {
      this.$router.push({ name: "follow", query: { key: vm.name } })
    },
    getUserArticleList (page) {
      let key = []
      if (this.checkedTab === "all") {
        for (let item of this.followList) {
          key.push(item.key)
        }
      } else {
        key = this.checkedTab
      }
      let params = { key, page, pageSize: this.pagination.pageSize }
      service.getUserArticleList(params).then(res => {
        let data = res.data
        console.log(data)
        this.articleList = data.data.articleList
        this.pagination.total = data.data.total
      })
    },
    getFollows: async function () {
      await service.getFollows().then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.followList = data.data.follows
        }
      })
    }
  },
  watch: {
    $route () {
      this.checkedTab = this.$route.query.key || "all"
      this.getUserArticleList(1)
    }
  },
  components: {
    ArticleList,
  }
};
</script>

<style lang="scss">
</style>