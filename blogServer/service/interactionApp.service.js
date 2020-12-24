const express = require("express")
const { v4 } = require("uuid")
const articleTables = require("../db/articleTables")
const { userInteractionTables, userInfoTables } = require("../db/userTables")

let interactionApp = express()

// 点赞
interactionApp.post("/like", async (req, res) => {
  let { article_id, user: { key } } = req.body
  let resData = { status: 0, message: "点赞失败", }
  let select = { article_id }
  let update = { $inc: { likes: 1 } }
  await articleTables.updateOne(select, update).then(async msg => {
    if (msg.ok && msg.n) {
      let select = { key }
      let updata = { $addToSet: { likes: article_id } }
      await userInteractionTables.updateOne(select, updata).then(msg => {
        if (msg.ok && msg.n) {
          resData.status = 1
          resData.message = "点赞成功"
        }
      })
    }
  })
  res.send(resData)
})

// 取消点赞
interactionApp.post("/unlike", async (req, res) => {
  let { article_id, user: { key } } = req.body
  let resData = { status: 0, message: "取消点赞失败" }
  let select = { article_id }
  let update = { $inc: { likes: -1 } }
  await articleTables.updateOne(select, update).then(async msg => {
    if (msg.ok && msg.n) {
      let select = { key }
      let updata = { $pull: { likes: article_id } }
      await userInteractionTables.updateOne(select, updata).then(msg => {
        if (msg.ok && msg.n) {
          resData.status = 1
          resData.message = "取消点赞成功"
        }
      })
    }
  })
  res.send(resData)
})

// 收藏
interactionApp.post("/collection", async (req, res) => {
  let { article_id, user: { key } } = req.body
  let resData = { status: 0, message: "收藏失败", }
  let select = { article_id }
  let update = { $inc: { collections: 1 } }
  await articleTables.updateOne(select, update).then(async msg => {
    if (msg.ok && msg.n) {
      let select = { key }
      let updata = { $addToSet: { collections: article_id } }
      await userInteractionTables.updateOne(select, updata).then(msg => {
        if (msg.ok && msg.n) {
          resData.status = 1
          resData.message = "收藏成功"
        }
      })
    }
  })
  res.send(resData)
})

// 取消收藏
interactionApp.post("/uncollection", async (req, res) => {
  let { article_id, user: { key } } = req.body
  let resData = { status: 0, message: "取消收藏失败" }
  let select = { article_id }
  let update = { $inc: { collections: -1 } }
  await articleTables.updateOne(select, update).then(async msg => {
    if (msg.ok && msg.n) {
      let select = { key }
      let updata = { $pull: { collections: article_id } }
      await userInteractionTables.updateOne(select, updata).then(msg => {
        if (msg.ok && msg.n) {
          resData.status = 1
          resData.message = "取消收藏成功"
        }
      })
    }
  })
  res.send(resData)
})

// 关注
interactionApp.post("/follow", async (req, res) => {
  let { key, user } = req.body
  let resData = { status: 0, message: "关注失败" }
  let select = { key: user.key }
  let updata = { $addToSet: { follows: key } }
  await userInteractionTables.updateOne(select, updata).then(msg => { })
  select = { key: key }
  updata = { $addToSet: { fans: user.key } }
  await userInteractionTables.updateOne(select, updata).then(msg => {
    if (msg.ok && msg.n) {
      resData.status = 1
      resData.message = "关注成功"
    }
  })
  res.send(resData)
})

// 取消关注
interactionApp.post("/unfollow", async (req, res) => {
  let { key, user } = req.body
  let resData = { status: 0, message: "取消关注" }
  let select = { key: user.key }
  let updata = { $pull: { follows: key } }
  await userInteractionTables.updateOne(select, updata).then(msg => { })
  select = { key: key }
  updata = { $pull: { fans: user.key } }
  await userInteractionTables.updateOne(select, updata).then(msg => {
    if (msg.ok && msg.n) {
      resData.status = 1
      resData.message = "取消关注成功"
    }
  })
  res.send(resData)
})

// 获取用户对文章的互动
interactionApp.get("/getUserInteractionWithArticle", async (req, res) => {
  let { article_id = "", key = "" } = req.query
  let { user } = req.body
  let resData = { status: 0, message: "获取互动出错", data: {} }
  if (!key) {
    await articleTables.findOne({ article_id }).then(data => {
      if (data) { key = data.key }
    })
  }
  let select = { key: user.key }
  await userInteractionTables.findOne(select).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "获取互动成功"
      resData.data.isLike = data.likes.includes(article_id)
      resData.data.isCollection = data.collections.includes(article_id)
      resData.data.isFollow = data.follows.includes(key)
    }
  })
  res.send(resData)
})


// 评论
interactionApp.post("/uploadComment", async (req, res) => {
  let { comment, user: { key } } = req.body
  let resData = { status: 0, message: "评论失败" }
  comment.comment_id = v4()
  comment.time = new Date()
  comment.from = key
  comment.replys = []
  let select = { article_id: comment.article_id }
  let updata = { $push: { comments: comment } }
  await articleTables.updateOne(select, updata).then(msg => {
    if (msg.ok && msg.n) {
      resData.status = 1
      resData.message = "评论成功"
    }
  })
  res.send(resData)
})

// 回复
interactionApp.post("/uploadReply", async (req, res) => {
  let { reply, user: { key } } = req.body
  let resData = { status: 0, message: "回复" }
  reply.time = new Date()
  reply.from = key
  let select = {
    article_id: reply.article_id,
    comments: { $elemMatch: { comment_id: reply.comment_id } }
  }
  let updata = {
    $push: { "comments.$.replys": reply }
  }
  await articleTables.updateOne(select, updata).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
    }
  })
  res.send(resData)
})

// 获取用户关注表
interactionApp.get("/getfollows", async (req, res) => {
  let { key } = req.body.user
  let follows = []
  let follow = []
  let resData = { status: 0, message: "关注表", data: {} }
  let select = { key }
  await userInteractionTables.findOne(select).then(data => {
    if (data) {
      follows = data.follows
      resData.status = 1
    }
  })
  let dataShow = { _id: false, __v: false }
  for (let i = 0, len = follows.length; i < len; i++) {
    await userInfoTables.findOne({ key: follows[i] }, dataShow).then(data => {
      follow.push(data)
    })
  }

  resData.data.follows = follow

  res.send(resData)
})

// // 获取关注文章
// interactionApp.get("/getfollowarticle", async (req, res) => {
//   let { user } = req.body
//   let { key } = req.query
//   let follows = []
//   let select = { key }
//   let resData = {
//     status: 0,
//     message: "查询关注文章失败",
//     data: {}
//   }
//   if (key === "all") {
//     await userInteractionTables.findOne({ key: user.key }).then(data => {
//       if (data) { follows = data.follows }
//     })
//     select = { key: follows }
//   }
//   await articleTables.find(select).then(data => {
//     resData.status = 1
//     resData.message = "查询成功"
//     resData.data.articleList = data
//   })
//   res.send(resData)
// })

module.exports = { interactionApp }