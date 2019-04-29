import Vue from 'vue'
import Router from 'vue-router'

import not from '../views/404.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/404',
      name:"not",
      component:not
    }
  ]
})
