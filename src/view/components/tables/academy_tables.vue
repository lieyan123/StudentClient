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
    </Card>
    <Modal v-model="modal" title="修改学院信息" @on-ok="updateAcademy">
      <Form :model="formData"  >
        <FormItem label="学院">
          <Input v-model="formData.academy_name" placeholder="请输入学院名" />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="formData.state">
            <Option value="正常">正常</Option>
            <Option value="废弃">废弃</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAcademysTable , updateAcademy } from '@/api/handleAcademy'
export default {
  name: 'academy_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '院系id', key: 'academy_id', sortable: true, fixed: 'left' },
        { title: '院系名称', key: 'academy_name', sortable: true },
        { title: '创建时间', key: 'academy_createtime', sortable: true },
        { title: '状态', key: 'state', sortable: true },
        {
          title: '操作',
          key: 'name',
          width: 250,
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
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.showModal(params.row)
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
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                },
                '查看该院详细'
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
      modal: false,
      formData: {
        academy_name: '',
        state: ''
      }
    }
  },
  methods: {
    updateAcademy () {
      updateAcademy(this.formData).then(res => {
        this.$Message.success('操作成功')
      })
    },
    showModal (row) {
      this.formData.academy_name = row.academy_name
      this.formData.state = row.state
      console.log(row.state)
      this.modal = true
    },
    objDeepCopy (source) { // js对象深拷贝
      var sourceCopy = {}
      for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
      return sourceCopy
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getAcademysTable(this.sendData).then(res => {
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
      getAcademysTable(this.sendData).then(res => {
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
      getAcademysTable(this.sendData).then(res => {
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
    getAcademysTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
