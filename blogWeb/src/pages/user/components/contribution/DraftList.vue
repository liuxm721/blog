<template>
  <el-row>
    <el-row v-if="draftList.length">
      <el-row
        class="draft-list"
        v-for="(item, index) in draftList"
        :key="index"
        :gutter="20"
      >
        <el-col :span="8">
          <el-image :src="item.cover"></el-image>
        </el-col>
        <el-col :span="16">
          <div class="title">{{item.title}}</div>
          <!-- <div>内容</div> -->
          <div class="time">最后修改时间：{{item.time | transtime}}</div>
          <el-button
            size="mini"
            type="primary"
            @click="edit(item.article_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="success"
            @click="draftToArticle(item.article_id, index)"
          >提交</el-button>
          <el-button
            @click="preview(item.article_id)"
            size="mini"
          >预览</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteDraft(item.article_id, index)"
          >删除</el-button>
        </el-col>
      </el-row>
    </el-row>
    <Empty v-else></Empty>

    <el-dialog :visible.sync="dialogVisible">
      <h3>{{preDraft.title}}</h3>
      <div v-html="preDraft.content"></div>
    </el-dialog>
  </el-row>
</template>

<script>
import service from "../../../../service/user.js"
import Empty from "@/components/Empty.vue"
export default {
  data () {
    return {
      draftList: "",
      preDraft: {},
      dialogVisible: false,
    }
  },
  methods: {
    preview (article_id) {
      let params = { article_id }
      service.getDraftDetail(params).then(res => {
        let data = res.data
        console.log(data)
        this.dialogVisible = true
        this.preDraft = data.data.draft
      })
    },
    getDraft () {
      service.getDraft().then((res) => {
        let data = res.data
        console.log(data)
        this.draftList = data.data.draftList
      })
    },
    deleteDraft (article_id, index) {
      let form = { article_id }
      service.deleteDraft(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: "success", message: data.message })
          this.draftList.splice(index, 1)
        }
      })
    },
    draftToArticle (article_id, index) {
      let form = { article_id }
      service.draftToArticle(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: "success", message: data.message })
          this.draftList.splice(index, 1)
        }
      })
    },
    edit (article_id) {
      this.$router.push({ path: "contribution", query: { tab: "edit", article_id } })
    }
  },
  components: {
    Empty
  },
  watch: {
    $route () {
      let tab = this.$route.query.tab
      switch (tab) {
        case "draft":
          this.getDraft()
          break
      }
    }
  },
  mounted () {
    this.getDraft()
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
.draft-list {
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
    line-height: 4rem;
  }
  .time {
    font-size: 12px;
    color: #c0c0c0;
    margin-bottom: 10px;
  }
}
</style>