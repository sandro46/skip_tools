import Vue from 'vue'
import Vuex from 'vuex'
import form from './form'
import task from './task'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    form,
    task
  }
})
