import service from "./axios.default.js"

class api {

  // 获取关注文章
  async getUserInfo (params) {
    return service.get("/getzone", { params })
  }
  // 获取指定用户文章列表
  async getuserarticlelist (params) {
    return service.get("/article/getuserarticlelist", { params })
  }
}

export default new api()