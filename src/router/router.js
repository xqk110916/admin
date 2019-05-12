import Vue from 'vue'
import Router from 'vue-router'

import not from '../views/404.vue'
import defaults from '../views/default.vue'

import localUser from '../views/UserRight/localUser.vue'
import PFCG from '../views/UserRight/PFCG.vue'
import PTM from '../views/UserRight/PTM.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:"defaults",
      component:defaults
    },{
      path:'/localUser',
      name:'localUser',
      children:[{
        path:'/1',
        component:localUser
      },{
        path:'/2',
        component:localUser
      }]
    },{
      path:'/PFCG',
      name:'PFCG',
      component:PFCG
    },{
      path:'PTM',
      name:'PTM',
      component:PTM
    }
  ]
})
