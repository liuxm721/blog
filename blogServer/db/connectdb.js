const mongoose = require("mongoose")

module.exports = mongoose.connect("mongodb://127.0.0.1:27017/shenyi", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("mongodb 连接成功")
}).catch(err => {
  console.log("mongodb 连接失败")
})