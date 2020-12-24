<template>
  <div v-if="replyList.length">
    <el-row
      :gutter="20"
      v-for="(item, index) in replyList"
      :key="index"
    >
      <el-col :span="2">
        <el-avatar :src="item.from.avatar"></el-avatar>
      </el-col>
      <el-col :span="22">
        <el-row>
          <el-button
            type="text"
            @click="zone(item.from.key)"
          >{{item.from.name}}</el-button>
          <span
            v-if="item.to.key !== item.from.key"
            style="font-size: 12px;margin: 0 5px;"
          >回复 <el-button
              type="text"
              @click="item.to.key"
            >{{item.to.name}}</el-button></span>

          <span>：{{item.content}}</span>
        </el-row>
        <el-row>
          <span class="time">{{item.time | transtime}}</span>
          <el-button
            type="text"
            @click="openReply(item)"
            size="mini"
          >回复</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-pagination
      layout="total, prev, pager, next"
      :total="replyTotal"
      :page-size="replyPageSize"
      @current-change="getCommentReply"
    ></el-pagination>
  </div>
</template>

<script>
import service from "../../../../service/user.js"

export default {
  props: ["comment_id"],
  data () {
    return {
      replyTotal: 0,
      replyPageSize: 5,
      replyList: []
    }
  },
  methods: {
    getCommentReply (page) {
      let params = {
        article_id: this.$route.query.article_id,
        comment_id: this.comment_id,
        pageSize: this.replyPageSize,
        page
      }
      service.getCommentReply(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.replyList = data.data.replys
          this.replyTotal = data.data.total
        }
      })
    },
    openReply (comment) {
      this.$emit("openReply", comment, this.replyList)
    },
    zone (key) {
      this.$emit("zone", key)
    }
  },
  mounted () {
    this.getCommentReply(1)
  },
  components: {

  },
  filters: {
    transtime (value) {
      let res = ""
      let time = new Date(value).getTime()
      let current = new Date().getTime()
      let parallax = (current - time) / 1000
      if (parallax > 24 * 60 * 60) {
        res = new Date(value).toLocaleDateString()
      } else if (parallax > 60 * 60) {
        res = Math.floor(parallax / (60 * 60)) + "小时前"
      } else {
        res = Math.floor(parallax / 60) + "分钟前"
      }
      return res
    },
  }
}
</script>

<style lang='scss' scoped>
</style>
