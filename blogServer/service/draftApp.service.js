const express = require("express")
const draftTables = require("../db/dreftTables")
const { v4 } = require("uuid")
const articleTables = require("../db/articleTables")
const { userInfoTables } = require("../db/userTables")

let draftValidApp = express()

// 上传草稿
draftValidApp.post("/uploadDraft", async (req, res) => {
  let { user, article } = req.body
  let resData = { status: 0, message: "保存草稿失败" }
  article.time = new Date()

  if (article.article_id) {
    let select = { key: user.key, article_id: article.article_id }
    let update = { title: article.title, content: article.content, type: article.type, time: article.time }
    if (article.cover) {
      update.cover = article.cover
    }
    await draftTables.updateOne(select, update).then(msg => {
      resData.status = 1
      resData.message = "修改草稿成功"
    })
  } else {
    article.article_id = v4()
    article.key = user.key
    if (!article.cover) {
      delete article.cover
    }
    draftTables.create(article)
    resData.status = 1
    resData.message = "已保存"
  }
  res.send(resData)
})


// 获取草稿
draftValidApp.get("/getDraft", async (req, res) => {
  let { key } = req.body.user
  let resData = { status: 0, message: "查询草稿", data: {} }
  let select = { key }
  let showdata = { _id: false, content: false, __v: false }
  await draftTables.find(select, showdata).then(data => {
    resData.status = 1
    resData.message = "查询草稿成功"
    resData.data.draftList = data
  })
  res.send(resData)
})

// 获取草稿详情
draftValidApp.get("/getDraftDetail", async (req, res) => {
  let { article_id } = req.query
  let { key } = req.body.user
  let resData = { status: 0, message: "查询草稿详情", data: {} }
  let select = { key, article_id }
  let showData = { _id: false, __v: false }
  await draftTables.findOne(select, showData).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "查询草稿详情成功"
      resData.data.draft = JSON.parse(JSON.stringify(data))
    }
  })
  await userInfoTables.findOne({ key }).then(data => {
    if (data) {
      resData.data.draft.author = data.name
      resData.data.draft.avatar = data.avatar
    }
  })
  res.send(resData)
})

// 删除草稿
draftValidApp.post("/deleteDraft", async (req, res) => {
  let { article_id } = req.body
  let resData = { status: 0, message: "删除草稿" }
  await draftTables.deleteOne({ article_id }).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
      resData.message = "删除草稿成功"
    }
  })
  res.send(resData)
})

// 草稿转正式文章
draftValidApp.post("/drafttoarticle", async (req, res) => {
  let { article_id } = req.body
  let { key } = req.body.user
  let resData = { status: 0, message: "草稿转正式文章" }
  let select = { key, article_id }
  let showData = { _id: false, __v: false }
  await draftTables.findOne(select, showData).then(data => {
    if (data) {
      let article = JSON.parse(JSON.stringify(data))
      article.time = new Date()
      articleTables.create(article)
      draftTables.deleteOne(select).then(mes => { })
      resData.status = 1
      resData.message = "草稿转正式文章成功"
    }
  })
  res.send(resData)
})

module.exports = { draftValidApp } 