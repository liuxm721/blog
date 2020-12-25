const express = require("express")
const articleTables = require("../db/articleTables")
const { userInfoTables, userInteractionTables, userAccountTables } = require("../db/userTables")

let userValidApp = express()
let userApp = express()

// 获取用户信息
userValidApp.get("/getUserInfo", async (req, res) => {
  let user = req.body.user
  let resData = {
    status: 0,
    message: "查询用户信息失败",
    data: {}
  }
  let select = { key: user.key }

  await userInfoTables.findOne(select).then(data => {
    resData.status = 1
    resData.message = "查询用户信息成功"
    resData.data = {
      key: user.key,
      account: user.account,
      power: user.power,
      avatar: data.avatar,
      name: data.name
    }
  })
  res.send(resData)
})
// 更改用户信息
userValidApp.post("/changeuserinfo", async (req, res) => {
  let { user, name } = req.body
  let resData = {
    status: 0,
    message: "更改信息",
    data: {}
  }
  let select = { key: user.key }
  let updata = { name }
  await userInfoTables.updateOne(select, updata).then(data => {
    resData.status = 1
    resData.message = "更改信息成功"
  })

  res.send(resData)
})

//  设置头像
userValidApp.post("/changeUserAvatar", async (req, res) => {
  let { user, avatar } = req.body
  let resData = { status: 0, message: "更改头像", }
  let select = { key: user.key }
  let updata = { avatar }
  await userInfoTables.updateOne(select, updata).then(data => {
    resData.status = 1
    resData.message = "更改头像成功"
  })
  res.send(resData)
})

// 获取统计信息
userValidApp.get("/getUserZone", async (req, res) => {
  let { key } = req.body.user
  let resData = {
    status: 0,
    message: "获取统计信息",
    data: {}
  }
  let select = { key }
  await userInfoTables.findOne(select).then(data => {
    if (data) {
      resData.data.avatar = data.avatar
      resData.data.name = data.name
    }
  })
  await articleTables.find(select).then(data => {
    resData.data.articleNum = data.length
    resData.data.likeNum = data.reduce((total, item) => {
      return total + item.likes
    }, 0)
  })
  await userInteractionTables.findOne(select).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "获取统计信息成功"
      resData.data.followNum = data.follows.length
      resData.data.fanNum = data.fans.length
    }
  })

  res.send(resData)
})

// 获取空间
userApp.get("/getzone", async (req, res) => {
  let { key } = req.query
  let resData = { status: 0, message: "未找到用户", data: {} }
  resData.data.key = key
  await userAccountTables.findOne({ key }).then(data => {
    if (data) {
      resData.data.account = data.account
    }
  })
  await userInfoTables.findOne({ key }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "找到"
      resData.data.name = data.name
      resData.data.avatar = data.avatar
    }
  })
  await userInteractionTables.findOne({ key }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "找到"
      resData.data.followNum = data.follows.length
      resData.data.fanNum = data.fans.length
    }
  })
  await articleTables.find({ key }).then(data => {
    resData.status = 1
    resData.message = "找到"
    resData.data.articleNum = data.length
    resData.data.likeNum = data.reduce((total, item) => {
      return total + item.likes
    }, 0)
  })
  res.send(resData)
})

// 获取指定用户信息
userApp.get("/getOtherUserInfo", async (req, res) => {
  let { key } = req.query
  let resData = { status: 0, message: "获取指定用户信息", data: {} }
  let select = { key }
  let showData = { _id: false, __v: false }
  await userInfoTables.findOne(select, showData).then(data => {
    if (data) {
      resData.status = 1
      resData.data = data
    }
  })
  res.send(resData)
})

module.exports = { userValidApp, userApp }