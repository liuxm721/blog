const express = require("express")
const path = require("path")
const url = require("url")
const { publicConfig } = require("../config/publicConfig.js")
const { v4 } = require("uuid")
const fs = require("fs")

let fsValidApp = express()
let fsApp = express()

// add plugin
const multer = require("multer")
const { userInfoTables } = require("../db/userTables.js")
let upload = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      cb(null, "./upload")
    },
    filename (req, file, cb) {
      cb(null, v4() + file.originalname)
    }
  })
})

let fields = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "cover", maxCount: 1 }])

// 上传文章封面
fsValidApp.post("/uploadArticleCover", upload.single("cover"), (req, res) => {
  let resData = { status: 0, message: "上传图片失败", data: {} }
  console.log(url.format({
    protocol: "http",
    host: `${publicConfig.host}:${publicConfig.port}`,
  }))
  if (req.file) {
    resData.status = 1
    resData.message = "上传封面成功"
    resData.data.img = url.resolve(
      url.format({ protocol: "http", host: `${publicConfig.host}:${publicConfig.port}` }),
      path.resolve(publicConfig.baseUrl, "getImg?id=", req.file.filename))
  }
  res.send(resData)
})

// 上传头像封面
fsValidApp.post("/uploadUserAvatar", upload.single("avatar"), (req, res) => {
  let resData = { status: 0, message: "上传头像失败", data: {} }
  console.log(url.format({
    protocol: "http",
    host: `${publicConfig.host}:${publicConfig.port}`,
  }))
  if (req.file) {
    resData.status = 1
    resData.message = "上传封面成功"
    resData.data.img = url.resolve(
      url.format({ protocol: "http", host: `${publicConfig.host}:${publicConfig.port}` }),
      path.resolve(publicConfig.baseUrl, "getImg?id=", req.file.filename))
  }
  res.send(resData)
})

// 访问图片
fsApp.get("/getImg", (req, res) => {
  fs.createReadStream(path.join(__dirname, "../upload", req.query.id)).pipe(res)
})

module.exports = { fsValidApp, fsApp }