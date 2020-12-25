import service from "./axios.default.js"

class api {

  // 上传文章
  async uploadArticle (form) {
    return service.post("/validuser/uploadArticle", form)
  }
  // 获取用户信息
  async getUserInfo (params) {
    return service.get("/validuser/getUserInfo", { params })
  }
  // 获取其它用户用户信息
  async getOtherUserInfo (params) {
    return service.get("/getOtherUserInfo", { params })
  }
  // 上传文章
  async uploadArticle (form) {
    return service.post("/validuser/uploadArticle", form)
  }
  // 上传草稿
  async uploadDraft (form) {
    return service.post("/validuser/uploadDraft", form)
  }
  // 获取草稿列表
  async getDraft (params) {
    return service.get("/validuser/getDraft", { params })
  }
  // 预览草稿
  async getDraftDetail (params) {
    return service.get("/validuser/getDraftDetail", { params })
  }
  // 删除草稿
  async deleteDraft (form) {
    return service.post("/validuser/deleteDraft", form)
  }
  // 草稿转正文
  async draftToArticle (form) {
    return service.post("/validuser/draftToArticle", form)
  }
  // 获取用户文章状态
  async getUserArticleState (params) {
    return service.get("/validuser/getUserArticleState", { params })
  }
  // 获取文章封面上传api
  getUploadArticleCoverUrl () {
    return service.defaults.baseURL + "/validuser/uploadArticleCover"
  }
  // 获取用户头像上传api
  uploadUserAvatar () {
    return service.defaults.baseURL + "/validuser/uploadUserAvatar"
  }
  // 获取服务器图片资源
  getImgUrl (id) {
    return service.defaults.baseURL + "/getimg?id=" + id
  }
  // 获取文章
  async getArticleList (params) {
    return service.get("/getarticlelist", { params })
  }
  // 获取文章详情
  async getArticleDetail (params) {
    return service.get("/getArticleDetail", { params })
  }
  // 获取文章评论
  async getArticleComment (params) {
    return service.get("/getArticleComment", { params })
  }
  // 获取评论回复
  async getCommentReply (params) {
    return service.get("/getCommentReply", { params })
  }
  // 获取用户空间
  async getzone (params) {
    return service.get("/getzone", { params })
  }
  // 获取多个用户文章
  async getUserArticleList (form) {
    return service.post("/getUserArticleList", form)
  }
  // 获取用户对文章的互动
  async getUserInteractionWithArticle (params) {
    return service.get("/validuser/getUserInteractionWithArticle", { params })
  }
  // 点赞
  async like (form) {
    return service.post("/validuser/like", form)
  }
  // 点赞
  async unLike (form) {
    return service.post("/validuser/unlike", form)
  }
  // 收藏
  async collection (form) {
    return service.post("/validuser/collection", form)
  }
  // 取消收藏
  async unCollection (form) {
    return service.post("/validuser/unCollection", form)
  }
  // 点赞
  async follow (form) {
    return service.post("/validuser/follow", form)
  }
  // 点赞
  async unFollow (form) {
    return service.post("/validuser/unfollow", form)
  }
  // 评论
  async uploadComment (form) {
    return service.post("/validuser/uploadComment", form)
  }
  // 回复
  async uploadReply (form) {
    return service.post("/validuser/uploadReply", form)
  }
  // 设置用户头像
  async changeUserAvatar (form) {
    return service.post("/validuser/changeUserAvatar", form)
  }
  async changeUserInfo (form) {
    return service.post("/validuser/changeUserInfo", form)
  }
  // 获取用户空间
  async getUserZone (params) {
    return service.get("/validuser/getUserZone", { params })
  }
  // 获取推荐文章
  async getRecommendedArticles (params) {
    return service.get("/validuser/getRecommendedArticles", { params })
  }
  // 获取推荐文章
  async getFollows (params) {
    return service.get("/validuser/getFollows", { params })
  }
  // 获取聊天列表
  async getChatList (params) {
    return service.get("/validuser/getChatList", { params })
  }
  // 获取聊天记录
  async getChatRecord (params) {
    return service.get("/validuser/getChatRecord", { params })
  }
  // 发送消息
  async sendMessage (form) {
    return service.post("/validuser/sendMessage", form)
  }
  // 搜索
  async search (params) {
    return service.get("/search", { params })
  }

}

export default new api()