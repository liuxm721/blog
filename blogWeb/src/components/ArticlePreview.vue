<template>
  <div>
    <h3>{{article.title}}</h3>
    <el-container id="info">
      <AvatarName
        :avatar="article.avatar"
        :name="article.author"
      ></AvatarName>
      <el-button
        v-for="(item, index) in article.type"
        :key="index"
        type="text"
      >{{types[item]}}</el-button>
      <span>{{article.time | transtime}}</span>
      <span>{{article.views}}阅读</span>
      <el-button
        size="mini"
        type="danger"
        class="follow"
      ><i class="el-icon-plus"></i> 关注
      </el-button>
    </el-container>
    <div
      id="content"
      v-html="article.content"
    ></div>
    <el-button
      type="text"
      title="点赞"
    ><i class="iconfont icon-zan"></i>{{article.likes}}</el-button>
    <el-button
      type="text"
      title="收藏"
    ><i class="iconfont icon-shoucang">{{article.collections}}</i></el-button>

    <el-button
      type="text"
      title="分享"
    ><i class="iconfont icon-fenxiang"></i>{{article.shares}}</el-button>
  </div>
</template>

<script>
import AvatarName from './AvatarName'
import Tool from './Tool'

export default {
  mixins: [Tool],
  props: ['article'],
  data () {
    return {
      types: {
        front: '前端',
        back: '后端'
      }
    }
  },
  methods: {

  },
  components: {
    AvatarName
  }
}
</script>

<style lang='scss' scoped>
@import "../assets/font/iconfont.css";
#info {
  display: flex;
  align-items: center;
  margin: 20px 0;
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
