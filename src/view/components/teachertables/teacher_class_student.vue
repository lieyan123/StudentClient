<template>
  <div>
    <Card>
      <tables
        ref="tables"
        @SelectByData="handleSelectByData"
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
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
import { getLessonScore } from '@/api/handleLesson'
export default {
  inject: ['reload'],
  name: 'teacher_class_student_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '学号', key: 'student_num', sortable: true },
        { title: '姓名', key: 'student_name', sortable: true },
        { title: '课程名', key: 'lesson_name', sortable: true },
        { title: '成绩', key: 'score', editable: true }
      ],
      tableData: [],
      loading: true,
      class_id: '',
      lesson_id: ''
    }
  },
  methods: {

  },
  mounted () {
    this.class_id = this.$route.params.class_id
    this.lesson_id = this.$route.params.lesson_id
    getLessonScore(this.class_id, this.lesson_id).then(res => {
      this.tableData = res.data.tableData
      this.loading = false
    })
  }
}
</script>
<style>
</style>
