<template>
  <el-row>
    <el-page-header
      @back="back"
      content="搜索详情"
    ></el-page-header>
    <el-divider></el-divider>
    <ArticleList :articleList="articleList"></ArticleList>
    <el-pagination
      layout="total, prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      @current-change="search"
    ></el-pagination>
  </el-row>
</template>

<script>
import service from "../../../../service/user.js"
import ArticleList from "../../../../components/ArticleList.vue"
export default {
  data () {
    return {
      articleList: [],
      pagination: {
        total: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    search (page) {
      let parmas = {
        title: this.$route.query.title,
      }
      service.search(parmas).then((res) => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.articleList = data.data.article
          this.pagination.total = data.data.total
        }
      })
    }
  },
  mounted () {
    this.search(1)
  },

  components: {
    ArticleList
  },
  watch: {
    $route (to) {
      to.query.title && this.search(1)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

