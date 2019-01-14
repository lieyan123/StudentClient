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
    </Form>
    <Row>
      <Col span ='14'>
      <Table :columns="column" :data="draftTable" style='width:500px;'></Table>
      </Col>
      <Col span ='10'>
      <Button @click="saveContent" type='primary'>保存编辑器内容</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import Editor from '_c/editor'
import { saveDraft, getDrafts, deleteDraft } from '@/api/user'
export default {
  name: 'editor_page',
  components: {
    Editor
  },
  data () {
    return {
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
        title: '',
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
    pushDraft (row) {
      this.formData.title = row.title
      this.formData.content = row.content
      this.formData.draft_id = row.draft_id
      console.log(row)
    },
    deleteDraft (row) {
      deleteDraft(row.draft_id).then(res => {
        this.$Message.success('删除成功')
      })
    },
    saveContent () {
      saveDraft(this.formData).then(res => {
        this.$Message.success('保存成功')
      })
    },
    handleChange (html, text) {
      console.log(html, text)
    },
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    }
  },
  mounted () {
    getDrafts().then(res => {
      this.draftTable = res.data.draftArr
      console.log(this.draftTable)
    })
  }
}
</script>

<style>

</style>
