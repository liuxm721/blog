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
import Tool from "@/components/Tool.vue"

export default {
  mixins: [Tool],
  props: ["comment_id", "article_id", "index", "reply"],
  data () {
    return {
      replyTotal: 0,
      replyPageSize: 5,
      replyList: [],
    }
  },
  methods: {
    getCommentReply (page) {
      let params = {
        article_id: this.article_id,
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
    zone (key) {
      this.$router.push({ name: "zone", query: { key } })
    },
    openReply (comment) {
      this.$emit("openReply", comment, this.index)
    }
  },
  watch: {
    reply (newV) {
      if (newV) {
        this.replyList.unshift(newV)
      }
    }
  },
  mounted () {
    this.getCommentReply(1)
  }
}
</script>

<style lang='scss' scoped>
</style>
