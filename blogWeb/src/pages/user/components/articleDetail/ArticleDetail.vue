<template>
  <div>
    <el-page-header
      @back="exit"
      content="文章详情"
    >
    </el-page-header>
    <div v-if="article">

      <h3>{{article.title}}</h3>
      <el-container id="info">
        <AvatarName
          :avatar="article.avatar"
          :name="article.author"
          :userKey="article.key"
        ></AvatarName>
        <el-button
          v-for="(item, index) in article.type"
          :key="index"
          type="text"
          @click="goSquare(item)"
        >{{type(item)}}</el-button>
        <span>{{article.time | transtime}}</span>
        <span>{{article.views}}阅读</span>
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
      </el-container>
      <div
        id="content"
        v-html="article.content"
      ></div>
      <el-button
        type="text"
        title="点赞"
        @click="unLike"
        v-if="interaction.isLike"
      ><i class="iconfont icon-zan"></i>{{article.likes}}</el-button>
      <el-button
        v-else
        type="text"
        title="点赞"
        @click="like"
      ><i class="iconfont icon-zan1"></i>{{article.likes}}</el-button>
      <el-button
        type="text"
        title="收藏"
        @click="unCollection"
        v-if="interaction.isCollection"
      ><i class="iconfont icon-shoucang">{{article.collections}}</i></el-button>
      <el-button
        v-else
        type="text"
        title="收藏"
        @click="collection"
      ><i class="iconfont icon-shoucang1"></i>{{article.collections}}</el-button>
      <el-button
        type="text"
        title="分享"
      ><i class="iconfont icon-fenxiang"></i>{{article.shares}}</el-button>
      <el-divider></el-divider>
      <Comment></Comment>
    </div>
    <Empty
      v-else
      text="文章不存在或已被删除"
    ></Empty>
  </div>
</template>

<script>
import service from "../../../../service/user.js"
import Comment from "./Comment.vue"
import Empty from "@/components/Empty.vue"
import AvatarName from "@/components/AvatarName.vue"
import Tool from "@/components/Tool.vue"

export default {
  mixins: [Tool],
  data () {
    return {
      article: null,
      comment: "",
      types: {
        front: "前端",
        back: "后端",
        js: "JavaScript"
      },
      interaction: {
        isLike: false,
        isCollection: false,
        isFollow: false
      },
    }
  },
  methods: {
    exit () {
      this.$router.go(-1)
    },
    like () {
      if (this.isLogin()) {
        let form = { article_id: this.article.article_id }
        service.like(form).then(res => {
          let data = res.data
          console.log(data)
          if (data.status) {
            this.interaction.isLike = true
            this.article.likes += 1
          }
        })
      }
    },
    unLike () {
      let form = { article_id: this.article.article_id }
      service.unLike(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction.isLike = false
          this.article.likes -= 1
        }
      })
    },
    collection () {
      if (isLogin()) {
        let form = { article_id: this.article.article_id }
        service.collection(form).then(res => {
          let data = res.data
          console.log(data)
          if (data.status) {
            this.interaction.isCollection = true
            this.article.collections += 1
          }
        })
      }
    },
    unCollection () {
      let form = { article_id: this.article.article_id }
      service.unCollection(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction.isCollection = false
          this.article.collections -= 1
        }
      })
    },
    follow () {
      if (this.isLogin()) {
        let form = { key: this.article.key }
        service.follow(form).then(res => {
          let data = res.data
          console.log(data)
          if (data.status) {
            this.interaction.isFollow = true
          }
        })
      }
    },
    unFollow () {
      let form = { key: this.article.key }
      service.unFollow(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction.isFollow = false
        }
      })
    },
    zone () {
      this.$router.push({ path: "/zone", query: { key: this.article.key } })
    },
    getArticleDetail () {
      let params = { article_id: this.$route.query.article_id }
      service.getArticleDetail(params).then((res) => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.article = data.data.article
        }
      })
    },
    getUserInteractionWithArticle () {
      let params = { article_id: this.$route.query.article_id }
      service.getUserInteractionWithArticle(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.interaction = data.data
        }
      })
    },
    type (type) {
      return this.types[type]
    },
    goSquare (type) {
      this.$router.push({ name: "square", query: { tab: type } })
    }
  },
  watch: {
    $route () {
      this.$route.query.article_id && this.getArticleDetail()
    }
  },
  mounted () {
    this.getArticleDetail()
    this.getUserInteractionWithArticle()
  },
  components: {
    Comment,
    Empty,
    AvatarName
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/font/iconfont.css";

#content {
  padding: 20px;
}
#info {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: #757575;
  & > * {
    margin-right: 20px;
  }
  .follow {
    width: 80px;
    margin-left: 0;
  }
}
</style>