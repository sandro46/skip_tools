import axios from 'axios'
const config = require('./config.json')
const sources = [
    { text: 'HH', value: 26 },
    { text: 'VK', value: 32 },
    { text: 'ФССП', value: 39 },
    { text: 'GOOGLE', value: 37 },
    { text: 'БРС', value: 30 },
    { text: 'НБКИ', value: 10 },
  ];

const state = {
  items:  [
            {
              type: 'text',
              label: 'Имя шаблона:',
              name: 'name',
              placeHolder: '',
              required: 'true',
              value: ''
            },
            {
              type: 'checkBox',
              label: 'Источник:',
              name: 'source_id',
              items: sources,
              value: []
            },
            {
              type: 'checkBox',
              label: 'Не был на:',
              name: 'n_source_id',
              items: sources,
              value: []
            },
            {
              type: 'text',
              label: 'Более(дней):',
              name: 'n_days_older',
              placeHolder: '',
              value: ''
            },
            {
              type: 'text',
              label: 'Дата выхода больше чем (дней):',
              name: 'end_date_to',
              value: ''
            },
            {
              type: 'text',
              label: 'Сумма задол-ти от:',
              name: 'debt_sum_from',
              value: ''
            },
            {
              type: 'text',
              label: 'Должников не более:',
              name: 'num_persons_to',
              value: ''
            },
            {
              type: 'select',
              label: 'Контрагент:',
              name: 'bank_id',
              items: [],
              value: '',
              change: 'get_portfolio_list',
            },
            {
              type: 'select',
              label: 'Портфель:',
              name: 'portfolio_id',
              items: [],
              value: ''
            },
            {
              type: 'select',
              label: 'Приоритет:',
              name: 'prio',
              items: [
                {text:'Высший', value: 1},
                {text:'Почти высший', value: 2},
                {text:'Средний', value: 3},
                {text:'Почти низкий', value: 4},
                {text:'Низкий', value: 5},
              ],
              required: 'true',
              value: ''
            },
            {
              type: 'select',
              label: 'Тип поиска:',
              name: 'search_type',
              items: [
                {text:'ФИО+ДР', value: 'fio'},
                {text:'ФИ', value: 'fi'},
              ],
              required: 'true',
              value: ''
            },
            // {
            //   type: 'select',
            //   label: 'Повторять:',
            //   name: 'is_replay',
            //   items: [
            //     {text:'Да', value: 1},
            //   ],
            //   value: ''
            // },
            {
              type: 'checkBox',
              label: 'День недели:',
              name: 'weekday_id',
              items: [
                {text:'Каждый день', value: 8},
                {text:'Понедельник', value: 1},
                {text:'Вторник', value: 2},
                {text:'Среда', value: 3},
                {text:'Четверг', value: 4},
                {text:'Пятница', value: 5},
                {text:'Суббота', value: 6},
                {text:'Воскресенье', value: 7},
              ],
              value: []
            },
            {
              type: 'text',
              label: 'Время запуска:',
              name: 'time_start',
              placeHolder: '',
              value: ''
            }

          ],
    tpl_list: [],
    current_sql: '',
    current_cnt: '',

}

const getters = {
  form(state){
    return state.items
  }
  ,getItemByName: (state) => (name) => {
    return state.items.find(el => {return el.name == name} )
  }
  ,getRequiredEmpty: (state) => {
    return state.items.filter(el => {return el.required == 'true' && !el.value} )
  }
  ,getCurrentName: (state) => {
    return state.items.find(el => {return el.name == 'name'} ).value
  }
  ,getCurrentSql: (state) => { return  state.current_sql }
  ,getCurrentCnt: (state) => { return  state.current_cnt }
  ,getTplList: (state) => {
    let res = []
    state.tpl_list.forEach((el => {
      res.push({
        'name':el.name
        ,'created': el.created
        ,'actions': el.id
      })
    }))
    return res;
  }
}

const mutations = {
  setCurrentSql(state, sql){
    state.current_sql = sql;
  },
  setCurrentCnt(state, cnt){
    state.current_cnt = cnt;
  },
  delTpl(state, id){
    let idx = state.tpl_list.findIndex((el) => { return el.id == id; });
    state.tpl_list.splice(idx, 1);
  },
  set_bank_list(state, list){
    let idx = state.items.findIndex((el) => { return el.name == 'bank_id'; });
    state.items[idx].items = list;
  },
  set_portfolio_list(state, list){
    let idx = state.items.findIndex((el) => { return el.name == 'portfolio_id'; });
    state.items[idx].items = list;
  },
  setTplList(state, list){
    state.tpl_list = list;
  },
  setCurrentTplById(state, id){
    let tpl = state.tpl_list.find(el => {return el.id == id} );
    tpl.template.forEach(el => {
      state.items.forEach(el1 => {
        if(el1.name == el.name) {
          el1.value = el.value
        }
      })
    })
  }
}

const actions = {
  makeSql({state, commit}){
    return new Promise((resolve, reject) => {
      axios({
        url: '/template.php',
        baseURL: config.base_url,
        method: 'put',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {template: state.items}
      })
        .then(function (response) {
          // console.log(response.data);
          if (response.data.err == '') {
            commit('setCurrentSql', response.data.payload.sql);
            commit('setCurrentCnt', response.data.payload.cnt);
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
  delTpl({commit}, id){
    return new Promise((resolve, reject) => {
      axios({
        url: '/template.php',
        baseURL: config.base_url,
        method: 'delete',
        params: {id}
      })
        .then(function (response) {
          // console.log(response.data);
          if (response.data.err == '') {
            commit('delTpl', id);
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
  setTask({ commit }, tplName){
    // debugger;
    return new Promise((resolve, reject) => {
      axios({
        url: '/template.php',
        baseURL: config.base_url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'put',
        data: {tplName, cmd: 'set_task'}
      }).then(function (response) {
          if (response.data.err == '') {
            commit('set_new_task', response.data.payload)
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
  setCurrentTplById({commit}, id){
    try{
      commit('setCurrentTplById', id);
      return true;
    } catch(err){
      console.log(err);
      return false;
    }
  },
  loadTplList({commit}) {
    // if (!rootState.user.token) return
    return new Promise((resolve, reject) => {
      axios({
        url: '/template.php',
        baseURL: config.base_url,
        method: 'get',
      })
        .then(function (response) {
          // console.log(response.data);
          if (response.data.err == '') {
            commit('setTplList', response.data.payload);
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
  loadContragent ({commit}) {
    // if (!rootState.user.token) return
    return new Promise((resolve, reject) => {
      axios({
        url: '/get_data.php',
        baseURL: config.base_url,
        method: 'get',
        params: {cmd: 'bank_list'}
      })
        .then(function (response) {
          if (response.data.err == '') {
            commit('set_bank_list', response.data.payload)
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
  loadPortfolioList({commit}, payload) {
    return new Promise((resolve, reject) => {
      axios({
        url: '/get_data.php',
        baseURL: config.base_url,
        method: 'get',
        params: {cmd: 'portfolio_list', payload}
      }).then(function (response) {
          if (response.data.err == '') {
            commit('set_portfolio_list', response.data.payload)
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
  saveTpl({state}, tplName) {
    return new Promise((resolve, reject) => {
      axios({
        url: '/template.php',
        baseURL: config.base_url,
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {'items': state.items, tplName}
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
