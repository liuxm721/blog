const express = require('express')
const articleTables = require('../db/articleTables')
const { userInfoTables } = require('../db/userTables')
const { v4 } = require('uuid')
const { siteAdminTable } = require('../db/siteAdmin')

let adminValidApp = express()

// 获取管理员信息
adminValidApp.get('/getadmin', (req, res) => {
  let resData = { status: 1, message: '获取管理员信息' }
  res.send(resData)
})

// 获取文章列表
adminValidApp.get('/getarticle', async (req, res) => {
  let { page, pageSize, approved } = req.query
  let resData = { status: 0, message: '获取审核文章', data: {} }
  let select = { approved }
  let showData = { _id: false, __v: false, content: false }
  await articleTables.find(select, showData).then(data => {
    resData.status = 1
    resData.data.total = data.length
    resData.data.articleList = data.splice((page - 1) * pageSize, pageSize)
  })
  res.send(resData)
})

// 获取文章详情
adminValidApp.get('/getarticledetail', async (req, res) => {
  let { article_id } = req.query
  let resData = { status: 0, message: '获取审核文章', data: {} }
  let select = { article_id }
  let showData = { _id: false, __v: false }
  await articleTables.findOne(select, showData,).then(data => {
    if (data) {
      resData.status = 1
      resData.data.articleDetail = JSON.parse(JSON.stringify(data))
    }
  })
  select = { key: resData.data.articleDetail.key }
  await userInfoTables.findOne(select).then(data => {
    if (data) {
      resData.data.articleDetail.author = data.name
      resData.data.articleDetail.avatar = data.avatar
    }
  })
  res.send(resData)
})

// 文章通过审核
adminValidApp.post('/articlepass', async (req, res) => {
  let { article_id } = req.body
  let resData = { status: 0, message: '文章通过审核' }
  let select = { article_id }
  let update = { approved: 'pass' }
  await articleTables.updateOne(select, update,).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
    }
  })
  res.send(resData)
})

// 文章未通过审核
adminValidApp.post('/articlefail', async (req, res) => {
  let { article_id } = req.body
  let resData = { status: 0, message: '文章未通过审核' }
  let select = { article_id }
  let update = { approved: 'fail' }
  await articleTables.updateOne(select, update,).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
    }
  })
  res.send(resData)
})

// 删除文章
adminValidApp.post('/deletearticle', async (req, res) => {
  let { article_id } = req.body
  let resData = { status: 0, message: '删除文章' }
  let select = { article_id }
  await articleTables.deleteOne(select).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
    }
  })
  res.send(resData)
})

// 增加文章分类
adminValidApp.post('/addArticleClassify', async (req, res) => {
  let { classify_id, type, label } = req.body
  let resData = { status: 0, message: '增加文章分类' }
  let select = { type: { $elemMatch: { classify_id } } }
  let update = { $set: { 'type.$': { classify_id, type, label } } }
  await siteAdminTable.updateOne(select, update).then(msg => { msg.n && msg.ok && (resData.status = 1) })
  if (!resData.status) {

    select = { type: { $exists: true } }
    update = { $push: { type: { classify_id, type, label } } }
    await siteAdminTable.updateOne(select, update).then(msg => { msg.n && msg.ok && (resData.status = 1) })
  }
  if (!resData.status) {
    newObj = { type: [{ classify_id, type, label }] }
    siteAdminTable.create(newObj)
  }
  res.send(resData)
})

// 删除文章分类
adminValidApp.post('/deleteArticleClassify', async (req, res) => {
  let { classify_id } = req.body
  let resData = { status: 0, message: '删除文章分类' }
  let select = { type: { $elemMatch: { classify_id } } }
  let update = { $pull: { type: { classify_id } } }
  await siteAdminTable.updateOne(select, update).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
    }
  })
  res.send(resData)
})

// 获取所有用户
adminValidApp.get('/getAllUser', async (req, res) => {
  let { page, pageSize } = req.query
  page > 0 || (page = 1)
  pageSize > 0 || (pageSize = 10)
  let resData = { status: 0, message: '获取所有用户', data: {} }
  resData.data.total = await userInfoTables.countDocuments({}).catch(err => console.log(err))
  resData.data.userList = await userInfoTables.find({}, { _id: false, __v: false }, { skip: (page - 1) * pageSize, limit: +pageSize })
  resData.data.userList && (resData.status = 1)
  res.send(resData)
})

module.exports = { adminValidApp }