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
        style="margin: 10px 10px;"
        type="primary"
        @click="Adduser"
      >添加新用户</Button>
    </Card>
    <Modal
      v-model="modal"
      title="添加非学生用户"
      draggable scrollable
      :loading="modalloading"
      @on-ok="ok"
      >
        <Form ref="formItem" :model="formItem" :rules="rule" :label-width="80">
        <FormItem label="姓名" prop="teacher_name">
            <Input type="text" v-model="formItem.teacher_name" placeholder="输入真实姓名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem label="工号" prop="teacher_num">
            <Input type="text" v-model="formItem.teacher_num" placeholder="教师工号为登陆账号">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem label="身份" prop="teacher_status">
            <Select v-model="formItem.teacher_status" placeholder="请选择用户身份">
                <Option value="讲师">讲师</Option>
                <Option value="工作人员">工作人员</Option>
                <Option value="主任">主任</Option>
                <Option value="教授">教授</Option>
            </Select>
        </FormItem>
        <FormItem label="权限角色" prop="role" >
            <Select v-model="formItem.role" placeholder="用户初始权限角色，非特殊情况勿选择学生，一般选择教师角色">
                <Option v-for="item in roleList" :value="item.role_id" :key="item.role_id">{{ item.role_name }}</Option>
            </Select>
        </FormItem>
        <FormItem label="隶属学院" prop="academy_id" >
            <Select v-model="formItem.academy_id" placeholder="请选择隶属学院">
                 <Option v-for="item in academyList" :value="item.academy_id" :key="item.academy_id">{{ item.academy_name }}</Option>
            </Select>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUsersTable, insertUser, banUser } from '@/api/handleUser'
import { getAcademysTable } from '@/api/handleAcademy'
import { getRolesTable } from '@/api/handleRole'
export default {
  inject: ['reload'],
  name: 'user_tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '用户id', key: 'user_id', sortable: true, fixed: 'left' },
        { title: '姓名', key: 'teacher_name', sortable: true },
        { title: '工号', key: 'teacher_num', sortable: true },
        { title: '密码', key: 'password', sortable: true },
        { title: '身份', key: 'teacher_status', sortable: true },
        { title: '权限角色', key: 'role_name', sortable: true },
        { title: '隶属学院', key: 'academy_name', sortable: true },
        { title: '账号状态', key: 'state', sortable: true },
        {
          title: '操作账号',
          key: 'name',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.state === '启用') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.banUser(params)
                      }
                    }
                  },
                  '禁用'
                )])
            } else if (params.row.state === '禁用') {
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
                        this.banUser(params)
                      }
                    }
                  },
                  '启用'
                )])
            }
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
      modalloading: true,
      academyList: [],
      roleList: [],
      formItem: {
        teacher_name: '',
        teacher_num: '',
        teacher_status: '',
        role: '',
        academy_id: ''
      },
      rule: {
        teacher_name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        teacher_num: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        teacher_status: [
          { required: true, trigger: 'blur' }
        ],
        role: [
          { required: true, trigger: 'blur' }
        ],
        academy_id: [
          { required: true, trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    banUser (params) {
      console.log(params)
      banUser(params.row.user_id, params.row.state).then(res => {
        this.$Message.info('操作成功')
        this.reload()
      })
    },
    handlePage (value) {
      this.pageNum = value
      this.sendData = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      getUsersTable(this.sendData).then(res => {
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
      getUsersTable(this.sendData).then(res => {
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
      getUsersTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    ok () {
      insertUser(this.formItem).then(res => {
        if (res.status === 200) {
          this.$Message.info('添加成功')
        } else {
          this.$Message.error('添加失败')
        }
        this.modal = false
        this.reload()
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    Adduser () {
      this.modal = true
      getAcademysTable({}).then(res => {
        this.academyList = res.data.tableData
      })
      getRolesTable({}).then(res => {
        this.roleList = res.data.tableData
      })
    }
  },
  mounted () {
    this.sendData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    getUsersTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
      this.loading = false
    })
  }
}
</script>
<style>
</style>
