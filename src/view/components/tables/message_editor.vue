<template>
  <div>

    <Form ref="" :model="formData" :rules="rule" >
      <FormItem label="标题" prop='title'>
        <Input v-model="formData.title" placeholder="在此输入消息标题" size="large" clearable style="width: 200px"></Input>
      </FormItem>
      <label for="">内容</label>
      <FormItem >
        <editor ref="editor" :value="formData.content" @on-change="handleChange"/>
        </FormItem>
        <Button @click="saveContent" type='primary'>保存编辑器内容</Button>
    </Form>
    <br>
    <Row>
      <Col span ='10'>
      <Table :columns="column" :data="draftTable" style='width:500px;'></Table>
      </Col>
      <Col span="4">

      </Col>
      <Col span ='10'>
      <Card>
        <p slot="title">发送信息</p>
        <Checkbox v-model="checked1" @on-change="check1">
          <span>发送给所有老师</span>
        </Checkbox>
        <Checkbox v-model="checked2" @on-change="check2">
          <span>发送给所有学生</span>
        </Checkbox>
        <br>
        <br>
        <Select v-model="select1" multiple :disabled='disabled1' filterable  placeholder="选择接受信息的老师">
        <Option v-for="item in teacherArr" :value="item.user_id" :key="item.user_id">{{ item.teacher_name }}</Option>
        </Select>
        <br><br>
        <Select v-model="select2" multiple :disabled='disabled2' filterable  placeholder="选择接受的学生">
        <Option v-for="item in studentArr" :value="item.user_id" :key="item.user_id">{{ item.student_name }}</Option>
        </Select>
        <Button @click="sendMessage" type='warning' style="margin:auto;">确认发送信息</Button>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Editor from '_c/editor'
import { saveDraft, getDrafts, deleteDraft, sendMessage } from '@/api/user'
import { getUsersTable } from '@/api/handleUser'
import { getStudentsTable } from '@/api/handleStudent'
export default {
  name: 'editor_page',
  inject: ['reload'],
  components: {
    Editor
  },
  data () {
    return {
      disabled1: true,
      disabled2: true,
      checked1: true,
      checked2: true,
      select1: [],
      select2: [],
      teacherArr: [],
      studentArr: [],
      column: [
        { title: '标题', key: 'title', sortable: true, fixed: 'left' },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.pushDraft(params.row)
                    }
                  }
                },
                '草稿插入'
              ),
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
                      this.deleteDraft(params.row)
                    }
                  }
                },
                '删除草稿'
              )
            ])
          }
        }
      ],
      draftTable: [],
      formData: {
        content: '在此写消息内容，会自动转为HTML格式',
        title: '无题',
        draft_id: ''
      },
      rule: {
        title: [
          { required: true, message: '标题不为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendMessage () {
      if (this.checked1 === true && this.checked2 === true) { // 全选教师与全选学生
        const teacherArr = []
        const studentArr = []
        this.teacherArr.forEach(element => {
          teacherArr.push(element.user_id)
        })
        this.studentArr.forEach(element => {
          studentArr.push(element.user_id)
        })
        sendMessage(teacherArr, studentArr, this.formData.title, this.formData.content).then(res => {
          this.$Message.success('消息发送成功')
          this.reload()
        })
      } else if (this.checked1 === true) { // 全选教师与自选学生
        const teacherArr = []
        this.teacherArr.forEach(element => {
          teacherArr.push(element.user_id)
        })
        sendMessage(teacherArr, this.select2, this.formData.title, this.formData.content).then(res => {
          this.$Message.success('消息发送成功')
          this.reload()
        })
      } else if (this.checked2 === true) { // 全选学生和自选教师
        const studentArr = []
        this.studentArr.forEach(element => {
          studentArr.push(element.user_id)
        })
        sendMessage(this.select1, studentArr, this.formData.title, this.formData.content).then(res => {
          this.$Message.success('消息发送成功')
          this.reload()
        })
      } else { // 自选教师与自选学生
        sendMessage(this.select1, this.select2, this.formData.title, this.formData.content).then(res => {
          this.$Message.success('消息发送成功')
          this.reload()
        })
      }
    },
    check1 (flag) {
      if (flag === true) {
        this.disabled1 = true
      } else {
        this.disabled1 = false
      }
    },
    check2 (flag) {
      if (flag === true) {
        this.disabled2 = true
      } else {
        this.disabled2 = false
      }
    },
    objDeepCopy (source) { // js对象深拷贝
      var sourceCopy = {}
      for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
      return sourceCopy
    },
    pushDraft (row) {
      const copy = this.objDeepCopy(row)
      this.formData.title = copy.title
      this.formData.content = copy.content
      this.formData.draft_id = copy.draft_id
      console.log(copy.content)
      this.$refs.editor.setHtml(`${copy.content}`)
    },
    deleteDraft (row) {
      deleteDraft(row.draft_id).then(res => {
        getDrafts().then(res => {
          this.draftTable = res.data.draftArr
          this.$Message.success('删除成功')
        })
      })
    },
    saveContent () {
      saveDraft(this.formData).then(res => {
        getDrafts().then(res => {
          this.draftTable = res.data.draftArr
          this.$Message.success('保存成功')
        })
      })
    },
    handleChange (html, text) {
      console.log(html, text)
      this.formData.content = html
    },
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    }
  },
  mounted () {
    getDrafts().then(res => {
      this.draftTable = res.data.draftArr
    })
    getUsersTable({}).then(res => {
      this.teacherArr = res.data.tableData
    })
    getStudentsTable({}).then(res => {
      this.studentArr = res.data.tableData
    })
  }
}
</script>

<style>

</style>
