import Vue from 'vue'
import Router from 'vue-router'

import not from '../views/404.vue'
import defaults from '../views/default.vue'

import localUser from '../views/1-UserRight/localUser.vue'
import PFCG from '../views/1-UserRight/PFCG.vue'
import PTM from '../views/1-UserRight/PTM.vue'

import allClient from '../views/2-web/allClient.vue'
import audit from '../views/2-web/audit.vue'
import seeAudit from '../views/2-web/seeAudit.vue'

import area from '../views/3-information/area.vue'
import bank from '../views/3-information/bank.vue'
import clientDetails from '../views/3-information/clientDetails.vue'
import section from '../views/3-information/section.vue'

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

    {
      path:'/area',
      name:'area',
      component:area
    },{
      path:'/bank',
      name:'bank',
      component:bank
    },{
      path:'/clientDetails',
      name:'clientDetails',
      component:clientDetails
    },{
      path:'/section',
      name:'section',
      component:section
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
