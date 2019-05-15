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
      sessionStorage.setItem('state',JSON.stringify(this.$store.state) )
      console.log(1)
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
