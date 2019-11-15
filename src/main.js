// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import base from './base'
import axios from 'axios'
import Qs from 'qs'
import './plugins/element.js'
import './public/directives.js'

Vue.use(iView)
Vue.use(base)
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.qs = Qs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')