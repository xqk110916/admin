import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyName:'浙江南华资本管理有限公司',
    aFoldStatus:false,
  },
  mutations: {
    changeAFoldStatus (state, flag) {
      state.aFoldStatus = flag
    },
  },
  actions: {
    changeAFoldStatus ({ commit }, flag) {
      commit("changeAFoldStatus", flag)
    },
  },
  getters: {

  }
})
