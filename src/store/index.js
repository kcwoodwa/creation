import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showHidden: false
  
  },
  getters:{
    getShowHidden: state=>{
      return state.showHidden
    }
  },
  mutations: {
    unhide(state){
      state.showHidden = !state.showHidden
    }
  },
  actions: {
  },
  modules: {
   
  }
})
