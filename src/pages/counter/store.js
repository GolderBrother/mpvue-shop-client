// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  action:{
    increate:({commit,state}) => {
      commit("INCREATE",state) 
    },
    decreate:({commit,state}) => {
      commit("DECREATE",state)
    }
  },
  mutations: {
    INCREATE: (state) => {
      const obj = state
      obj.count += 1
    },
    DECREATE: (state) => {
      const obj = state
      obj.count -= 1
    }
  }
})

export default store
