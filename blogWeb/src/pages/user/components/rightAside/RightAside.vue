<template>
  <div>
    <UserInfo></UserInfo>
    <RecommendArticle></RecommendArticle>
  </div>
</template>

<script>
import UserInfo from './UserInfo.vue'
import RecommendArticle from "./RecommendArticle.vue"
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  components: {
    UserInfo,
    RecommendArticle
  }
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;
}
</style>
