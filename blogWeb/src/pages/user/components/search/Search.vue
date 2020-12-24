<template>
  <el-row>
    <el-page-header
      @back="back"
      content="搜索详情"
    ></el-page-header>
    <el-divider></el-divider>
    <article-list :articleList="articleList"></article-list>
  </el-row>
</template>

<script>
import service from "../../../../service/api.js";
import ArticleList from "../../../../components/ArticleList.vue"
export default {
  data() {
    return {
      articleList: [],
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getTitle() {
      return window.location.href
        .split("/")
        .pop()
        .replace("search?", "")
        .split("&")
        .filter((item) => {
          if (item.split("=")[0] == "title") return true;
        })[0]
        .split("=")[1];
    },
  },
  mounted() {
    let parmas = {
      title: this.getTitle(),
    };
    service.search(parmas).then((res) => {
      let data = res.data;
      console.log(data);
      this.articleList = data.data.article;
    });
  },
  components: {
    ArticleList
  }
};
</script>

<style lang="scss" scoped>
</style>

