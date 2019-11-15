import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home/HomeCopy'
import Homes from '../components/home/Home'
import ConsultPrice from '../components/consultPrice/consultPriceHome'
import optionalHome from '../components/optional/optionalHome'
import TPageHome from '../components/tPage/TPageHomeCopy'
import Login from '../components/login/Login'
import register from '../components/login/register'
import resetPass from '../components/login/resetPass'

import deal from '../views/deal.vue'
import cicang from '../views/cicang.vue'
import newCicang from '../views/newCicang.vue'
import personalIfo from '../views/personalIfo'
import bangDing from '../views/bangDing'
import lianxi from '../views/lianxi'

import addEmail from '../views/info/addEmail.vue'
import addPhone from '../views/info/addPhone.vue'
import pushEmail from '../views/info/pushEmail.vue'
import pushPhone from '../views/info/pushPhone.vue'
import changePW from '../views/info/changePW.vue'

import changeEmail from '../views/bangding/changeEmail.vue'
import changePass from '../views/bangding/changePass.vue'
import bang from '../views/bangding/bang.vue'
import subAccount from '../views/bangding/subAccount.vue'

import more from '../views/more/more.vue'
import forward from '../views/more/forwardConfig.vue'
import forwardType from '../views/forward_type/forwardType.vue'

import pdf from '../views/pdf.vue'

import offer from '../views/more/offers.vue'
import offer_entrust from '../views/more/offer_entrust.vue'
import offer_entrust_history from '../views/more/offer_entrust_history.vue'
import offer_cicang from '../views/more/offer_cicang.vue'
import offer_CCS from '../views/more/offer_CCS.vue'
import offer_oldcc from '../views/more/offer_oldcc.vue'
import offer_mab from '../views/more/offer_mab.vue'

import socket from '../components/socket.vue'

import test from '../views/test'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/test',
      component: test
    },
    {
      path:'/pdf',
      component: pdf
    },
    {
      path:'/homes',
      component: Homes
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/ConsultPrice',
      name: 'ConsultPrice',
      component: ConsultPrice
    }, {
      path: '/optional',
      name: 'optionalHome',
      component: optionalHome
    }, {
      path: '/TPage',
      name: 'TPageHome',
      component: TPageHome
    }, {
      path: '/login',
      name: 'Login',
      component: Login 
    }, {
      path: '/register',
      name: 'register',
      component: register 
    }, {
      path: '/deal',
      name: 'deal',
      component: deal,
    }, {
      path: '/cicang',
      name: 'cicang',
      component: cicang,
    }, {
      path: '/newcicang',
      name: 'newCicang',
      component: newCicang
    }, {
      path: '/personalIfo',
      name: 'personalIfo',
      component: personalIfo
    }, {
      path: '/addPhone',
      name: 'addPhone',
      component: addPhone
    }, {
      path: '/addEmail',
      name: 'addEmail',
      component: addEmail
    }, {
      path: '/pushPhone',
      name: 'pushPhone',
      component: pushPhone
    }, {
      path: '/pushEmail',
      name: 'pushEmail',
      component: pushEmail
    }, {
      path: '/changePW',
      name: 'changePW',
      component: changePW
    }, {
      path: '/bangDing',
      name: 'bangDing',
      component: bangDing
    }, { 
      path: '/changeEmail',
      name: 'changeEmail',
      component: changeEmail
    }, {
      path: '/changePass',
      name: 'changePass',
      component: changePass
    }, {
      path: '/bang',
      name: 'bang',
      component: bang
    }, {
      path: '/resetPass',
      name: 'resetPass',
      component: resetPass
    }, {
      path: '/lianxi',
      name: 'lianxi',
      component: lianxi
    }, {
      path: '/subAccount',
      name: 'subAccount',
      component: subAccount,
    },

    {
      path:'/more',
      name:'more',
      component:more,
    }, {
      path:'/forward',
      name:'forward',
      component: forward,
    }, {
      path:'/offer/:subNo',
      name:'offer',
      component: offer,
    }, 
    {
      path:'/offer_entrust',
      name:'offer_entrust',
      component: offer_entrust,
    },
    {
      path:'/offer_entrust_history',
      name:'offer_entrust_history',
      component: offer_entrust_history,
    },
    {
      path:'/offer_mab',
      name:'offer_mab',
      component: offer_mab,
    },
    {
      path:'/offer_cicang',
      name:'offer_cicang',
      component: offer_cicang,
    },
    {
      path:'/offer_CCS',
      name:'offer_CCS',
      component: offer_CCS,
    },
    {
      path:'/offer_oldcc',
      name:'offer_oldcc',
      component: offer_oldcc,
    },

    {
      path:'/socket',
      name:'socket',
      component: socket
    },


  ], 
})
