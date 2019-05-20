import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aFoldStatus:false,
    height:750,
    searchStatus:false,
  },
  mutations: {
    changeAFoldStatus (state) {
      state.aFoldStatus = !state.aFoldStatus
    },
    changeHeight (state, height) {
      state.height = height
    },
    changeSearchStatus (state, flag) {
      state.searchStatus = flag
    }
  },
  actions: {
    changeAFoldStatus ({ commit }) {
      commit("changeAFoldStatus")
    },
    changeHeight ({ commit }, height) {
      commit("changeHeight", height)
    },
    changeSearchStatus ({ commit }, flag) {
      commit("changeSearchStatus", flag)
    },
  },
  getters: {
    Height(state){
      return state.height
    },
    SearchStatus(state) {
      return state.searchStatus
    },
  }
})
