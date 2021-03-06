const express = require("express")
const path = require("path")
const { v4 } = require("uuid")
const fs = require("fs")

let fsValidApp = express()
let fsApp = express()

// add plugin
const multer = require("multer")
let upload = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      cb(null, path.resolve(__dirname, "../upload"))
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
  if (req.file) {
    resData.status = 1
    resData.message = "上传封面成功"
    resData.data.img = req.file.filename
  }
  res.send(resData)
})

// 上传头像
fsValidApp.post("/uploadUserAvatar", upload.single("avatar"), (req, res) => {
  let resData = { status: 0, message: "上传头像", data: {} }
  if (req.file) {
    resData.status = 1
    resData.data.img = req.file.filename
  }
  res.send(resData)
})

// 访问图片
fsApp.get("/getImg", (req, res) => {
  fs.createReadStream(path.join(__dirname, "../upload", req.query.id)).pipe(res)
})

module.exports = { fsValidApp, fsApp }