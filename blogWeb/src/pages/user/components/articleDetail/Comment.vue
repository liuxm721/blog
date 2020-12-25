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
      id="reply-form1"
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
      :key="item.comment_id"
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
            @click="openReply(item, index)"
          >回复</el-button>
          <Reply
            :comment_id="item.comment_id"
            :article_id="item.article_id"
            :index="index"
            :reply="item.reply"
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
import { v4 } from "uuid"

export default {
  mixins: [Tool],
  data () {
    return {
      article_id: this.$route.query.article_id || "",
      comments: "",
      rules: { required: true, message: "内容不能为空", trigger: "blur" },
      commentTotal: 0,
      commentPageSize: 10,
      index: "",
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
        comment_id: "",
        content: "",
      },
    }
  },
  methods: {
    uploadComment () {
      this.$refs.commentForm.validate((valid) => {
        if (this.isLogin() && valid) {
          this.commentForm.comment_id = v4()
          service.uploadComment({ comment: this.commentForm }).then((res) => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.comments.unshift({
                article_id: this.commentForm.article_id,
                comment_id: this.commentForm.comment_id,
                content: this.commentForm.content,
                time: new Date(),
                from: {
                  avatar: sessionStorage.getItem("avatar"),
                  key: sessionStorage.getItem("key"),
                  name: sessionStorage.getItem("name")
                }
              })
              this.commentForm.content = ""
              this.$message({ type: "success", message: "评论成功" })
            }
            console.log(this.comments)
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
                this.replyForm.content = ""
                this.$message({ type: "success", message: "回复成功" })
                form.to = this.comments[this.index].from
                form.from = {
                  name: sessionStorage.getItem("name"),
                  key: sessionStorage.getItem("key"),
                  avatar: sessionStorage.getItem("avatar")
                }
                form.time = new Date()
                this.$set(this.comments[this.index], "reply", form)
                this.replyForm.visible = false
              }
            })
          }
        })
      }
    },
    openReply (comment, index) {
      if (this.isLogin()) {
        this.index = index
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
    this.replyForm.el = document.querySelector(`#reply-form1`)
    this.getArticleComment()
  }
};
</script>

<style lang="scss" scoped>
::v-deep .time {
  font-size: 12px;
  margin-right: 20px;
  color: #99a2aa;
}
</style>