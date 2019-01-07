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
        @click="showmodal"
      >新增专业信息</Button>
    </Card>
      <Modal v-model="modal" title="新增专业信息" @on-ok="addMajor">
    <Form :model="formData"  >
        <FormItem label="专业名">
          <Input v-model="formData.major_name" placeholder="请输入专业名" />
        </FormItem>
        <FormItem label="隶属学院">
          <Select v-model="formData.academy_id">
            <Option v-for="item in academyArr" :value="item.academy_id" :key="item.academy_id">{{item.academy_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建日期">
          <DatePicker type="date" v-model="formData.major_createtime" format="yyyy/MM/dd" placeholder="请选择创建日期" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
  </Modal>
    <Modal v-model="modal1" title="修改专业信息" @on-ok="updateMajor">
    <Form :model="formData1"  >
        <FormItem label="专业名">
          <Input v-model="formData1.major_name" placeholder="请输入专业名" />
        </FormItem>
        <FormItem label="隶属学院">
          <Select v-model="formData1.academy_id">
            <Option v-for="item in academyArr" :value="item.academy_id" :key="item.academy_id">{{item.academy_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="创建日期">
          <DatePicker type="date" v-model="formData1.major_createtime" format="yyyy/MM/dd" placeholder="请选择创建日期" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
  </Modal>
  <Drawer :closable="false" width="640" v-model="drawer">
       <p :style="pStyle">专业信息</p>
            <p :style="pStyle">基本信息</p>
            <div class="demo-drawer-profile">
                <Row>
                    <Col span="12">
                    <span class="expand-key">专业名: </span>
                        {{drawerItem.major_name}}
                    </Col>
                    <Col span="12">
                    <span class="expand-key">隶属学院: </span>
                        {{drawerItem.academy_name}}
                    </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <span class="expand-key">创建时间： </span>
                        {{drawerItem.major_createtime}}
                    </Col>
                </Row>
            </div>
            <Divider />
            <p :style="pStyle">麾下专业</p>
           <p class="demo-drawer-profile" v-for="item in drawerItem.classArr" :key="item.class_id">
             {{item.class_name}}
           </p>
        </Panel>
    </Collapse>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getMajorsTable, addMajor, updateMajor, getMajorClass } from '@/api/handleMajor'
import { getAcademysTable } from '@/api/handleAcademy'
export default {
  name: 'major_tables_page',
  inject: ['reload'],
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '专业id', key: 'major_id', sortable: true, fixed: 'left' },
        { title: '专业名称', key: 'major_name', sortable: true },
        { title: '创建时间', key: 'major_createtime', sortable: true },
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
                      this.showmodal1(params.row)
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
                      this.showDetails(params.row)
                    }
                  }
                },
                '查看明细'
              )
            ])
          }
        }
      ],
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px'
      },
      tableData: [],
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      sendData: {},
      loading: true,
      modal: false,
      modal1: false,
      academyArr: [],
      formData: {
        major_name: '',
        academy_id: '',
        major_createtime: ''
      },
      formData1: {
        major_id: '',
        major_name: '',
        academy_id: '',
        major_createtime: ''
      },
      drawer: false,
      drawerItem: {
        major_name: '',
        academy_name: '',
        major_createtime: '',
        classArr: []
      }
    }
  },
  methods: {
    showDetails (row) {
      getMajorClass(row.major_id).then(res => {
        this.drawerItem.major_name = row.major_name
        this.drawerItem.academy_name = row.academy_name
        this.drawerItem.major_createtime = row.major_createtime
        this.drawerItem.classArr = res.data.classArr
        this.drawer = true
      })
    },
    updateMajor () {
      updateMajor(this.formData1).then(res => {
        this.$Message.success('修改专业信息成功')
        this.reload()
      })
    },
    showmodal1 (row) {
      getAcademysTable({}).then(res => {
        this.formData1.major_id = row.major_id
        this.formData1.major_name = row.major_name
        this.formData1.academy_id = row.academy_id
        this.formData1.major_createtime = row.major_createtime
        this.modal1 = true
        this.academyArr = res.data.tableData
      })
    },
    addMajor () {
      addMajor(this.formData).then(res => {
        this.$Message.success('添加专业成功')
        this.reload()
      })
    },
    showmodal () {
      getAcademysTable({}).then(res => {
        this.modal = true
        this.academyArr = res.data.tableData
      })
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getMajorsTable(this.sendData).then(res => {
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
      getMajorsTable(this.sendData).then(res => {
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
      getMajorsTable(this.sendData).then(res => {
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
    getMajorsTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
.demo-drawer-profile{
        font-size: 14px;
    }
    .demo-drawer-profile .ivu-col{
        margin-bottom: 12px;
    }
</style>
