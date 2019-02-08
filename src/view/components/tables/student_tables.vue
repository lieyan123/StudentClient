<template>
  <div>
    <Card>
      <tables
        ref="tables"
        height="400"
        border
        @SelectByData="handleSelectByData"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        :loading="loading"
      />
      <Row>

      <Page
        :total="pageTotal"
        :current="pageNum"
        :page-size="pageSize"
        :page-size-opts="sizeOption"
        show-sizer
        show-elevator
        show-total
        @on-change="handlePage"
        @on-page-size-change='handlePageSize'
      >
      </Page>
      </Row>
      <Button
        style="margin: 10px 0;"
        type="primary"
        @click="exportExcel"
      >导出为Csv文件</Button>
    </Card>
    <br>
    <Card>
      <Row :gutter="10">
    <i-col span="6">
        <Upload action="" :before-upload="beforeUpload">
          <Button icon="ios-cloud-upload-outline">上传Csv文件</Button>
        </Upload>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>此为批量添加/修改学生的功能,只允许上传Csv后缀的文件</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>批量增加为新增学生，批量修改为修改数据库里的学生数据</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>请严格按照文档的格式，否则会造成严重后果</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>上传学生Csv文件：点击上方按钮选择文件上传</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>Csv条目不要过大，避免导致系统崩溃</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>上传完成后可在右方表格核对信息</p>
        <p><Icon style="margin-right: 10px;" :size="10" type="md-heart"/>确认无误后点击“确定批量添加/修改学生”按钮</p>
        <Poptip
        confirm
        title="你确定要批量添加学生数据吗?"
        @on-ok="addStudentList"
        @on-cancel="cancel">
        <Button style="margin: 10px;" type="primary" >批量增加</Button>
    </Poptip>
        <Poptip
        confirm
        title="你确定要批量修改学生数据吗?"
        @on-ok="updateStudentList"
        @on-cancel="cancel">
        <Button style="margin: 10px;" type="primary" >批量修改</Button>
    </Poptip>
    </i-col>
    <i-col span="18">
      <Table :height="400" :columns="uploadcolumns" :data="uploadtableData"/>
    </i-col>
  </Row>
    </Card>
    <Drawer v-model="scoredrawer" width="500px">
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
      <h1>综合绩点</h1>
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
import { getStudentsTable, updateOneStudent, addStudentList, updateStudentList, getStudentScore } from '@/api/handleStudent'
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
                      this.showScoreDrawer(params.row)
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
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      sizeOption: [10, 20, 40, 100, 200],
      sendData: {
        pageNum: '',
        pageSize: '',
        searchKey: '',
        searchValue: ''
      },
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
      scoredrawer: false,
      scorecolumns: [
        { title: '课程名', key: 'lesson_name', width: 150, sortable: true },
        { title: '课程学分', key: 'credit', width: 150, sortable: true },
        { title: '成绩', key: 'score', width: 150, sortable: true }
      ],
      scoretableData: [],
      point: [],
      name: '',
      classList: []
    }
  },
  methods: {
    showScoreDrawer (row) {
      getStudentScore(row.student_num).then(res => {
        this.scoretableData = res.data.tableData
        this.point = res.data.point
        this.name = row.student_name
        this.scoredrawer = true
      })
    },
    cancel () {
      this.$Message.info('取消了操作')
    },
    addStudentList () {
      addStudentList(this.uploadtableData).then(res => {
        this.$Message.success('执行操作')
        this.reload()
      })
    },
    updateStudentList () {
      updateStudentList(this.uploadtableData).then(res => {
        this.$Message.success('执行操作')
        this.reload()
      })
    },
    beforeUpload (file) { // 上传cvs文件方法
      getArrayFromFile(file).then(data => {
        let { columns, tableData } = getTableDataFromArray(data)
        let arr = []
        arr = columns.map((item, index) => {
          item.width = 100 // 添加width属性
          return item
        })
        arr[0].fixed = 'left'
        this.uploadcolumns = arr
        this.uploadtableData = tableData
      }).catch(() => {
        this.$Notice.warning({
          title: '只能上传Csv文件',
          desc: '只能上传Csv文件，请重新上传'
        })
      })
      return false
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
    handlePage (value) {
      this.pageNum = value
      this.sendData.pageNum = this.pageNum
      this.sendData.pageSize = this.pageSize
      getStudentsTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
      })
    },
    handlePageSize (value) {
      this.pageSize = value
      this.sendData.pageNum = this.pageNum
      this.sendData.pageSize = this.pageSize
      getStudentsTable(this.sendData).then(res => {
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
      getStudentsTable(this.sendData).then(res => {
        this.tableData = res.data.tableData
        this.pageTotal = res.data.totalRecouds
        this.loading = false
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
    this.sendData.pageNum = this.pageNum
    this.sendData.pageSize = this.pageSize
    getStudentsTable(this.sendData).then(res => {
      this.tableData = res.data.tableData
      this.pageTotal = res.data.totalRecouds
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
