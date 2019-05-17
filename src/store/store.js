import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aFoldStatus:false,
    height:750,
  },
  mutations: {
    changeAFoldStatus (state) {
      state.aFoldStatus = !state.aFoldStatus
    },
    changeHeight (state, height) {
      state.height = height
      
    },
  },
  actions: {
    changeAFoldStatus ({ commit }) {
      commit("changeAFoldStatus")
    },
    changeHeight ({ commit }, height) {
      commit("changeHeight", height)
    },
  },
  getters: {
    Height(state){
      return state.height
    }
  }
})
