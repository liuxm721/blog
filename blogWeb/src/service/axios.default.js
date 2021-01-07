import axios from "axios"
import config from "../config.js"

let myAxios = axios.create({
  baseURL: config.apiURL,
  timeout: 10000
})

myAxios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem("authorization")
  return config
})

export default myAxios