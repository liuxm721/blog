<template>
  <div>
    <div v-if="articleList && articleList.length">
      <el-row>
        <el-row
          v-for="(item, index) in articleList"
          :key="index"
          class="article-list"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-image :src="item.cover"></el-image>
            </el-col>
            <el-col :span="16">
              <div>
                <el-button
                  class="title"
                  type="text"
                  @click="articleDetail(item.article_id)"
                >{{item.title}}</el-button>
              </div>
              <el-button
                class="author"
                type="text"
                @click="zone(item.key)"
              >作者：{{item.author}}</el-button>
              <div class="info">
                <span>发表于：{{item.time | transtime}}</span>
                <span title="浏览"><i class="iconfont icon-yueduxiao"></i> {{item.views}}</span>
                <span title="点赞"><i class="iconfont icon-zan"></i> {{item.likes}}</span>
              </div>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
    </div>
    <Empty v-else></Empty>
  </div>
</template>

<script>
import Empty from "./Empty"
import service from "@/service/user.js"
import Tool from "@/components/Tool.vue"

export default {
  name: "allarticle",
  mixins: [Tool],
  props: {
    articleList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    zone (key) {
      this.$router.push({ path: "/zone", query: { key } })
    }
  },
  components: {
    Empty
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/font/iconfont.css";
.article-list {
  margin: 10px !important;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .el-image {
    height: 120px;
    border-radius: 5px;
  }
  .title {
    overflow: hidden;
    width: 80%;
    text-align: left;
    text-overflow: ellipsis;
    font-size: 1.5rem;
  }
  .author {
    color: #c0c0c0;
    margin-bottom: 10px;
    &:hover {
      color: #409eff;
    }
  }
  .info {
    font-size: 12px;
    color: #c0c0c0;
    span {
      margin-right: 20px;
    }
  }
}
</style>