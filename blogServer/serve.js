const express = require("express")
const ws = require("ws")
const path = require("path")
const url = require("url")
const { publicConfig } = require("./config/publicConfig.js")
const db = require("./db/connectdb.js")

// db
const { userAccountTables } = require("./db/userTables.js")

let app = express()
// add parser
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// set response header
app.all("*", (req, res, next) => {
  // console.log("无需验证token：",req.body)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")
  res.setHeader("Access-Control-Expose-Headers", "Authorization")
  next()
})
app.all(path.join(publicConfig.baseUrl, publicConfig.validUser, "*"), (req, res, next) => {
  console.log("验证用户：", req.body)
  let token = req.headers.authorization
  userAccountTables.findOne({ token }, { _id: false, __v: false, password: false }).then(data => {
    if (data) {
      req.body.user = data
      next()
    } else {
      res.send({ status: 0, message: "用户未登录" })
    }
  })
})
app.all(path.join(publicConfig.baseUrl, publicConfig.validAdmin, "*"), (req, res, next) => {
  console.log("验证管理员：", req.body)
  let token = req.headers.authorization
  userAccountTables.findOne({ token }, { _id: false, __v: false, password: false }).then(data => {
    if (data && data.power.admin) {
      req.body.user = data
      res.send({ status: 0, message: "不是管理员" })
      // next()
    } else {
      res.send({ status: 0, message: "不是管理员" })
    }
  })
})

// add service
const { fsValidApp, fsApp } = require("./service/fsApp.service.js")
const { loginApp, loginValidApp } = require("./service/loginApp.service.js")
const { userValidApp, userApp } = require("./service/userApp.service.js")
const { articleApp, articleValidApp } = require("./service/articleApp.service.js")
const { draftValidApp } = require("./service/draftApp.service.js")
const { interactionApp } = require("./service/interactionApp.service.js")
const { chatApp } = require("./service/chatApp.service.js")

app.use(path.join(publicConfig.baseUrl), fsApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), fsValidApp)
app.use(path.join(publicConfig.baseUrl), loginApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), loginValidApp)
app.use(path.join(publicConfig.baseUrl), userApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), userValidApp)
app.use(path.join(publicConfig.baseUrl), articleApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), articleValidApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), draftValidApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), interactionApp)
app.use(path.join(publicConfig.baseUrl, publicConfig.validUser), chatApp)

app.listen(publicConfig.port, publicConfig.host)

let notice = {}
let chat = {}

let wss = new ws.Server({
  hots: "0.0.0.0",
  port: 8090
})

wss.on("connection", function (ws, req) {
  let urlParse = url.parse(req.url, true)
  console.log("有新用户啦", urlParse.query.key)
  if (urlParse.pathname === "/chat") {
    chat[urlParse.query.key] = ws
  } else if (urlParse.pathname === "/notice") {
    notice[urlParse.query.key] = ws
  }
  ws.on("message", (me) => {
    let message = JSON.parse(me)
    if (chat[message.to] && chat[message.to].readyState === ws.OPEN) {
      chat[message.to].send(me)
    } else if (notice[message.to] && notice[message.to].readyState === ws.OPEN) {
      notice[message.to].send(me)
    }
  })
})
