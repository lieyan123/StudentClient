<template>
  <div>
    <Card>
      <tables
        ref="tables"
        search-place="top"
        v-model="tableData"
        :columns="columns"
      />
      <Page
        :total="pageTotal"
        :current="pageNum"
        :page-size="pageSize"
        show-sizer
        show-elevator
        show-total
        @on-change="handlePage"
        @on-page-size-change='handlePageSize'
      />
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportExcel"
      >导出为Csv文件</Button>
    </Card>
    <Drawer v-model="drawer" width='40%' placement="left" :closable="false">
      <h1 style="color:red;">Warnings:</h1>
      <p style="h2">1.若未给学生打分，默认成绩为0</p>
      <p style="h2">2.在表格内修改成绩后要点击下方的保存键，否则修改无效</p>
      <p style="h2">3.重新打开该抽屉即可刷新数据</p>
      <br>
      <tables
        ref="scoretables"
        editable
        search-place="top"
        v-model="scoreTableData"
        :columns="scoreColumns"
      />
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportscoreExcel"
      >导出为Csv文件</Button>
      <Button
        style="margin: 10px;"
        type="warning"
        @click="updateScore"
      >保存修改</Button>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTeacherClass } from '@/api/handleClass'
import { getLessonScore , updateScores } from '@/api/handleLesson'
export default {
  inject: ['reload'],
  name: 'class_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      scoreColumns: [
        { title: '学号', key: 'student_num', sortable: true },
        { title: '姓名', key: 'student_name', sortable: true },
        { title: '课程名', key: 'lesson_name', sortable: true },
        { title: '成绩', key: 'score', editable: true }
      ],
      columns: [
        { title: '班级名称', key: 'class_name', sortable: true },
        { title: '课程名', key: 'lesson_name', sortable: true },
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
                      this.showDrawer(params.row)
                    }
                  }
                },
                '管理学生成绩'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      sendData: {},
      loading: true,
      AddModal: false,
      UpdateModal: false,
      drawer: false,
      majorArr: [],
      scoreTableData: []
    }
  },
  methods: {
    updateScore () {
      updateScores(this.scoreTableData).then(res => {
        this.$Message.success('修改成功')
      })
    },
    showDrawer (row) {
      getLessonScore(row.class_id, row.lesson_id).then(res => {
        this.scoreTableData = res.data.tableData
        this.drawer = true
      })
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchValue: this.$store.state.user.userId
      }
      getTeacherClass(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    handlePageSize (value) {
      this.pageSize = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchValue: this.$store.state.user.userId
      }
      getTeacherClass(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    exportscoreExcel () {
      this.$refs.scoretables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    this.sendData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      searchValue: this.$store.state.user.userId
    }
    // console.log(this.$store.state.user)
    getTeacherClass(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
