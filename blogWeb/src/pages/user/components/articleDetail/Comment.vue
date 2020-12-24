<template>
  <el-row>
    <!-- 评论 -->
    <el-row :gutter="20">
      <el-col :span="2">
        <el-avatar :src="avatar"></el-avatar>
      </el-col>
      <el-col :span="18">
        <el-form
          ref="commentForm"
          :model="commentForm"
        >
          <el-form-item
            prop="content"
            :rules="rules"
          >
            <el-input
              type="textarea"
              :rows="4"
              resize="none"
              v-model="commentForm.content"
              placeholder="来一发友善的评论吧"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          style="width: 100%"
          @click="uploadComment()"
        >发表</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-divider></el-divider>
    </el-row>

    <!-- 回复窗口 -->
    <el-row
      :gutter="20"
      id="reply-form"
      v-show="replyForm.visible"
    >
      <el-col :span="2">
        <el-avatar :src="avatar"></el-avatar>
      </el-col>
      <el-col :span="18">
        <el-form
          ref="replyForm"
          :model="replyForm"
        >
          <el-form-item
            prop="content"
            :rules="rules"
          >
            <el-input
              type="textarea"
              :rows="4"
              resize="none"
              v-model="replyForm.content"
              :placeholder="replyForm.placeholder"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          style="width: 100%"
          @click="uploadReply"
        >发表</el-button>
      </el-col>
    </el-row>

    <!-- 评论展示区 -->
    <el-row
      :gutter="20"
      v-for="(item, index) in comments"
      :key="index"
    >
      <el-col :span="2">
        <el-avatar :src="item.from.avatar"></el-avatar>
      </el-col>
      <el-col :span="22">
        <el-button
          type="text"
          @click="zone(item.from.key)"
        >{{item.from.name}}</el-button>
        <el-row>{{item.content}}</el-row>
        <el-row>
          <span class="time">{{item.time | transtime}}</span>
          <el-button
            type="text"
            size="mini"
            @click="openReply(item)"
          >回复</el-button>
          <Reply
            :comment_id="item.comment_id"
            @openReply="openReply"
            @zone="zone"
          ></Reply>
        </el-row>
        <el-row>
          <el-divider></el-divider>
        </el-row>
      </el-col>
    </el-row>

    <el-pagination
      layout="total, prev, pager, next"
      :total="commentTotal"
      :page-size="commentPageSize"
      @current-change="getArticleComment"
    ></el-pagination>

  </el-row>
</template>

<script>
import service from "../../../../service/user.js"
import Reply from "./Reply.vue"
import Tool from "@/components/Tool.vue"

export default {
  mixins: [Tool],
  data () {
    return {
      article_id: this.$route.query.article_id || "",
      comments: "",
      rules: { required: true, message: "内容不能为空", trigger: "blur" },
      commentTotal: 0,
      commentPageSize: 10,
      replyForm: {
        el: "",
        visible: false,
        placeholder: "",
        content: "",
        to: "",
        article_id: "",
        comment_id: ""
      },
      commentForm: {
        article_id: this.$route.query.article_id,
        content: "",
      },
    }
  },
  methods: {
    uploadComment () {
      this.$refs.commentForm.validate((valid) => {
        if (this.isLogin() && valid) {
          service.uploadComment({ comment: this.commentForm }).then((res) => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.getArticleComment()
              this.comments.unshift({
                content: this.replyForm.content,
                from: {
                  avatar: sessionStorage.getItem("avatar"),
                  key: sessionStorage.getItem("key"),
                  name: sessionStorage.getItem("name")
                }
              })
            }
          })
        }
      })
    },

    uploadReply () {
      if (this.isLogin()) {
        this.$refs.replyForm.validate((valid) => {
          if (valid) {
            let form = {
              to: this.replyForm.to,
              content: this.replyForm.content,
              comment_id: this.replyForm.comment_id,
              article_id: this.replyForm.article_id
            }
            service.uploadReply({ reply: form }).then((res) => {
              let data = res.data
              console.log(data)
              if (data.status) {
              }
            })
          }
        })
      }
    },
    openReply (comment) {
      if (this.isLogin()) {
        this.replyForm.visible = true
        event.target.parentNode.parentNode.append(this.replyForm.el)
        this.replyForm.placeholder = "回复 " + comment.from.name
        this.replyForm.comment_id = comment.comment_id
        this.replyForm.article_id = comment.article_id
        this.replyForm.to = comment.from.key
      }
    },
    getArticleComment (page) {
      let params = { article_id: this.article_id, page }
      service.getArticleComment(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.comments = data.data.comments
          this.commentTotal = data.data.total
        }
      })
    },
    zone (key) {
      this.$router.push({ name: "zone", query: { key } })
    },
  },
  components: {
    Reply
  },
  computed: {
    avatar () {
      return sessionStorage.getItem("avatar") || "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  mounted () {
    this.replyForm.el = document.querySelector(`#reply-form`)
    this.getArticleComment()
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
  },
};
</script>

<style lang="scss" scoped>
::v-deep .time {
  font-size: 12px;
  margin-right: 20px;
  color: #99a2aa;
}
</style>