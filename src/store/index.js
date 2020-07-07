import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showHidden: false,
    fileLocations:localStorage
  
  },
  getters:{
    getShowHidden: state=>{
      return state.showHidden
    },
    getFileLocations: state=>{
      return state.fileLocations
    }
  },
  mutations: {
    unhide(state){
      state.showHidden = !state.showHidden
    },
    setFileLocation(state, obj){
     
      state.fileLocations.setItem(obj.name, obj.location)

    }
  },
  actions: {
  },
  modules: {
   
  }
})
