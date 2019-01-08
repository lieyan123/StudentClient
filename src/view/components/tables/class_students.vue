<template>
  <div>
    <Card>
      <tables
        ref="tables"
        height="400"
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
       <Drawer
            title="修改个人信息"
            v-model="drawer"
            width="800"
            :mask-closable="false"
            :styles="styles"
        >
        <Form :model="formData">
                <Row :gutter="32">
                    <Col span="6">
                        <FormItem label="姓名" label-position="top">
                            <Input v-model="formData.student_name" placeholder="请输入姓名" />
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="学号" label-position="top">
                            <Input v-model="formData.student_num" disabled placeholder="学号不可更改">
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="班级" label-position="top">
                            <Select v-model="formData.class_id" placeholder="请选择班级">
                                <Option v-for="item in classList" :value="item.class_id" :key="item.class_id">{{item.class_name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="性别" label-position="top">
                            <Select v-model="formData.sex" placeholder="请选择性别">
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="6">
                        <FormItem label="电话" label-position="top">
                            <Input v-model="formData.phone" placeholder="请输入电话号码" />
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="学生类型" label-position="top">
                            <Select v-model="formData.student_type" placeholder="请选择学生类型">
                                <Option value="本科生">本科生</Option>
                                <Option value="研究生">研究生</Option>
                                <Option value="博士生">博士生</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="出生日期" label-position="top">
                           <DatePicker v-model="formData.birthday" type="date" placeholder="请选择出生日期" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="6">
                        <FormItem label="籍贯" label-position="top">
                          <al-cascader v-model="formData.native_place"  searchable data-type="name" level="3"/>
                        </FormItem>
                    </Col>
                  </Row>
                <Row :gutter="32">
                    <Col span="6">
                        <FormItem label="民族" label-position="top">
                          <Input v-model="formData.Ethnicity" placeholder="例：汉" >
                          <span slot="append">族</span>
                          </input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="国籍" label-position="top">
                          <Input v-model="formData.nation" placeholder="例：中国" />
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="身份证号" label-position="top">
                          <Input v-model="formData.IDnumber" placeholder="请输入身份证号" />
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="政治面貌" label-position="top">
                          <Select v-model="formData.political_status">
                            <Option value="共青团员" >共青团员</Option>
                            <Option value="共产党员" >共产党员</Option>
                            <Option value="群众" >群众</Option>
                          </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                   <Col span="6">
                        <FormItem label="学历" label-position="top">
                           <Select v-model="formData.education">
                            <Option value="本科" >本科</Option>
                            <Option value="硕士研究生" >硕士研究生</Option>
                            <Option value="博士研究生" >博士研究生</Option>
                          </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="健康状况" label-position="top">
                          <Select v-model="formData.health_condition" placeholder="选择健康状况">
                            <Option value="良好" >良好</Option>
                            <Option value="正常" >正常</Option>
                            <Option value="较差" >较差</Option>
                          </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="家庭住址" label-position="top">
                          <al-cascader v-model="formData.native_place" size="small" searchable data-type="name" level="3"/>
                          <Input v-model="formData.addressDetails" placeholder="请输入详细门牌号" />
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="邮箱" label-position="top">
                          <Input v-model="formData.email" placeholder="请输入邮箱" />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="drawer = false">Cancel</Button>
                <Button type="primary" @click="updateOneStudent">Submit</Button>
            </div>
    </Drawer>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getClassStudents, updateOneStudent } from '@/api/handleStudent'
import { getClassesTable } from '@/api/handleClass'
import { banUser } from '@/api/handleUser'
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
import expandRow from '../tables-expand/student_table-expand.vue'

export default {
  inject: ['reload'],
  name: 'student_tables_page',
  components: {
    Tables
  },
  data () {
    return {
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
          title: '账户',
          key: 'name',
          width: 99,
          fixed: 'right',
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
        },
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
                '修改信息'
              ),
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
                      this.$router.push({
                        name: 'student_score_page',
                        params: { searchKey: 'student_id', searchValue: params.row.class_id }
                      })
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
      uploadcolumns: [],
      uploadtableData: [],
      loading: true,
      drawer: false,
      formData: {
        student_name: '',
        student_num: '',
        class_id: '',
        sex: '',
        phone: '',
        student_type: '',
        birthday: '',
        native_place: [],
        Ethnicity: '',
        nation: '',
        IDnumber: '',
        political_status: '',
        education: '',
        health_condition: '',
        familyAddress: [],
        addressDetails: '',
        email: ''
      },
      classList: []
    }
  },
  methods: {
    cancel () {
      this.$Message.info('取消了操作')
    },
    updateOneStudent () {
      updateOneStudent(this.formData).then(res => {
        this.$Message.info('修改成功')
        this.drawer = false
        this.reload()
      })
    },
    objDeepCopy (source) { // js对象深拷贝
      var sourceCopy = {}
      for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
      return sourceCopy
    },
    showDrawer (row) {
      getClassesTable({}).then(res => {
        this.classList = res.data.tableData
        this.formData = {}
        this.formData = this.objDeepCopy(row)
        this.formData.native_place = (this.formData.native_place || '').split('/')
        this.formData.familyAddress = (this.formData.familyAddress || '').split('/')
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
        columns: this.columns.filter((col, index) => index > 0 && index < 22),
        data: newData.map(item => {
          item.phone = '="' + item.phone + '"'
          item.birthday = '="' + item.birthday + '"'
          item.student_num = '="' + item.student_num + '"'
          item.IDnumber = '="' + item.IDnumber + '"'
          return item
        })

      })
    }
  },
  mounted () {
    const class_id = this.$route.params.class_id
    console.log(class_id)
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
