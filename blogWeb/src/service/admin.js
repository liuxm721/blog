import service from "./axios.default"

class api {
  async validAdmin (params) {
    service.get('/validadmin/', { params })
  }
}

export default new api()