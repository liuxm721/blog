<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button
        size="mini"
        @click="refresh"
      >刷新</el-button>
    </div>
    <el-table :data="articleList">
      <el-table-column
        width="55"
        type="selection"
      ></el-table-column>
      <el-table-column
        label="标题"
        prop="title"
      ></el-table-column>
      <el-table-column
        label="时间"
        prop="time"
      ></el-table-column>
      <el-table-column
        label="操作"
        v-slot="scope"
      >
        <el-button
          size="mini"
          type='primary'
          @click="getArticleDetail(scope.$index, scope.row)"
        >查看</el-button>
        <el-button
          size="mini"
          type="danger"
          @click.stop="fail(scope.$index, scope.row)"
        >不通过</el-button>
        <TipButton
          size='mini'
          type='danger'
          placement='top'
          label='删除'
          @confirm='deleteArticle(scope.$index, scope.row)'
        ></TipButton>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change='getArticle'
    ></el-pagination>
    <el-dialog
      title="文章详细"
      :visible.sync="dialogVisible"
    >
      <ArticlePreview :article="articleDetail"></ArticlePreview>
    </el-dialog>
  </div>
</template>

<script>
import service from '../../../service/admin.js'
import ArticlePreview from '../../../components/ArticlePreview'
import TipButton from '../../../components/TipButton'

export default {
  data () {
    return {
      articleList: [],
      articleDetail: {},
      dialogVisible: false,
      total: 0,
      pageSize: 15,
      page: 0
    }
  },
  methods: {
    refresh () {
      this.getArticle(this.page)
    },
    fail (index, article) {
      let form = { article_id: article.article_id }
      service.articleFail(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: 'success', message: '未通过审核' })
          this.articleList.splice(index, 1)
        }
      })
    },
    deleteArticle (index, article) {
      let form = { article_id: article.article_id }
      service.deleteArticle(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: 'success', message: '删除文章成功' })
          this.articleList.splice(index, 1)
        }
      })
    },
    getArticle (page) {
      this.page = page
      let params = { page, pageSize: this.pageSize, approved: 'pass' }
      service.getArticle(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.articleList = data.data.articleList
          this.total = data.data.total
        }
      })
    },
    getArticleDetail (index, article) {
      let params = { article_id: article.article_id }
      service.getArticleDetail(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.articleDetail = data.data.articleDetail
          this.dialogVisible = true
        }
      })
    }
  },
  components: {
    ArticlePreview,
    TipButton
  },
  mounted () {
    this.getArticle(1)
  },
}
</script>

<style lang='scss' scoped>
</style>
