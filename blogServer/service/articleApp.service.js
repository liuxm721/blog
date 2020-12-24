const expree = require("express")
const articleTables = require("../db/articleTables.js")
const { v4 } = require("uuid")
const { userInfoTables, userInteractionTables } = require("../db/userTables.js")


let articleValidApp = expree()

// 上传文章
articleValidApp.post("/uploadArticle", (req, res) => {
  let { user, article = "" } = req.body
  let resData = { status: 0, message: "上传文章失败" }
  if (article) {
    if (!article.cover) {
      delete article.cover
    }
    article.article_id = v4()
    article.time = new Date()
    article.key = user.key
    articleTables.create(article)
    resData.status = 1
    resData.message = "上传文章成功"
  }
  res.send(resData)
})

// 获取用户文章审核状态
articleValidApp.get("/getUserArticleState", async (req, res) => {
  let { key } = req.body.user
  let { approved = "all", page = 1, pageSize = 10 } = req.query
  let resData = { status: 0, message: "获取", data: {} }
  let select = { key, approved: approved === "all" ? { $exists: true } : approved }
  await articleTables.find(select).then(data => {
    resData.status = 1
    resData.data.total = data.length
    resData.data.articleList = data.reverse().slice((page - 1) * pageSize, page * pageSize)
  })
  res.send(resData)
})

// 获取推荐文章
articleValidApp.get("/getRecommendedArticles", async (req, res) => {
  let { key } = req.body.user
  let resData = { status: 0, messag: "获取推荐文章", data: {} }
  let select = {}
  let showData = { _id: false, article_id: true, title: true }
  let filter = { sort: { time: -1 }, limit: 10 }
  await articleTables.find(select, showData, filter).then(data => {
    resData.status = 1
    resData.data.articleList = data
  })
  res.send(resData)
})

let articleApp = expree()
// 获取指定类型文章列表
articleApp.get("/getarticlelist", async (req, res) => {
  let { type, page = 1, pageSize = 10 } = req.query
  let resData = { status: 0, message: "获取最新文章失败", data: {} }

  let select = {}
  switch (type) {
    case "essence":
      select = { likes: { $gt: 100 } }
      break
    case "front":
      select = { type: { $in: "front" } }
      break
    case "back":
      select = { type: { $in: "back" } }
      break
    case "js":
      select = { type: { $in: "js" } }
      break
  }

  let dataShow = {
    _id: false,
    content: false
  }
  let filter = {
    skip: (page - 1) * pageSize,
    limit: pageSize * 1,
    sort: { time: -1 }
  }

  await articleTables.find(select).then(data => {
    resData.data.total = data.length
  })
  await articleTables.find(select, dataShow, filter).then(data => {
    resData.status = 1
    resData.message = "获取最新文章成功"
    resData.data.articleList = JSON.parse(JSON.stringify(data))
  })
  for (let item = 0, len = resData.data.articleList.length; item < len; item++) {
    await userInfoTables.findOne({ key: resData.data.articleList[item].key }).then(data => {
      if (data) {
        resData.data.articleList[item].author = data.name
        resData.data.articleList[item].avatar = data.avatar
      }
    })
  }
  res.send(resData)
})

// 获取详细文章
articleApp.get("/getArticleDetail", async (req, res) => {
  let { article_id } = req.query
  let resData = { status: 0, message: "获取文章详情失败", data: {} }
  let select = { article_id }
  await articleTables.findOne(select, { _id: false, __v: false, comments: false }).then(async data => {
    if (data) {
      resData.status = 1
      resData.message = "获取文章详情成功"
      resData.data.article = JSON.parse(JSON.stringify(data))
      let select = { article_id }
      let update = { $inc: { views: 1 } }
      await articleTables.updateOne(select, update).then(msg => { })
      select = { key: resData.data.article.key }
      await userInfoTables.findOne(select).then(data => {
        if (data) {
          resData.data.article.author = data.name
          resData.data.article.avatar = data.avatar
        }
      })
    }
  })
  res.send(resData)
})

// 获取文章评论
articleApp.get("/getArticleComment", async (req, res) => {
  let { article_id, page = 1 } = req.query
  let resData = { status: 0, message: "获取评论", data: {} }
  let select = { article_id }
  await articleTables.findOne(select).then(async data => {
    if (data) {
      resData.data.total = data.comments.length
      let comments = data.comments.reverse().slice((page - 1) * 10, page * 10)
      for (let i = 0, len = comments.length; i < len; i++) {
        await userInfoTables.findOne({ key: comments[i].from }).then(data => {
          if (data) {
            comments[i].from = { name: data.name, avatar: data.avatar, key: data.key }
          }
        })
      }
      resData.status = 1
      resData.data.comments = comments
    }
  })

  res.send(resData)
})

// 获取评论回复
articleApp.get("/getCommentReply", async (req, res) => {
  let { article_id, comment_id, page = 1, pageSize = 5 } = req.query
  let resData = { status: 0, message: "评论回复", data: {} }
  let select = { article_id }
  let showData = { comments: { $elemMatch: { comment_id } } }
  await articleTables.findOne(select, showData).then(async data => {
    if (data) {
      resData.data.total = data.comments[0].replys.length
      let replys = data.comments[0].replys.reverse().slice((page - 1) * pageSize, page * pageSize)
      for (let i = 0, len = replys.length; i < len; i++) {
        await userInfoTables.findOne({ key: replys[i].from }).then(data => {
          if (data) {
            replys[i].from = { name: data.name, avatar: data.avatar, key: data.key }
          }
        })
      }
      for (let i = 0, len = replys.length; i < len; i++) {
        await userInfoTables.findOne({ key: replys[i].to }).then(data => {
          if (data) {
            replys[i].to = { name: data.name, avatar: data.avatar, key: data.key }
          }
        })
      }
      resData.status = 1
      resData.data.replys = replys
    }
  })

  res.send(resData)
})

// 搜索
articleApp.get("/search", async (req, res) => {
  let { title } = req.query

  let resData = { status: 0, message: "搜索文章失败", data: {} }
  let select = {
    title: { $regex: title }
  }
  console.log(select)
  await articleTables.find(select, { _id: false, __v: false }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "所搜文章成功"
      resData.data.article = data
      console.log(data)
    }
  })

  console.log(resData.message)
  res.send(resData)
})

// 获取指定用户文章列表
// key可以为数组，get有上限，故采用post
articleApp.post("/getUserArticleList", async (req, res) => {
  let { key, page = 1, pageSize = 10 } = req.body
  let resData = { status: 0, message: "获取指定用户文章列表", data: {} }
  let select = { key: { $in: key } }
  let dataShow = {
    _id: false,
    content: false
  }
  let filter = {
    skip: (page - 1) * pageSize,
    limit: pageSize * 1,
    sort: { time: -1 }
  }
  await articleTables.find(select).then(data => {
    resData.data.total = data.length
  })
  await articleTables.find(select, dataShow, filter).then(data => {
    resData.status = 1
    resData.data.articleList = JSON.parse(JSON.stringify(data))
  })
  for (let item = 0, len = resData.data.articleList.length; item < len; item++) {
    await userInfoTables.findOne({ key: resData.data.articleList[item].key }).then(data => {
      if (data) {
        resData.data.articleList[item].author = data.name
        resData.data.articleList[item].avatar = data.avatar
      }
    })
  }
  res.send(resData)
})

module.exports = { articleApp, articleValidApp }