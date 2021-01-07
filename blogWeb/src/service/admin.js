import service from "./axios.default"

class api {
  async getAdmin (params) {
    return service.get('/validadmin/getadmin', { params })
  }
  async getArticle (params) {
    return service.get('/validadmin/getarticle', { params })
  }
  async getArticleDetail (params) {
    return service.get('/validadmin/getarticledetail', { params })
  }
  async articlePass (form) {
    return service.post('/validadmin/articlepass', form)
  }
  async articleFail (form) {
    return service.post('/validadmin/articlefail', form)
  }
  async deleteArticle (form) {
    return service.post('/validadmin/deletearticle', form)
  }
  async getArticleType (params) {
    return service.get('/getArticleType', { params })
  }
  async getAllUser (params) {
    return service.get('/validadmin/getAllUser', { params })
  }
  async deleteArticleClassify (form) {
    return service.post('/validadmin/deleteArticleClassify', form)
  }
  async addArticleClassify (form) {
    return service.post('/validadmin/addArticleClassify', form)
  }
}

export default new api()