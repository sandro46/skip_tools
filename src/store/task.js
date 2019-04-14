import axios from 'axios'
const config = require('./config.json')

const state = {
  items: [],
  current_files: [],
  courent_sources: []
}

const getters = {
  items(state){
    return state.items
  },
  current_files(state){
    return state.current_files
  }
}

const mutations = {
  setItems(state, items){
    state.items = items;
  },
  setCurrentSources(state, items){
    state.courent_sources = items;
  },
  setCurrentFiles(state, items){
    state.current_files = items;
  }
}

const actions = {
  loadFileList({ commit }, pull_id) {
    return new Promise((resolve, reject) => {
      axios({
        url: '/task_log.php?get_files='+pull_id,
        baseURL: config.base_url,
        method: 'get'
      }).then(function (response) {
          if (response.data.err == '') {
            commit('setCurrentFiles', response.data.payload.files)
            commit('setCurrentSources', response.data.payload.sources)
            resolve('OK')
          } else {
            reject(response.data.err ? response.data.err : '500 Ошибка обработки запроса на сервере.')
          }
        })
        .catch(function (error) {
          reject(error)
        })
    });
  },
  loadTaskList({ commit }) {
    return new Promise((resolve, reject) => {
      axios({
        url: '/task_log.php',
        baseURL: config.base_url,
        method: 'get'
      }).then(function (response) {
          if (response.data.err == '') {
            commit('setItems', response.data.payload)
            resolve('OK')
          } else {
            reject(response.data.err ? response.data.err : '500 Ошибка обработки запроса на сервере.')
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  uploadResultFile({ commit }, file) {
    return new Promise((resolve, reject) => {
      axios({
        url: '/task_log.php',
        baseURL: config.base_url,
        headers: {'Content-Type': 'multipart/form-data'},
        method: 'post',
        data: file
      }).then(function (response) {
          if (response.data.err == '') {
            resolve('OK')
          } else {
            reject(response.data.err ? response.data.err : '500 Ошибка обработки запроса на сервере.')
          }
        })
        .catch(function (error) {
          reject(error)
        })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
