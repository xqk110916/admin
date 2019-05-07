import Vue from 'vue'
import Vuex from 'vuex'
import g from '../public/global.vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyName:g.companyName,
    aFoldStatus:false,
  },
  mutations: {
    changeAFoldStatus (state) {
      state.aFoldStatus = !state.aFoldStatus
    },
  },
  actions: {
    changeAFoldStatus ({ commit }) {
      commit("changeAFoldStatus")
    },
  },
  getters: {

  }
})
