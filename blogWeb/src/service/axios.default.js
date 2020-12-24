import axios from "axios"

let myAxios = axios.create({
  baseURL: "http://192.168.3.78:8080/api/v1",
  timeout: 10000
}) 

myAxios.interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem("authorization")
  return config
})

export default myAxios