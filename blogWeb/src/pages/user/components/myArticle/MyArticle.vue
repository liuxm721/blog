<template>
  <el-tabs
    v-model="checkedTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      :label="item.label"
      :name="item.name"
    >
      <component
        :is="item.component"
        :articleList="articleList"
      ></component>
      <el-pagination
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @current-change="getUserArticleState"
      ></el-pagination>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AllArticle from "./AllArticle.vue"
import PassArticle from "./PassArticle.vue"
import ReviewArticle from "./ReviewArticle.vue"
import FailArticle from "./FailArticle.vue"
import service from "@/service/user.js"

export default {
  data () {
    return {
      checkedTab: "all",
      articleList: null,
      pagination: {
        total: 0,
        pageSize: 10
      },
      tabs: [
        { label: "全部", name: "all", component: "AllArticle" },
        { label: "通过", name: "pass", component: "PassArticle" },
        { label: "审核中", name: "review", component: "ReviewArticle" },
        { label: "未通过", name: "fail", component: "FailArticle" }
      ]
    }
  },
  methods: {
    clickTab (v) {
      this.$router.push({ name: "myarticle", query: { tab: v.name } })
    },
    getUserArticleState (page) {
      let params = {
        approved: this.checkedTab,
        page,
        pageSize: this.pagination.pageSize
      }
      service.getUserArticleState(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.articleList = data.data.articleList
          this.pagination.total = data.data.total
        }
      })
    }
  },
  components: {
    AllArticle,
    PassArticle,
    ReviewArticle,
    FailArticle
  },
  watch: {
    $route () {
      this.getUserArticleState(1)
    }
  },
  mounted () {
    this.checkedTab = this.$route.query.tab || "all"
    this.$router.push({ name: "myarticle", query: { tab: this.checkedTab } })
    this.articleList || this.getUserArticleState(1)
  }
}
</script>

<style lang='scss' scoped>
</style>
