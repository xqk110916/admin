import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    aFoldStatus:false,
    height:750,
    searchStatus:false,
    known:false,
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
    },
    changeKnown (state, flag) {
      state.known = flag
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
    changeKnown ({ commit }, flag) {
      commit("changeKnown", flag)
    },
  },
  getters: {
    Height(state){
      return state.height
    },
    SearchStatus(state) {
      return state.searchStatus
    },
    Known(state) {
      return state.known
    }
  }
})
