<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <h4>详细信息</h4><br>

        <Row :gutter="10" class="expand-row">
            <Col span="2">
                <span class="expand-key">学生类型: </span>
                <span class="expand-value">{{ row.student_type }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">出生日期: </span>
                <span class="expand-value">{{ row.birthday }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">籍贯: </span>
                <span class="expand-value">{{ row.native_place }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">民族: </span>
                <span class="expand-value">{{ row.Ethnicity }}</span>
            </Col>
        </Row>
        <Row :gutter="10" class="expand-row">
            <Col span="2">
                <span class="expand-key">国籍: </span>
                <span class="expand-value">{{ row.nation }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">身份证号: </span>
                <span class="expand-value">{{ row.IDnumber}}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">政治面貌: </span>
                <span class="expand-value">{{ row.political_status}}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">学历: </span>
                <span class="expand-value">{{ row.education}}</span>
            </Col>
        </Row>
        <Row :gutter="10" class="expand-row">
            <Col span="2">
                <span class="expand-key">健康状况: </span>
                <span class="expand-value">{{ row.health_condition }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">家庭住址: </span>
                <span class="expand-value">{{ row.familyAddress }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">详细位置: </span>
                <span class="expand-value">{{ row.addressDetails }}</span>
            </Col>
            <Col span="2">
                <span class="expand-key">邮箱: </span>
                <span class="expand-value">{{ row.email }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}

</script>
