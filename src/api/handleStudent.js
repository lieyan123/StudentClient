import axios from '@/libs/api.request'

export const getStudentsTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/student/GetStudents',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}

export const updateOneStudent = (formData) => {
  return axios.request({
    url: 'api/student/UpdateOneStudent',
    data: {
      formData
    },
    method: 'post'
  })
}

export const addStudentList = (tableData) => {
  return axios.request({
    url: 'api/student/AddStudentList',
    data: {
      tableData
    },
    method: 'post'
  })
}

export const updateStudentList = (tableData) => {
  return axios.request({
    url: 'api/student/UpdateStudentList',
    data: {
      tableData
    },
    method: 'post'
  })
}

export const getClassStudents = (class_id) => {
  return axios.request({
    url: 'api/student/GetClassStudents',
    params: {
      class_id
    },
    method: 'get'
  })
}
export const getStudentScore = (student_num) => {
  return axios.request({
    url: 'api/student/GetStudentScore',
    params: {
      student_num
    },
    method: 'get'
  })
}

export const getOneStudentMessage = (student_num) => {
  return axios.request({
    url: 'api/student/GetOneStudentMessage',
    params: {
      student_num
    },
    method: 'get'
  })
}
