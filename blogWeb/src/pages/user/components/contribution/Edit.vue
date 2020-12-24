<template>
  <div>
    <el-form
      :rules="rules"
      :model="article"
      ref="edit"
    >

      <!-- 标题 -->
      <el-form-item prop="title">
        <el-input
          v-model="article.title"
          placeholder="标题"
          maxlength="40"
          clearable
          required
        >
          <div slot="append">{{titleLength}}/40</div>
        </el-input>
      </el-form-item>

      <!-- 编辑器 -->
      <el-form-item prop="content">
        <div id="editor"></div>
      </el-form-item>

      <!-- 投稿类型 -->
      <el-form-item
        label="投稿区："
        prop="type"
      >
        <el-checkbox-group v-model="article.type">
          <el-checkbox label="front">前端</el-checkbox>
          <el-checkbox label="back">后端</el-checkbox>
          <el-checkbox label="js">js</el-checkbox>
          <el-checkbox label="css">css</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="封面（可选）">

        <el-upload
          :action="uploadArticleCoverUrl"
          :headers="headers"
          :auto-upload="false"
          name="cover"
          list-type="picture"
          :show-file-list="false"
          :on-change="changImg"
          :on-success="uploadSuccess"
          ref="uploadCover"
        >
          <img
            v-if="article.cover"
            :src="article.cover"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>

        <el-button
          @click="uploadCover"
          :disabled="!coverFile"
          size="mini"
        >上传封面</el-button>

      </el-form-item>

    </el-form>

    <div>

      <el-button
        type="primary"
        @click="uploadArticle"
      >提交审核</el-button>
      <el-button
        type="info"
        @click="uploadDraft"
      >存为草稿</el-button>
    </div>

  </div>
</template>

<script>
import Editor from "wangeditor"
import hljs from "highlight.js"
import "highlight.js/styles/agate.css"
import service from "../../../../service/user.js"

export default {
  data () {
    let contentIsEmpty = (rule, value, cb) => {
      if (this.editor.txt.html()) {
        cb()
      } else {
        cb(new Error("内容不能为空"))
      }
    }
    return {
      editor: "",
      headers: { "Authorization": sessionStorage.getItem("authorization") },
      uploadArticleCoverUrl: service.getUploadArticleCoverUrl(),
      coverFile: "",
      article: {
        article_id: "",
        title: "",
        content: "",
        type: [],
        cover: "",
      },
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        content: [{ validator: contentIsEmpty }],
        type: [{ required: true, message: "请选择投稿区", trigger: "blur" }],
      }
    }
  },
  methods: {
    uploadArticle () {
      this.$refs.edit.validate((valid) => {
        if (valid) {
          this.article.content = this.editor.txt.html()
          service.uploadArticle({ article: this.article }).then(res => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ type: "success", message: data.message })
              this.initArticle()
            }
          })
        }
      })
    },
    uploadDraft () {
      this.$refs.edit.validate((valid) => {
        if (valid) {
          this.article.content = this.editor.txt.html()
          service.uploadDraft({ article: this.article }).then(res => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ type: "success", message: data.message })
              this.initArticle()
            }
          })
        }
      })
    },
    getDraftDetail (article_id) {
      let params = { article_id }
      service.getDraftDetail(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.article = data.data.draft
          this.editor.txt.html(this.article.content)
        }
      })
    },
    uploadCover () {
      this.$refs.uploadCover.submit()
    },
    uploadSuccess (res) {
      this.article.cover = res.data.img
      console.log(res.data.img)
      this.$message({ type: "success", message: res.message })
    },
    changImg (file, fileList) {
      if (file.status === "ready") {
        this.coverFile = file.raw
        this.article.cover = file.url
      } else {
        this.coverFile = null
      }
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    initArticle () {
      this.article = {
        article_id: "",
        title: "",
        content: "",
        type: [],
        cover: ""
      }
      this.editor.txt.clear()
    }
  },
  watch: {
    $route () {
      this.$route.query.article_id && this.getDraftDetail(this.$route.query.article_id)
    }
  },
  mounted () {
    this.editor = new Editor("#editor")
    this.editor.highlight = hljs
    this.editor.create()
  },
  computed: {
    titleLength () {
      return this.article.title.length
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-input-group__append {
    background-color: #fff;
  }
  & > * {
    margin-bottom: 20px;
  }
}
.el-upload {
  i {
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    line-height: 100px;
    width: 200px;
    height: 100px;
  }
  img {
    width: 200px;
    height: 100px;
  }
}
</style>