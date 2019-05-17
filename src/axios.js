import axios from 'axios'
import router from './router/router'
import Vue from 'vue'
import el from 'element-ui'
import g from './public/global'

Vue.use(el)
const vm = new Vue()

axios.defaults.baseURL = g.url
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // if (response.data.errorNo === 11002) {
  //   router.push('/login')
  // }
  // if (!response.data.success) {
  //   vm.$message.error(response.data.errorInfo)
  //   return false
  // }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default axios