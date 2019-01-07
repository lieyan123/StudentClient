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
        @click="showAddModal"
      >新增班级</Button>
    </Card>
    <Modal
      v-model="AddModal"
      title="新增一个班级"
      @on-ok="addClass"
      >
      <Form :model="AddformData"  >
        <FormItem label="班级名">
          <Input v-model="AddformData.class_name" placeholder="年份+班号 例：15（2）" />
        </FormItem>
        <FormItem label="隶属专业">
          <Select v-model="AddformData.major_id" filterable>
            <Option v-for="item in majorArr" :value="item.major_id" :key="item.major_id">{{item.major_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="学年制">
          <Select v-model="AddformData.year_id" filterable>
            <Option v-for="item in yearArr" :value="item.year_id" :key="item.year_id">{{item.year_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="入学日期">
          <DatePicker type="date" v-model="AddformData.Admission_time" format="yyyy-MM-dd" placeholder="入学日期请选择为9月1号" ></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="UpdateModal"
      title="修改班级信息"
      @on-ok="updateClass"
      >
      <Form :model="UpdateformData"  >
        <FormItem label="班级名">
          <Input v-model="UpdateformData.class_name" placeholder="年份+班号 例：15（2）" />
        </FormItem>
        <FormItem label="隶属专业">
          <Select v-model="UpdateformData.major_id" filterable>
            <Option v-for="item in majorArr" :value="item.major_id" :key="item.major_id">{{item.major_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="学年制">
          <Select v-model="UpdateformData.year_id" filterable>
            <Option v-for="item in yearArr" :value="item.year_id" :key="item.year_id">{{item.year_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="入学日期">
          <DatePicker type="date" v-model="UpdateformData.Admission_time" format="yyyy-MM-dd" placeholder="入学日期请选择为9月1号" ></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getClassesTable, getYearsTable, addClass, updateClass } from '@/api/handleClass'
import { getMajorsTable } from '@/api/handleMajor'
export default {
  inject: ['reload'],
  name: 'class_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '班级id', key: 'class_id', sortable: true, fixed: 'left' },
        { title: '班级名称', key: 'class_name', sortable: true },
        { title: '入学时间', key: 'Admission_time', sortable: true },
        { title: '学年制', key: 'year_name', sortable: true },
        { title: '隶属专业', key: 'major_name', sortable: true },
        { title: '隶属学院', key: 'academy_name', sortable: true },
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
                      this.searchStudent(params.index)
                    }
                  }
                },
                '查看学生'
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
                      // this.remove(params.index)
                    }
                  }
                },
                '查看课程'
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
        class_name: '',
        major_id: '',
        Admission_time: '',
        year_id: ''
      },
      majorArr: [],
      yearArr: [],
      UpdateformData: {
        class_id: '',
        class_name: '',
        major_id: '',
        Admission_time: '',
        year_id: ''
      }
    }
  },
  methods: {
    searchStudent (row) {
      this.$router.push({
        name: 'studentmessage_page',
        params: { searchKey: 'class_id', searchValue: row.class_id }
      })
    },
    updateClass () {
      updateClass(this.UpdateformData).then(res => {
        updateClass(this.UpdateformData).then(res => {
          this.$Message.success('添加成功')
          this.reload()
        })
      })
    },
    showUpdateModal (row) {
      this.UpdateformData = row
      getMajorsTable({}).then(res => {
        this.majorArr = res.data.tableData
      })
      getYearsTable().then(res => {
        this.yearArr = res.data.tableData
        this.UpdateModal = true
      })
    },
    addClass () {
      addClass(this.AddformData).then(res => {
        this.$Message.success('添加成功')
        this.reload()
      })
    },
    showAddModal () {
      getMajorsTable({}).then(res => {
        this.majorArr = res.data.tableData
      })
      getYearsTable().then(res => {
        this.yearArr = res.data.tableData
        this.AddModal = true
      })
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getClassesTable(this.sendData).then(res => {
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
      getClassesTable(this.sendData).then(res => {
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
      getClassesTable(this.sendData).then(res => {
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
    getClassesTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
