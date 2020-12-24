const mongoose = require("mongoose")
const { stringify } = require("uuid")

let article = new mongoose.Schema({
  // 用户 key
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
  // 创建时间
  time: {
    type: Date,
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
  // 分享
  shares: {
    type: Number,
    default: 0
  },
  // 点赞
  likes: {
    type: Number,
    default: 0
  },
  // 收藏
  collections: {
    type: Number,
    default: 0
  },
  // 评论
  comments: {
    type: Array,
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  // 审核
  approved: {
    type: String,
    default: "review"
  }
})

let articleTables = mongoose.model("articleTables", article)

module.exports = articleTables