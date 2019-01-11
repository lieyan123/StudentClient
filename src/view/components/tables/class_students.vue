<template>
  <div>
    <Card>
      <h1>{{tableData[0].class_name}}</h1>
      <tables
        ref="tables"
        border
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
      />
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportExcel"
      >导出为Csv文件</Button>
    </Card>
    <br>
    <Drawer v-model="drawer" width="450px">
      <h1>{{name}}</h1>
      <Divider />
      <tables
        ref="scoretables"
        border
        search-place="top"
        v-model="scoretableData"
        :columns="scorecolumns"
      />
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportScoreExcel"
      >导出成绩excel</Button>
      <Divider />
      <h1>学分绩点</h1>
      <Row>
        <col>
        大一绩点：{{ ((point[0]/10).toFixed(2)-5)<=0?0:((point[0]/10).toFixed(2)-5) }}
        </col>
        <col>
        大二绩点：{{((point[1]/10).toFixed(2)-5)<=0?0:((point[1]/10).toFixed(2)-5)}}
        </col>
      </Row>
      <Row>
        <col>
        大三绩点：{{((point[2]/10).toFixed(2)-5)<=0?0:((point[2]/10).toFixed(2)-5)}}
        </col>
        <col>
        大四绩点：{{((point[3]/10).toFixed(2)-5)<=0?0:((point[3]/10).toFixed(2)-5)}}
        </col>
      </Row>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getClassStudents, getStudentScore } from '@/api/handleStudent'
import { banUser } from '@/api/handleUser'
import expandRow from '../tables-expand/student_table-expand.vue'

export default {
  inject: ['reload'],
  name: 'student_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      scorecolumns: [
        { title: '课程名', key: 'lesson_name', width: 150, sortable: true },
        { title: '课程学分', key: 'credit', width: 150, sortable: true },
        { title: '成绩', key: 'score', width: 150, sortable: true }
      ],
      columns: [
        {
          type: 'expand',
          fixed: 'left',
          width: 99,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        { title: '姓名', key: 'student_name', width: 100, sortable: true, fixed: 'left' },
        { title: '学号', key: 'student_num', width: 120, sortable: true },
        { title: '密码', key: 'password', width: 100, sortable: true },
        { title: '性别', key: 'sex', width: 100, sortable: true },
        { title: '电话', key: 'phone', width: 100, sortable: true },
        { title: '学生类别', key: 'student_type', width: 100, sortable: true },
        { title: '班级姓名', key: 'class_name', width: 300, sortable: true },
        { title: '班级id', key: 'class_id', width: 100, sortable: true },
        { title: '出生日期', key: 'birthday', width: 100, sortable: true },
        { title: '籍贯', key: 'native_place', width: 250, sortable: true },
        { title: '民族', key: 'Ethnicity', width: 100, sortable: true },
        { title: '国籍', key: 'nation', width: 100, sortable: true },
        { title: '身份证号', key: 'IDnumber', width: 200, sortable: true },
        { title: '政治面貌', key: 'political_status', width: 100, sortable: true },
        { title: '学历', key: 'education', width: 100, sortable: true },
        { title: '健康状况', key: 'health_condition', width: 100, sortable: true },
        { title: '家庭住址', key: 'familyAddress', width: 250, sortable: true },
        { title: '详细地址门牌号', key: 'addressDetails', width: 300, sortable: true },
        { title: '电子邮箱', key: 'email', width: 200, sortable: true },
        { title: '账号状态', key: 'state', width: 100, sortable: true },
        {
          title: '操作',
          key: 'name',
          width: 200,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                '查看成绩'
              )
            ])
          }
        }
      ],
      tableData: [],
      loading: true,
      drawer: false,
      scoretableData: [],
      point: [],
      name: ''
    }
  },
  methods: {
    cancel () {
      this.$Message.info('取消了操作')
    },
    objDeepCopy (source) { // js对象深拷贝
      var sourceCopy = {}
      for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
      return sourceCopy
    },
    showDrawer (row) {
      getStudentScore(row.student_num).then(res => {
        this.scoretableData = res.data.tableData
        this.point = res.data.point
        this.name = row.student_name
        console.log(this.point)
        this.drawer = true
      })
    },
    banUser (params) {
      console.log(params)
      banUser(params.row.user_id, params.row.state).then(res => {
        this.$Message.info('操作成功')
        this.reload()
      })
    },
    exportExcel () {
      let newData = JSON.parse(JSON.stringify(this.tableData))
      this.$refs.tables.exportCsv({
        filename: `StudentTable-${new Date().valueOf()}.csv`,
        original: false,
        columns: this.columns.filter((col, index) => index > 0 && index < 21),
        data: newData.map(item => {
          item.phone = '="' + item.phone + '"'
          item.birthday = '="' + item.birthday + '"'
          item.student_num = '="' + item.student_num + '"'
          item.IDnumber = '="' + item.IDnumber + '"'
          return item
        })

      })
    },
    exportScoreExcel () {
      this.$refs.scoretables.exportCsv({
        filename: `ScoreTable-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    const class_id = this.$route.params.class_id
    getClassStudents(class_id).then(res => {
      this.tableData = res.data.tableData
      this.loading = false
    })
  }
  // created () {
  //   this.sendData.searchKey = this.$route.params.searchKey
  //   this.sendData.searchValue = this.$route.params.searchValue
  //   console.log(this.sendData.searchKey, this.sendData.searchValue)
  // }
}
</script>
<style>
.demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>
