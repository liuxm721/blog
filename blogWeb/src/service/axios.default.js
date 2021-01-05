import axios from "axios"

let myAxios = axios.create({
  // baseURL: "http://42.194.162.147:8080/api/v1",
  baseURL: "https://www.mengyuan.info/api/v1",
  timeout: 10000
})

myAxios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem("authorization")
  return config
})

export default myAxios