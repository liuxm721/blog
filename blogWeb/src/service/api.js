import service from "./axios.default.js"

class api {


  // 验证用户
  async getUserInfo () {
    return service.get("/validuser/user/baseinfo")
  }

  async uploadArticle (form) {
    return service.post("/validuser/article/upload", form)
  }
  // 获取文章列表
  async getArticleList (params) {
    return service.get("/article/getarticlelist", { params })
  }

  // 获取文章详情
  async getArticleDetial (params) {
    return service.get("/article/getarticledetail", { params })
  }
  // 搜索
  async search (params) {
    return service.get("/article/search", { params })
  }

  async uploadDraft (form) {
    return service.post("/validuser/draft/upload", form)
  }
  // 删除草稿
  async deleteDraft (form) {
    return service.post("/validuser/draft/deletedraft", form)
  }
  // 获取草稿列表
  async getDraft (params) {
    return service.get("/validuser/draft/get", { params })
  }
  // 获取草稿详细
  async getDraftDetail (params) {
    return service.get("/validuser/draft/getdetail", { params })
  }
  async uploadCover (form) {
    return service.post("/validuser/fs/upload", form)
  }
  async uploadComment (form) {
    return service.post("/validuser/article/comment", form)
  }
  async uploadReply (form) {
    return service.post("/validuser/article/reply", form)
  }

  // 点赞
  async like (form) {
    return service.post("/validuser/like", form)
  }
  // 取消点赞
  async unlike (form) {
    return service.post("/validuser/unlike", form)
  }
  // 收藏
  async collection (form) {
    return service.post("/validuser/collection", form)
  }
  // 取消收藏
  async uncollection (form) {
    return service.post("/validuser/uncollection", form)
  }
  // 关注
  async follow (form) {
    return service.post("/validuser/follow", form)
  }
  // 取消收藏
  async unfollow (form) {
    return service.post("/validuser/unfollow", form)
  }
  // 获取用户对文章的互动
  async getinteraction (params) {
    return service.get("/validuser/getinteraction", { params })
  }
  // 获取用户关注
  async getfollows (params) {
    return service.get("/validuser/getfollows", { params })
  }
  // 获取关注文章
  async getfollowarticle (params) {
    return service.get("/validuser/getfollowarticle", { params })
  }
  // 获取聊天记录
  async getChatRecord (params) {
    return service.get("/validuser/getchatrecord", { params })
  }
  // 获取聊天列表
  async getChatList (params) {
    return service.get("/validuser/getchatlist", { params })
  }
  // 发送聊天
  async sendMessage (form) {
    return service.post("/validuser/sendmessage", form)
  }
  // 更改用户信息
  async changeUserInfo (form) {
    return service.post("/validuser/user/changeuserinfo", form)
  }
  // 更改用户头像
  async changeUserAvatar (form) {
    return service.post("/validuser/user/setavatar", form)
  }
  async getPersonalStatistics (params) {
    return service.get("/validuser/user/getpersonalstatistics", { params })
  }
}

export default new api()