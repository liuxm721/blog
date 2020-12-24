const mongoose = require("mongoose")

let draft = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  // 文章 id
  article_id: {
    type: String,
    required: true
  },
  // 标题
  title: {
    type: String,
    required: true
  },
  // 内容
  content: {
    type: String,
    required: true
  },
  // 封面
  cover: {
    type: String,
    default: "https://static.fotor.com.cn/assets/projects/pages/9352d7b0-2576-11ea-ba69-858f620c983b_bd890292-45e5-4eb0-9cdf-d19cabb10e74_thumb.jpg"
  },
  // 投稿区
  type: {
    type: Array,
    required: true
  },
  // 时间
  time: {
    type: Date,
    required: true
  }
})

let draftTables = mongoose.model("draftTables", draft)

module.exports = draftTables