const express = require('express')

let adminValidApp = express()

adminValidApp.get('/getadmin', (req, res) => {
  let resData = { status: 1, message: '获取管理员信息', }
})

module.exports = { adminValidApp }