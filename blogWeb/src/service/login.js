import service from "./axios.default.js"

class api {
  // 注册
  async register (form) {
    return service.post("/register", form)
  }
  // 登录
  async login (form) {
    return service.post("/login", form)
  }
  // 获取注册验证码
  async getRegisterVerifyCode (form) {
    return service.post("/getRegisterVerifyCode", form)
  }
  // 验证用户是否存在
  async userExist (params) {
    return service.get("/userExist", { params })
  }
  // 有效注册验证码
  async validRegisterVerifyCode (params) {
    return service.get("/validregisterverifycode", { params })
  }
  // 获取重置密码验证码
  async getResetPasswordVerifyCode (form) {
    return service.post("/getresetpasswordverifycode", form)
  }
  // 验证重置密码验证码
  async validResetPasswordVerifyCode (form) {
    return service.post("/validResetPasswordVerifyCode", form)
  }
  // 获取用户账户
  async getUserAccount () {
    return service.get("/validuser/getUserAccount")
  }
  // 重置密码
  async resetPassword (form) {
    return service.post("/validuser/resetPassword", form)
  }
}
export default new api()