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
      <modal  v-model="modal" title="权限详细信息" draggable scrollable :loading="modalloading" @on-ok="ok">
        <CheckboxGroup v-model="selectedArr" >
        <Checkbox v-for="item in accessArr" :label="item.access_id" :key="item.access_id">{{item.access_name}}</Checkbox>
    </CheckboxGroup>
      </modal>
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
import { getRolesTable, getOneRoleAccess, changeRoleAccess } from '@/api/handleRole'
export default {
  name: 'role_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '角色id', key: 'role_id', sortable: true, fixed: 'left' },
        { title: '角色名称', key: 'role_name', sortable: true },
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
                      this.showAccess(params)
                    }
                  }
                },
                '权限管理'
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
      modalloading: true,
      modal: false,
      accessArr: [],
      selectedArr: [],
      role_id: ''
    }
  },
  methods: {
    ok () {
      changeRoleAccess(this.role_id, this.selectedArr).then(res => {
        this.modal = false
        if (res.status === 200) {
          this.$Message.info('修改权限成功')
        }
      })
    },
    showAccess (params) {
      this.role_id = params.row.role_id
      getOneRoleAccess(params.row.role_id).then(res => {
        this.accessArr = res.data.accessArr
        this.selectedArr = res.data.selectedArr
        this.modal = true
      })
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getRolesTable(this.sendData).then(res => {
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
      getRolesTable(this.sendData).then(res => {
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
      getRolesTable(this.sendData).then(res => {
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
    getRolesTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
