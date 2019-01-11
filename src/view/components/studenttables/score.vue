<template>
<div>
  <Card>

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
      <h1>学分绩点</h1>
      <Row :gutter="24" class="expand-row">
        <Col span="12">
        大一绩点：{{ ((point[0]/10-5).toFixed(2))<=0?0:((point[0]/10-5).toFixed(2)) }}
        </col>
        <Col span="12">
        大二绩点：{{((point[1]/10-5).toFixed(2))<=0?0:((point[1]/10-5).toFixed(2))}}
        </col>
      </Row>
      <Row :gutter="24" class="expand-row">
        <Col span="12">
        大三绩点：{{((point[2]/10-5).toFixed(2))<=0?0:((point[2]/10-5).toFixed(2))}}
        </col>
        <Col span="12">
        大四绩点：{{((point[3]/10-5).toFixed(2))<=0?0:((point[3]/10-5).toFixed(2))}}
        </col>
      </Row>
      </Card>
      </div>
</template>
<script>
import Tables from '_c/tables'
import { getStudentScore } from '@/api/handleStudent'
export default {
  name: 'student_page',
  components: {
    Tables
  },
  data () {
    return {
      scorecolumns: [
        { title: '课程名', key: 'lesson_name', sortable: true },
        { title: '任课老师', key: 'teacher_name', sortable: true },
        { title: '课程学分', key: 'credit', sortable: true },
        { title: '成绩', key: 'score', sortable: true }
      ],
      scoretableData: [],
      point: []
    }
  },
  methods: {
    exportScoreExcel () {
      this.$refs.scoretables.exportCsv({
        filename: `ScoreTable-${new Date().valueOf()}.csv`
      })
    }
  },
  mounted () {
    getStudentScore(this.$store.state.user.userNum).then(res => {
      this.scoretableData = res.data.tableData
      this.point = res.data.point
    })
  }
}
</script>
<style>
.expand-row{
        margin-bottom: 40px;
    }
</style>
