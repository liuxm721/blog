import axios from "axios"

let myAxios = axios.create({
  baseURL: "https://www.mengyuan.info/api/v1",
  timeout: 10000
})

myAxios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem("authorization")
  return config
})

export default myAxios