<template>
  <div>
    <Card>
      <tables
        ref="tables"
        @SelectByData="handleSelectByData"
        editable
        searchable
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
      <Button
        style="margin: 10px;"
        type="primary"
        @click="AddModal=true"
      >新增课程</Button>
    </Card>
    <Modal
      v-model="AddModal"
      title="新增一个课程"
      @on-ok="addLesson"
      >
      <Form :model="AddformData"  >
        <FormItem label="课程名">
          <Input v-model="AddformData.lesson_name" placeholder="输入课程名" />
        </FormItem>
        <FormItem label="学时">
          <Input v-model="AddformData.lesson_hours" type="number" placeholder="输入学时" />
        </FormItem>
        <FormItem label="课程类型">
          <Select v-model="AddformData.lesson_type" filterable>
            <Option value="必修"></Option>
            <Option value="选修"></Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="UpdateModal"
      title="修改课程信息"
      @on-ok="updateLesson"
      >
      <Form :model="UpdateformData"  >
        <FormItem label="课程名">
          <Input v-model="UpdateformData.lesson_name" placeholder="输入课程名" />
        </FormItem>
        <FormItem label="学时">
          <Input v-model="UpdateformData.lesson_hours" type="number" placeholder="输入学时" />
        </FormItem>
         <FormItem label="课程类型">
          <Select v-model="UpdateformData.lesson_type">
            <Option value="必修">必修</Option>
            <Option value="选修">选修</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getLessonsTable, addLesson, updateLesson } from '@/api/handleLesson'
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
                      this.showUpdateModal(params.row)
                    }
                  }
                },
                '修改信息'
              ),
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
                      this.show(params.row)
                    }
                  }
                },
                '查看选择班级'
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
      AddformData: {
        lesson_name: '',
        lesson_hour: '32',
        lesson_type: ''
      },
      UpdateformData: {
        lesson_name: '',
        lesson_hour: '32',
        lesson_type: ''
      }
    }
  },
  methods: {
    updateLesson () {
      updateLesson(this.UpdateformData).then(res => {
        this.$Message.success('修改成功')
        this.reload()
      })
    },
    addLesson () {
      addLesson(this.AddformData).then(res => {
        this.$Message.success('添加成功')
        this.reload()
      })
    },
    showUpdateModal (row) {
      this.UpdateformData = row
      this.UpdateModal = true
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getLessonsTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    handlePageSize (value) {
      this.pageSize = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getLessonsTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    handleSelectByData (searchKey, searchValue) {
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey,
        searchValue
      }
      getLessonsTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    this.sendData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    getLessonsTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
