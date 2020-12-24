<template>
  <el-tabs
    @tab-click="tabChange"
    v-model="checkedTab"
  >
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      :label=item.label
      :name=item.name
      lazy
    >
      <ArticleList :articleList="articleList"></ArticleList>
      <el-pagination
        layout="total, prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @current-change="getArticleList"
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
      checkedTab: "",
      pageSize: 10,
      total: 0,
      articleList: [],
      pagination: {
        total: 0,
        pageSize: 10,
      },
      tabs: [
        { label: "最新", name: "newest" },
        { label: "精华", name: "essence" },
        { label: "前端", name: "front" },
        { label: "后端", name: "back" },
        { label: "js", name: "js" },
      ],
    }
  },
  components: {
    ArticleList
  },
  mounted () {
    this.checkedTab = this.$route.query.tab || "newest"
    this.getArticleList(1)
  },
  methods: {
    tabChange (vm) {
      this.$router.push({ path: "/square", query: { tab: vm.name } })
      this.checkedTab = vm.name
    },
    getArticleList (page) {
      let params = {
        type: this.checkedTab,
        page,
        pageSize: this.pagination.pageSize,
      }
      service.getArticleList(params).then((res) => {
        let data = res.data
        console.log(data)
        this.articleList = data.data.articleList
        this.pagination.total = data.data.total
      })
    },
  },
  watch: {
    $route () {
      this.checkedTab = this.$route.query.tab || "newest"
      this.getArticleList(1)
    }
  }
};
</script>
<style lang="scss">
</style>