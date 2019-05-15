import Vue from 'vue'
import Router from 'vue-router'

import not from '../views/404.vue'
import defaults from '../views/default.vue'

import localUser from '../views/UserRight/localUser.vue'
import PFCG from '../views/UserRight/PFCG.vue'
import PTM from '../views/UserRight/PTM.vue'

import allClient from '../views/web/allClient.vue'
import audit from '../views/web/audit.vue'
import seeAudit from '../views/web/seeAudit.vue'

let vm = new Vue()

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      name:"defaults",
      component:defaults,
    },{
      path:'/errorInfo',
      name:'not',
      component:not,
    },
    
    {
      path:'/localUser/:id',
      name:'localUser',
      component:localUser,
    },{
      path:'/PFCG',
      name:'PFCG',
      component:PFCG
    },{
      path:'/PTM',
      name:'PTM',
      component:PTM
    },

    {
      path:'/allClient',
      name:'allClient',
      component:allClient
    },{
      path:'/audit',
      name:'audit',
      component:audit
    },{
      path:'/seeAudit',
      name:'seeAudit',
      component:seeAudit
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(!to.name) {
    next('/errorInfo')
  } else {
    next()
  }
})

export default router
