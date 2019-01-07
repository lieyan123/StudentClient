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
      <Button style="margin: 10px;" type="primary" @click="modal1 = true;">
        新增学院
        </Button>
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
    <Modal v-model="modal1" title="新增学院" @on-ok="addAcademy">
      <Form :model="formData1"  >
        <FormItem label="学院名">
          <Input v-model="formData1.academy_name" placeholder="请输入学院名" />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="formData1.state">
            <Option value="正常">正常</Option>
            <Option value="废弃">废弃</Option>
          </Select>
        </FormItem>
        <FormItem label="创建日期">
          <DatePicker type="date" v-model="formData1.academy_createtime" format="yyyy/MM/dd" placeholder="请选择创建日期" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Drawer :closable="false" width="640" v-model="drawer">
       <p :style="pStyle">学院信息</p>
            <p :style="pStyle">基本信息</p>
            <div class="demo-drawer-profile">
                <Row>
                    <Col span="12">
                    <span class="expand-key">学院名: </span>
                        {{drawerItem.academy_name}}
                    </Col>
                    <Col span="12">
                    <span class="expand-key">学院状态: </span>
                        {{drawerItem.state}}
                    </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <span class="expand-key">创建时间： </span>
                        {{drawerItem.academy_createtime}}
                    </Col>
                </Row>
                <Row>
                  <Col span="12" >
                  <span>院系管理员：</span>
                    <span class="expand-key" v-for="item in drawerItem.academy_managers" :key="item.teacher_name">
                         {{item.teacher_name}}
                         </span>
                    </Col>
                </Row>
            </div>
            <Divider />
            <p :style="pStyle">麾下专业</p>
              <Collapse accordion @on-change="searchClass">
          <Panel v-for="item in drawerItem.majors" :name="item.major_id+''" :key="item.major_name">
          {{item.major_name}}
           <p slot="content" v-for="item in classArr" :key="item.class_id">
             {{item.class_name}}
           </p>
        </Panel>
    </Collapse>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getAcademysTable, updateAcademy, getAcademyDetails, addAcademy } from '@/api/handleAcademy'
import { getMajorClass } from '@/api/handleMajor'
export default {
  name: 'academy_tables_page',
  inject: ['reload'],
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
                      this.showDrawer(params.row)
                    }
                  }
                },
                '查看该院详细'
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
      drawer: false,
      formData: {
        academy_name: '',
        state: '',
        academy_id: ''
      },
      formData1: {
        academy_name: '',
        state: '正常',
        academy_createtime: ''
      },
      drawerItem: {
        academy_name: '',
        academy_createtime: '',
        state: '',
        academy_managers: [],
        majors: []
      },
      classArr: []
    }
  },
  methods: {
    addAcademy () {
      addAcademy(this.formData1).then(res => {
        this.$Message.success('添加学院成功')
        this.reload()
      })
    },
    searchClass (key) {
      getMajorClass(key[0]).then(res => {
        this.classArr = res.data.classArr
      })
    },
    showDrawer (row) {
      this.drawerItem.academy_name = row.academy_name
      this.drawerItem.academy_createtime = row.academy_createtime
      this.drawerItem.state = row.state
      getAcademyDetails(row.academy_id).then(res => {
        this.drawerItem.academy_managers = res.data.managerArr
        this.drawerItem.majors = res.data.majorArr
        this.drawer = true
      })
    },
    updateAcademy () {
      updateAcademy(this.formData).then(res => {
        this.$Message.success('修改成功')
        this.reload()
      })
    },
    showModal (row) {
      this.formData.academy_name = row.academy_name
      this.formData.state = row.state
      this.formData.academy_id = row.academy_id
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
 .demo-drawer-profile{
        font-size: 14px;
    }
    .demo-drawer-profile .ivu-col{
        margin-bottom: 12px;
    }
</style>
