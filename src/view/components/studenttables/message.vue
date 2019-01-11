<template>
  <div>
    <Card>
      <h1>个人信息</h1>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">姓名: </span>
                <span class="">{{ Student.student_name }}</span>
            </Col>
            <Col span="12">
                <span class="">学号: </span>
                <span class="">{{ Student.student_num }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">性别: </span>
                <span class="">{{ Student.sex }}</span>
            </Col>
            <Col span="12">
                <span class="">电话号码: </span>
                <span class="">{{ Student.phone }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">学生类型: </span>
                <span class="">{{ Student.student_type }}</span>
            </Col>
            <Col span="12">
                <span class="">出生日期: </span>
                <span class="">{{ Student.birthday }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">学生类型: </span>
                <span class="">{{ Student.student_type }}</span>
            </Col>
            <Col span="12">
                <span class="">出生日期: </span>
                <span class="">{{ Student.birthday }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">班级名称: </span>
                <span class="">{{ Student.student_type }}</span>
            </Col>
            <Col span="12">
                <span class="">籍贯: </span>
                <span class="">{{ Student.native_place }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">民族: </span>
                <span class="">{{ Student.Ethnicity }}</span>
            </Col>
            <Col span="12">
                <span class="">国籍: </span>
                <span class="">{{ Student.nation }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">身份证号: </span>
                <span class="">{{ Student.IDnumber }}</span>
            </Col>
            <Col span="12">
                <span class="">政治面貌: </span>
                <span class="">{{ Student.political_status }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">学历: </span>
                <span class="">{{ Student.education}}</span>
            </Col>
            <Col span="12">
                <span class="">健康状况: </span>
                <span class="">{{ Student.health_condition }}</span>
            </Col>
       </Row>
       <Row :gutter="24" class="expand-row">
         <Col span="12">
                <span class="">邮箱: </span>
                <span class="">{{ Student.email}}</span>
            </Col>
            <Col span="12">
                <span class="">家庭住址: </span>
                <span class="">{{ Student.familyAddress+'/'+Student.addressDetails }}</span>
            </Col>
       </Row>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getOneStudentMessage } from '@/api/handleStudent'
export default {
  name: 'student_page',
  components: {
    Tables
  },
  data () {
    return {
      Student: {}
    }
  },
  methods: {

  },
  mounted () {
    getOneStudentMessage(this.$store.state.user.userNum).then(res => {
      this.Student = res.data.tableData
    })
  }
}
</script>
<style>
.expand-row{
        margin-bottom: 40px;
    }
</style>
