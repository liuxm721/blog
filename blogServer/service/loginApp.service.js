const express = require("express")
const crytop = require("crypto")
const { v4, v1 } = require("uuid")
const nodemailer = require("nodemailer")
const { userAccountTables, userInfoTables, userInteractionTables, userRegisterTables } = require("../db/userTables")
const { update } = require("../db/articleTables")

function encryption (password, key) {
  return crytop.createHash("sha256").update(password + key).digest("hex")
}

let loginApp = express()
let loginValidApp = express()


// 登录
loginApp.post("/login", async (req, res) => {
  let { account, password } = req.body
  let resData = { status: 0, message: "用户名或密码错误" }
  let select = { account }
  await userAccountTables.findOne(select).then(async data => {
    if (data && data.password === encryption(password, data.key)) {
      let token = encryption(v4(), v4())
      await userAccountTables.updateOne(select, { token }).then(msg => {
        res.setHeader("Authorization", token)
        resData.status = 1
        resData.message = "登录成功"
      })
    }
  })
  res.send(resData)
})

// 注册
loginApp.post("/register", async (req, res) => {
  let { account, password, verifyCode } = req.body
  let resData = { status: 0, message: "用户注册" }
  console.log(1)
  let select = { account, verify_code: verifyCode }
  await userRegisterTables.deleteOne(select).then(async data => {
    if (data) {
      let key = v4()
      let token = encryption(v4(), v4())
      let name = "用户" + v1().slice(0, 8)
      password = encryption(password, key)
      userAccountTables.create({ key, account, password, token })
      userInfoTables.create({ key, name })
      userInteractionTables.create({ key })
      res.setHeader("Authorization", token)
      resData.status = 1
      resData.message = "注册成功，自动登录中"


    }
  })
  res.send(resData)
})

// 获取注册验证码
loginApp.post("/getRegisterVerifyCode", async (req, res) => {
  let { account } = req.body
  let resData = { status: 0, message: "获取验证码失败" }
  await userAccountTables.findOne({ account }).then(async data => {
    if (!data) {
      await sendemail(account, "您的注册验证码为：").then(data => {
        resData.status = 1
        resData.message = "发送成功，请前往邮箱查看"
        userRegisterTables.updateOne({ account }, { verify_code: data }).then(msg => {
          if (!msg.ok || !msg.n) { userRegisterTables.create({ account, verify_code: data }) }
        })
      })
    }
  })
  res.send(resData)
})

// 发送邮件
function sendemail (account, tip) {
  let trans = nodemailer.createTransport({
    host: "smtp.ym.163.com",
    port: 25,
    secure: false,
    auth: {
      user: "lxm@mengyuannetwork.com",
      pass: "Lxm301415"
    }
  })
  let code = Math.random().toString().slice(2, 8)
  return new Promise((resolve, reject) =>
    trans.sendMail({
      from: "lxm@mengyuannetwork.com",
      to: account,
      subject: "梦渊博客验证码",
      html: `
    <div id="id" style="padding: 100px 0;text-align: center;">
	    <span>${tip}</span>
      <span style="font-size: 3rem;letter-spacing: 10px">${code}</span>
    </div>`
    }, (err, info) => {
      if (err) {
        reject(err)
      } else {
        resolve(code)
      }
    })
  )
}

// 有效注册验证码
loginApp.get("/validregisterverifycode", async (req, res) => {
  let { verifyCode, account } = req.query
  let resData = { status: 0, message: "验证无效" }
  await userRegisterTables.findOne({ verify_code: verifyCode, account }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "验证有效"
    }
  })
  res.send(resData)
})

// 用户是否存在
loginApp.get("/userExist", async (req, res) => {
  let { account } = req.query
  let resData = { status: 0, message: "用户不在" }
  await userAccountTables.findOne({ account }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "用户已存在"
    }
  })
  res.send(resData)
})

// 获取重置密码验证码
loginApp.post("/getResetPasswordVerifyCode", async (req, res) => {
  let { account } = req.body
  let resData = { status: 0, message: "获取重置密码验证码失败" }

  await userAccountTables.findOne({ account }).then(async data => {
    if (data) {
      await sendemail(account, "您的重置密码验证码为：").then(code => {
        userAccountTables.updateOne({ account }, { reset_password_verify_code: code }).then(msg => { })
        resData.status = 1
        resData.message = "验证已发送，请前往邮箱查看"
      })
    }
  })
  res.send(resData)
})

// 有效重置密码验证码
loginApp.post("/validResetPasswordVerifyCode", async (req, res) => {
  let { account, verifyCode } = req.body
  let resData = { status: 0, message: "无效重置密码验证码" }
  await userAccountTables.findOne({ account, reset_password_verify_code: verifyCode }).then(data => {
    if (data) {
      resData.status = 1
      resData.message = "验证成功"
    }
  })
  if (resData.status) {
    let token = encryption(v4(), v4())
    await userAccountTables.updateOne({ account }, { token }).then(msg => {
      if (msg.n && msg.ok) {
        res.setHeader("Authorization", token)
      }
    })
  }
  res.send(resData)
})

// 获取用户账户
loginValidApp.get("/getuseraccount", async (req, res) => {
  let { account } = req.body.user
  let resData = { status: 1, message: "获取账户", data: { account } }
  res.send(resData)
})


// 重置密码
loginValidApp.post("/resetPassword", async (req, res) => {
  let { password } = req.body
  let { key } = req.body.user
  let resData = { status: 0, message: "修改密码" }
  let select = { key }
  let update = { password: encryption(password, key) }
  await userAccountTables.updateOne(select, update).then(msg => {
    if (msg.n && msg.ok) {
      resData.status = 1
      resData.message = "修改密码成功"
    }
  })
  res.send(resData)
})
module.exports = { loginApp, loginValidApp }