const express = require("express")
const { userInteractionTables, userInfoTables } = require("../db/userTables")

let chatApp = express()

// 获取聊天记录
chatApp.get("/getchatrecord", async (req, res) => {
  let { key, page = 1, pageSize = 10 } = req.query
  let { user } = req.body
  let resData = { status: 0, message: "获取聊天", data: {} }
  let select = { key: user.key, chats: { $elemMatch: { to: key } } }
  let dataShow = { chats: { $elemMatch: { to: key } } }
  await userInteractionTables.findOne(select, dataShow).then(data => {
    if (data) {
      resData.status = 1
      let chats = data.chats[0] || { to: "", record: [] }
      let len = chats.record.length;
      (page > 0) || (page = 1)
      let start = len - page * pageSize
      let end = len - (page - 1) * pageSize
      start < 0 && (start = 0)
      end < 0 && (end = 0)
      chats.record = chats.record.slice(start, end)
      resData.data.chats = chats
      start == 0 && (resData.data.noMore = true)
      let update = { $set: { "chats.$.unread": 0 } }
      userInteractionTables.updateOne(select, update).then(msg => { console.log(msg) })
    } else {
      resData.data.chats = {}
    }
  })
  await userInfoTables.findOne({ key }, { _id: false, __v: false }).then(data => {
    resData.data.chats.to = data
  })
  await userInfoTables.findOne({ key: user.key }, { _id: false, __v: false }).then(data => {
    resData.data.chats.from = data
  })

  res.send(resData)
})

// 获取聊天列表
chatApp.get("/getchatlist", async (req, res) => {
  let { user } = req.body
  let resData = { status: 0, message: "获取聊天列表", data: {} }
  let select = { key: user.key }
  await userInteractionTables.findOne(select, { chats: { record: false } }).then(async data => {
    if (data) {
      let chats = data.chats.sort((a, b) => { return b.last.time - a.last.time })
      for (let i = 0, len = chats.length; i < len; i++) {
        await userInfoTables.findOne({ key: chats[i].to }, { _id: false, __v: false }).then(data => {
          if (data) {
            chats[i].avatar = data.avatar
            chats[i].name = data.name
            chats[i].key = data.key
          }
        })
      }
      resData.status = 1
      resData.data.chats = chats
    }
  })
  res.send(resData)
})

// 发送聊天
chatApp.post("/sendMessage", async (req, res) => {
  let { key } = req.body.user
  let { record } = req.body
  let resData = { status: 0, message: "发送聊天", data: {} }
  let select = { key, chats: { $elemMatch: { to: record.to } } }
  let updata = {}
  record.time = new Date()
  await userInteractionTables.findOne(select).then(async data => {
    if (data) {
      updata = {
        $push: { "chats.$.record": { sender: "slef", content: record.content, time: record.time } },
        $set: { "chats.$.last": { sender: "slef", content: record.content, time: record.time } }
      }
    } else {
      select = { key }
      updata = {
        $push: {
          chats: {
            to: record.to,
            record: [{ sender: "slef", content: record.content, time: record.time }],
            unread: 0,
            last: { sender: "slef", content: record.content, time: record.time }
          }
        }
      }
    }
    await userInteractionTables.updateOne(select, updata).then(msg => {
      if (msg.ok && msg.n) {
        resData.message = "发送聊天成功"
      }
    })
  })
  select = { key: record.to, chats: { $elemMatch: { to: key } } }
  await userInteractionTables.findOne(select).then(async data => {
    if (data) {
      updata = {
        $push: { "chats.$.record": { sender: "other", content: record.content, time: record.time } },
        $inc: { "chats.$.unread": 1 },
        $set: { "chats.$.last": { sender: "slef", content: record.content, time: record.time } }
      }
    } else {
      select = { key: record.to }
      updata = {
        $push: {
          chats: {
            to: key, record: [{ sender: "other", content: record.content, time: record.time }],
            unread: 1,
            last: { sender: "slef", content: record.content, time: record.time }
          }
        }
      }
    }
    await userInteractionTables.updateOne(select, updata).then(msg => {
      if (msg.ok && msg.n) {
        resData.message = "发送聊天成功"
      }
    })

  })


  res.send(resData)
})
module.exports = { chatApp }
