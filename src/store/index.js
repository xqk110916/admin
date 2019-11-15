import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    CacheDataStore: [],
    codeListStore: [],
    restDayStore: [],
    festivalListStore: [],
    instrumentStore: [],
    optionalCode: [],
    userID:'',    //用来记录选择当前的用户
    bdID:'',    //仅用来做绑定界面操作用
    username:'请登录',
    gsName:'南华资本管理有限公司',
    size:0,
    
    bdobj:{},
    flag:true,
    widths:[],
  },
  actions: {
    changeCacnhe (ctx, cache) {
      ctx.commit('changeCacnhe', cache)
    },
    changeRestDate (ctx, restd) {
      ctx.commit('changeRestDate', restd)
    },
    changeCodeList (ctx, codeL) {
      ctx.commit('changeCodeList', codeL)
    },
    changeFestList (ctx, festL) {
      ctx.commit('changeFestList', festL)
    },
    changeInstrument (ctx, instrL) {
      ctx.commit('changeInstrument', instrL)
    },
    changeOptional (ctx, optionL) {
      ctx.commit('changeOptional', optionL)
    },
    changeUserID (ctx, ID) {
      ctx.commit('changeUserID', ID)
    },
    changebdID (ctx, ID) {
      ctx.commit('changebdID', ID)
    },
    changeUserName (ctx, name) {
      ctx.commit('changeUserName', name)
    },
    changeSize (ctx, size) {
      ctx.commit("changeSize", size)
    },
    changebdObj (ctx, obj) {
      ctx.commit("changebdObj", size)
    },
    changeFlag (ctx, flag) {
      ctx.commit('changeFlag', flag)
    },
    changeWidths (ctx, arr) {
      ctx.commit('changeWidths', arr)
    },
  },
  mutations: {
    changeCacnhe (state, cache) {
      state.CacheDataStore = cache
    },
    changeRestDate (state, restd) {
      state.restDayStore = restd
    },
    changeCodeList (state, codeL) {
      state.codeListStore = codeL
    },
    changeFestList (state, festL) {
      state.festivalListStore = festL
    },
    changeInstrument (state, instrL) {
      state.instrumentStore = instrL
    },
    changeOptional (state, optionL) {
      state.optionalCode = optionL
    },
    changeUserID (state, ID) {
      state.userID = ID
    },
    changebdID (state, ID) {
      state.bdID = ID
    },
    changeUserName (state, name) {
      state.username = name
    },
    changeSize (state, size) {
      state.size = size
    },
    changebdObj (state, obj) {
      state.bdobj = obj
    },
    changeFlag (state, flag) {
      state.flag = flag
    },
    changeWidths (state, arr) {
      state.widths = arr
    },
  },
  getters:{
    gsName (state) {
      return state.gsName
    },
    getWidths (state) {
      return state.widths
    }
  }
})
