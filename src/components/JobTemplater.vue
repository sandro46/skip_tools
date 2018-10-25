<template>

  <div class="main_wrap">
    <!-- <button type="button" v-on:click='groupRows()' name="button">Test</button> -->
     <b-row >
        <b-col cols="2">
          <b-nav vertical >
            <b-nav-item @click='saveTpl()'>Сохранить шаблон</b-nav-item>
            <b-nav-item @click="modalLdTplShow(true)">Загрузить шаблон</b-nav-item>
            <b-nav-item @click="makeSql()">Сформировать SQL запрос</b-nav-item>
            <b-nav-item @click="setTask()">Поставить задачу</b-nav-item>
          </b-nav>
        </b-col>
        <b-col>
          <b-row v-for='(row, index) in form_rows' :key='index'>
            <b-col cols="3" v-for='(item, index) in row' :key='index'>
              <label class="mr-sm-2" :for='item.name'>{{item.label}}</label>
              <b-form-input v-if='item.type == "text"' type="text" v-model='item.value'  ></b-form-input>

              <b-form-group v-if='item.type == "checkBox"'  :label='item.text'>
                <b-form-checkbox-group stacked :id="item.name" :name="item.name" v-model="item.value">
                  <b-form-checkbox v-for='i in item.items' :key='i.value' :value='i.value' :id='item.name+i.text'>{{i.text}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>

              <b-form-select v-if='item.type == "select"'  v-model="item.value" >
                <option :value="null"></option>
                <option v-for='i in item.items' :key='i.value' :value="i.value">{{i.text}}</option>
              </b-form-select>

            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-modal ref="modalLdTpl" size="lg" hide-footer class="modal-big" title="Выберите шаблон для загрузки.">
        <div class="d-block text-center">
          <b-table
              :items="tpl_list"
              :fields="fields"
              small
              hover
          >
          <template slot="name" slot-scope="row">{{row.value}}</template>
          <template slot="created" slot-scope="row">{{row.value}}</template>
          <template slot="actions" slot-scope="row">
            <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
            <b-button-group size="sm">
              <b-button variant="success" @click='loadTpl(row.value)'>Открыть</b-button>
              <b-button variant="danger"  @click='delTpl(row.value)'>Удалить</b-button>
            </b-button-group>
          </template>
          </b-table>

        </div>
        <!-- <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn> -->
      </b-modal>
      <b-modal ref="modalSql" size="lg" hide-footer class="modal-big" title="Выберите шаблон для загрузки.">
        <div class="d-block text-left">
          <i>Количество найденных: {{ cur_cnt }}</i>
          <pre>{{ cur_sql }}</pre>
        </div>
      </b-modal>
  </div>

</template>

<script>
export default {
  name: 'Job-Templater',
  props: {
    msg: String
  },
  mounted: function () {
    // `this` указывает на экземпляр vm
    // console.log('Значение msg: ' + this.msg)
    this.$store.dispatch('loadContragent');
    this.$store.dispatch('loadTplList');
    this.groupRows()
    // this.$store.actions.
    // console.log(this.$store.getters.form);
  },
  data() {
    return {
      selected: [],
      form_rows: [],
      fields: [
        { key: 'name', label: 'Название'},
        { key: 'created', label: 'Дата создания'},
        { key: 'actions', label: 'Actions' }
      ],
    }
  },
  computed: {
    bank_id() {  return this.$store.getters.getItemByName('bank_id').value }
    ,template_name() {  return this.$store.getters.getItemByName('name').value }
    ,tpl_list() {   return this.$store.getters.getTplList }
    ,cur_sql() {   return this.$store.getters.getCurrentSql }
    ,cur_cnt() {   return this.$store.getters.getCurrentCnt }
  },
  methods: {
    setTask(){

      let required = this.$store.getters.getRequiredEmpty
      if(required.length > 0){
        let alertStr = []
        required.forEach((e, i) => { alertStr.push(e.label)} )
        alert('Параметры '+'"'+alertStr.join('" ,"')+'" обязательны!')
        return;
      }


      if(!window.confirm('Шаблон с существующим именем будет перезаписан. Вы уверены что хотите сохранить шаблон?')) return;
      let tplName = this.$store.getters.getCurrentName
      this.$store.dispatch('saveTpl', tplName).then(
        (resolve) => {
          this.$store.dispatch('loadTplList');
          this.$store.dispatch('setTask', tplName);
         },
        (reject) => { alert('Ошибка сохранения шаблона!'); console.log(reject); }
      );
    },
    makeSql(){
      this.$store.dispatch('makeSql').then(
        (resolve) => { this.$refs.modalSql.show(); console.log('makeSql '+resolve); },
        (reject) => { alert('Ошибка Формирования SQL запроса!'); console.log(reject); }
      );
    },
    delTpl(id){
      if(!window.confirm('Вы уверены, что хотите удалить шаблон?')) return;
      this.$store.dispatch('delTpl', id).then(
        (resolve) => { console.log('delTpl '+resolve); },
        (reject) => { alert('Ошибка Удаления шаблона!'); console.log(reject); }
      );
    },
    loadTpl(id){
      if(this.$store.dispatch('setCurrentTplById', id)){
        this.$refs.modalLdTpl.hide();
      } else {
        alert('Ошибка устаноки шаблона!')
      }
    },
    saveTpl(){

      let required = this.$store.getters.getRequiredEmpty
      if(required.length > 0){
        let alertStr = []
        required.forEach((e, i) => { alertStr.push(e.label)} )
        alert('Параметры '+'"'+alertStr.join('" ,"')+'" обязательны!')
        return;
      }

      if(!window.confirm('Шаблон с существующим именем будет перезаписан. Вы уверены что хотите сохранить шаблон?')) return;
      let tplName = this.$store.getters.getCurrentName
      this.$store.dispatch('saveTpl', tplName).then(
        (resolve) => { alert('Шаблон сохранён'); this.$store.dispatch('loadTplList'); console.log('saveTpl OK'); },
        (reject) => { alert('Ошибка сохранения шаблона!'); console.log(reject); }
      );
    },
    groupRows(){
      let rows = [];
      let row = [];
      this.$store.getters.form.forEach(function(e,i){
        if((i)%4 == 0){
          rows.push(row)
          row = []
        }
        row.push(e)
      })
      rows.push(row)
      this.form_rows = rows
    },
    modalLdTplShow(check){
      if(check) this.$refs.modalLdTpl.show()
      else this.$refs.modalLdTpl.hide()
    }
  },
  watch: {
    bank_id: function(bank_id){
      this.$store.dispatch('loadPortfolioList', {bank_id});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
