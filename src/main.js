import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './plugins/element.js'
import g from './public/global'
import axios from './axios'
import qs from 'qs'

Vue.config.productionTip = false
Vue.prototype.g = g
Vue.prototype.axios = axios
Vue.prototype.qs = qs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
