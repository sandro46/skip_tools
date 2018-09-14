<template>
  <div class="main_wrap">
    <h3>Лог задач</h3>
    <b-col>
      <b-table hover :items="items" :fields="t_fields">
        <template slot="actions" slot-scope="row">
          <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
          <b-button-group size="sm">
            <b-button v-if='row.item.file_id != 0' @click='openFileModal(row.item.pull_id)' variant="success">Файлы</b-button>
            <!-- <b-button variant="danger">Удалить</b-button> -->
          </b-button-group>
        </template>
      </b-table>
    </b-col>

    <b-modal ref="modalFileManager" size="lg" hide-footer class="modal-big" title="Выберите шаблон для загрузки.">
      <div class="d-block text-center">
        <b-row >
          <b-col>
            <b-form-select v-model="source_id" :options="source_id_options" class="mb-3"  />
          </b-col>
          <b-col>
            <b-form-file v-model="result_file" :state="Boolean(result_file)" @change="uploadResultFile" ref="result_file" placeholder="Файл с резуль-ом вн.скипа"></b-form-file>
          </b-col>
        </b-row>

        <b-table
            :items="current_files"
            :fields="file_fields"
            small
            hover
        >
          <template slot="actions" slot-scope="row">
            <b-button-group size="sm">
              <b-button variant="success" @click='openFile(row.item.name)'>Открыть</b-button>
            </b-button-group>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'Task-Manager',
    data() {
      return {
        source_id: null,
        pull_id: null,
        source_id_options: [
          { value: 0, text: 'Выбор источника' },
          { value: '10', text: 'НБКИ' },
          { value: '30', text: 'БРС' },
        ],
        result_file: null,
        t_fields: [
          { key: 'template', label: 'Шаблон' },
          { key: 'pull_id', label: 'pull_id' },
          { key: 'is_ok', label: 'Выполнен' },
          { key: 'start_dt', label: 'Дата начала' },
          { key: 'end_dt', label: 'Дата завершения' },
          { key: 'actions', label: 'Actions' }
        ],
        file_fields: [
          { key: 'source_id', label: 'Источник' },
          { key: 'name', label: 'Имя' },
          { key: 'created', label: 'Дата создания' },
          { key: 'actions', label: 'Actions' }
        ],
      }
    },
    computed: {
        items() { return this.$store.getters.items },
        current_files() {   return this.$store.getters.current_files }
    },
    mounted: function () {
      this.$store.dispatch('loadTaskList');
    },
    methods: {
      clearFileForm(){
        this.source_id = null;
        this.$refs.result_file.reset();
      },
      openFile(name){
        window.open('http://192.168.2.68:8080/xskip/?act=get_file&name='+name);
      },
      uploadResultFile(e){
        if(!this.source_id){
          alert('Не выбрано ни одного источника!');
          return;
        }

        let vue = this;
        let data = new FormData()
        data.append('file', e.target.files[0])
        data.append('source_id', this.source_id)
        data.append('pull_id', this.pull_id)

        this.$store.dispatch('uploadResultFile', data).then(
          (resolve) => {
            this.$store.dispatch('loadFileList', this.pull_id).then(
              (resolve) => {
                vue.clearFileForm();
              },
              (reject) => {
                alert('Ошибка загрузки файлов задачи.');
                console.log(reject);
              }
            )
          },
          (reject) => {
            alert('Ошибка загрузки файлов задачи.');
            console.log(reject);
          }
        )
      },
      openFileModal(pull_id){
        this.pull_id = pull_id;
        this.$store.dispatch('loadFileList', pull_id).then(
          (resolve) => {
            this.$refs.modalFileManager.show();
          },
          (reject) => {
            alert('Ошибка загрузки файлов задачи.');
            console.log(reject);
          }
        )
      }
    }
  }
</script>
