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
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getClassesTable } from '@/api/handleClass'
export default {
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
          width: 150,
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
                      this.show(params.index)
                    }
                  }
                },
                '详细信息'
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
                      this.remove(params.index)
                    }
                  }
                },
                '操作'
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
      loading: true
    }
  },
  methods: {
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
