<template>
  <div>
    <Card>
      <tables
        ref="tables"
        search-place="top"
        v-model="tableData"
        :columns="columns"
      />
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportExcel"
      >导出为Csv文件</Button>
      <Button
        style="margin: 10px;"
        type="warning"
        @click="showModal"
      >为该班级所属专业新增一个课程</Button>
      <Modal
      v-model="AddModal"
      title="为该班级所属专业新增一个课程"
      @on-ok="addClassLesson"
      >
          <Select v-model="team" >
            <Option value="大一上学期">大一上学期</Option>
            <Option value="大一下学期">大一下学期</Option>
            <Option value="大二上学期">大二上学期</Option>
            <Option value="大二下学期">大二下学期</Option>
            <Option value="大三上学期">大三上学期</Option>
            <Option value="大三下学期">大三下学期</Option>
            <Option value="大四上学期">大四上学期</Option>
            <Option value="大四下学期">大四下学期</Option>
          </Select>
          <Select v-model="lesson_id" filterable>
            <Option v-for="item in lessonArr" :value="item.lesson_id" :key="item.lesson_id">{{item.lesson_name}}</Option>
          </Select>
    </Modal>
    </Card>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getClassLessons, getLessonsTable, addClassLesson, deleteClassLesson } from '@/api/handleLesson'
export default {
  name: 'lesson_tables_page',
  inject: ['reload'],
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '课程id', key: 'lesson_id', sortable: true, fixed: 'left' },
        { title: '课程名称', key: 'lesson_name', sortable: true },
        { title: '学时', key: 'lesson_hours', sortable: true },
        { title: '课程类型', key: 'lesson_type', sortable: true },
        { title: '修读学期', key: 'team', sortable: true },
        {
          title: '操作',
          key: 'name',
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteClassLesson(params.row)
                    }
                  }
                },
                '删除隶属专业该门课程'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.row)
                    }
                  }
                },
                '查看班级该门成绩'
              )
            ])
          }
        }
      ],
      tableData: [],
      loading: true,
      AddModal: false,
      lesson_id: '',
      class_id: '',
      major_id: '',
      team: '',
      lessonArr: []
    }
  },
  methods: {
    addClassLesson () {
      addClassLesson(this.lesson_id, this.major_id, this.team).then(res => {
        this.reload()
      })
    },
    showModal () {
      getLessonsTable({}).then(res => {
        this.lessonArr = res.data.tableData
        this.AddModal = true
      })
    },
    deleteClassLesson (row) {
      deleteClassLesson(row.lesson_id, this.major_id).then(res => {
        this.reload()
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    this.class_id = this.$route.params.class_id
    this.major_id = this.$route.params.major_id
    getClassLessons(this.class_id).then(res => {
      this.tableData = res.data.tableData
      this.loading = false
    })
  }
}
</script>
<style>
</style>
