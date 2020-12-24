<template>
  <el-card>
    <div slot="header">推荐文章</div>
    <div
      v-for="(item,index) in articleList"
      :key="index"
      @click="articleDetail(item.article_id)"
      class="article-list"
    >{{item.title}}</div>
  </el-card>
</template>

<script>
import service from "../../../../service/user.js"

export default {
  data () {
    return {
      articleList: []
    }
  },
  methods: {
    articleDetail (article_id) {
      this.$router.push({ name: "articledetail", query: { article_id } })
    },
    getRecommendedArticles () {
      service.getRecommendedArticles().then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.articleList = data.data.articleList
        }
      })
    }
  },
  components: {

  },
  mounted () {
    this.getRecommendedArticles()
  }
}
</script>

<style lang='scss' scoped>
.article-list {
  margin: 5px 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: #409eff;
  }
}
</style>
