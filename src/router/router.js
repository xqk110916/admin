import Vue from 'vue'
import Router from 'vue-router'

import not from '../views/404.vue'
import defaults from '../views/default.vue'
import login from '../views/Login/login.vue'

import localUser from '../views/1-UserRight/localUser.vue'
import PFCG from '../views/1-UserRight/PFCG.vue'
import PTM from '../views/1-UserRight/PTM.vue'

import allClient from '../views/2-web/allClient.vue'
import audit from '../views/2-web/audit.vue'
import seeAudit from '../views/2-web/seeAudit.vue'

import areaInfo from '../views/3-information/areaInfo.vue'
import bankInfo from '../views/3-information/bankInfo.vue'
import clientDetails from '../views/3-information/clientDetails.vue'
import sectionInfo from '../views/3-information/sectionInfo.vue'

import capitaAccount from '@/views/4-FundsManagement/capitaAccount'
import CustomerDeposit from '@/views/4-FundsManagement/CustomerDeposit'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      name:"defaults",
      component:defaults,
    },{
      path:'/notFound',
      name:'not',
      component:not,
    },{
      path:'/Login',
      name:'Login',
      component:login,
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
      path:'/areaInfo',
      name:'areaInfo',
      component:areaInfo 
    },{
      path:'/bankInfo',
      name:'bankInfo',
      component:bankInfo 
    },{
      path:'/clientDetails',
      name:'clientDetails',
      component:clientDetails
    },{
      path:'/sectionInfo',
      name:'sectionInfo',
      component:sectionInfo 
    },
    
    {
      path:'/capitaAccount',
      name:'capitaAccount',
      component:capitaAccount 
    },{
      path:'/CustomerDeposit',
      name:'CustomerDeposit',
      component:CustomerDeposit 
    },
    
    
  ]
})

router.beforeEach((to, from, next) => {
  if(!to.name) {
    next('/notFound')
  } else {
    next()
  }
})

export default router
