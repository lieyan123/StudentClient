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
        style="margin: 10px;"
        type="warning"
        @click="showModal"
      >为该班级新增一个课程</Button>
      <Modal
      v-model="AddModal"
      title="为该班级所属专业新增一个课程"
      @on-ok="addClassLesson"
      >
          <label for="">学期</label>
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
          <label for="">课程</label>
          <Select v-model="lesson_id" filterable>
            <Option v-for="item in lessonArr" :value="item.lesson_id" :key="item.lesson_id">{{item.lesson_name}}</Option>
          </Select>
          <label for="">授课老师</label>
          <Select v-model="teacher_id" filterable>
            <Option v-for="item in teacherArr" :value="item.teacher_id" :key="item.teacher_id">{{item.teacher_name}}</Option>
          </Select>
    </Modal>
    <Modal
      :closable="false"
      v-model="tableModal"
      :title="lesson_name"
      >
      <Table :columns="scoreColumns" height='300' ref="scoretables" :data="scoreData"></Table>
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportExcel"
      >导出为Csv文件</Button>
    </Modal>
    </Card>
    </Card>
    <Card shadow>
      <h1>{{lesson_name}}</h1>
          <chart-pie style="height: 300px;" :value="pieData" text="挂科比例"></chart-pie>
          <p>{{lesson_name}}平均成绩为：{{avg}}</p>
        </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { ChartPie, ChartBar } from '_c/charts'
import { mapState } from 'vuex'
import { getUsersTable } from '@/api/handleUser'
import { getClassLessons, getLessonsTable, addClassLesson, deleteClassLesson, getLessonScore } from '@/api/handleLesson'
export default {
  name: 'lesson_tables_page',
  inject: ['reload'],
  components: {
    Tables,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      scoreColumns: [
        { title: '姓名', key: 'student_name', sortable: true, fixed: 'left' },
        { title: '成绩', key: 'score', sortable: true, fixed: 'left' }
      ],
      columns: [
        { title: '课程id', key: 'lesson_id', sortable: true, fixed: 'left' },
        { title: '课程名称', key: 'lesson_name', sortable: true },
        { title: '学时', key: 'lesson_hours', sortable: true },
        { title: '课程类型', key: 'lesson_type', sortable: true },
        { title: '修读学期', key: 'team', sortable: true },
        { title: '授课老师', key: 'teacher_name', sortable: true },
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
                '删除该门课程'
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
                      this.showDrawer(params.row)
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
      teacher_id: '',
      team: '',
      lessonArr: [],
      teacherArr: [],
      num: 1
    }
  },
  computed: {
    ...mapState({
      pieData: state => state.user.pieData,
      lesson_name: state => state.user.lesson_name,
      avg: state => state.user.avg,
      tableModal: state => state.user.tableModal,
      scoreData: state => state.user.scoreData
    })
  },
  methods: {
    showDrawer (row) {
      getLessonScore(this.class_id, row.lesson_id).then(res => {
        // this.avg = res.data.avg
        this.$store.commit('setAvg', res.data.avg)
        const pass = res.data.pass.length
        const down = res.data.down.length
        const pieData = []
        pieData.push({ value: pass, name: '通过' })
        pieData.push({ value: down, name: '挂科' })
        this.$store.commit('setPieData', pieData)
        this.$store.commit('setLesson_name', res.data.pass[0].lesson_name)
        this.$store.commit('setTableModal', true)
        this.$store.commit('setScoreData', res.data.tableData)
        this.reload()
      })
    },
    addClassLesson () {
      addClassLesson(this.lesson_id, this.class_id, this.team, this.teacher_id).then(res => {
        this.reload()
      })
    },
    showModal () {
      getLessonsTable({}).then(res => {
        this.lessonArr = res.data.tableData
        this.AddModal = true
      })
      getUsersTable({}).then(res => {
        this.teacherArr = res.data.tableData
      })
    },
    deleteClassLesson (row) {
      deleteClassLesson(row.lesson_id, this.class_id).then(res => {
        this.reload()
      })
    },
    exportExcel () {
      this.$refs.scoretables.exportCsv({
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
