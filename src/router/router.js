import Vue from 'vue'
import Router from 'vue-router'

import index from '../views/index.vue'
import not from '../views/404.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:"index",
      component:index
    },
    {
      path:'/404',
      name:"not",
      component:not
    }
  ]
})
