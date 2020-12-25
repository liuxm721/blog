<template>
  <div>
    <el-row>
      <el-col
        :span="12"
        style="display: flex; align-items:center;"
      >
        <el-avatar
          v-if="zone.avatar"
          style="margin-right: 10px"
          :src="zone.avatar"
          :size="50"
        ></el-avatar>
        <span>{{zone.name}}</span>
      </el-col>
      <el-col
        :span="12"
        style="text-align: right"
      >
        <el-button
          type="success"
          @click="unFollow"
          size="mini"
          class="follow"
          v-if="interaction.isFollow"
        >
          <i class="el-icon-check"></i>
          已关注
        </el-button>
        <el-button
          size="mini"
          type="danger"
          @click="follow"
          class="follow"
          v-else
        >
          <i class="el-icon-plus"></i>
          关注
        </el-button>
        <el-button
          @click="chat"
          icon="el-icon-chat-dot-round"
          size="mini"
        >私信</el-button>
      </el-col>

    </el-row>
    <el-row
      type="flex"
      justify="space-around"
      style="font-size: 12px;text-align: center;color: #c0c0c0"
    >
      <div>文章<div>{{zone.articleNum}}</div>
      </div>
      <div>点赞<div>{{zone.likeNum}}</div>
      </div>
      <div>粉丝<div>{{zone.fanNum}}</div>
      </div>
      <div>关注<div>{{zone.followNum}}</div>
      </div>
    </el-row>
    <el-divider></el-divider>
    <ArticleList :articleList="articleList"></ArticleList>
    <el-pagination
      layout="total, prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      @current-change="getUserArticleList"
    ></el-pagination>
  </div>
</template>

<script>
import service from "../../../../service/user.js"
import ArticleList from "@/components/ArticleList.vue"
import Tool from "@/components/Tool.vue"

export default {
  mixins: [Tool],
  data () {
    return {
      key: this.$route.query.key || "",
      zone: {},
      articleList: [],
      interaction: {
        isFollow: false
      },
      pagination: {
        total: 0,
        pageSize: 10
      }
    }
  },
  methods: {
    chat () {
      if (this.isLogin()) {
        this.$router.push({ path: "/interaction", query: { tab: 3, key: this.key } })
      }
    },
    getUserArticleList (page) {
      let params = { key: this.key, page, pageSize: this.pagination.pageSize }
      service.getUserArticleList(params).then(res => {
        let data = res.data
        console.log(data)
        this.articleList = data.data.articleList
        this.pagination.total = data.data.total
      })
    },
    getzone () {
      let params = { key: this.key }
      service.getzone(params).then(res => {
        let data = res.data
        console.log(data)
        this.zone = data.data
      })
    },
    getUserInteractionWithArticle () {
      let params = { key: this.key }
      service.getUserInteractionWithArticle(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction.isFollow = data.data.isFollow
        }
      })
    },
    follow () {
      if (this.isLogin()) {
        let params = { key: this.key }
        service.follow(params).then(res => {
          let data = res.data
          console.log(data)
          if (data.status) {
            this.interaction.isFollow = true
          }
        })
      }
    },
    unFollow () {
      let params = { key: this.key }
      service.unFollow(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction.isFollow = false
        }
      })
    },
  },
  components: {
    ArticleList
  },
  mounted () {
    this.getzone()
    this.getUserArticleList(1)
    this.getUserInteractionWithArticle()
  },
  watch: {
    // $route () {
    //   this.getzone()
    //   this.getUserArticleList(1)
    // }
  }
}
</script>

<style lang='scss' scoped>
.follow {
  width: 80px;
  margin-left: 0;
}
</style>
