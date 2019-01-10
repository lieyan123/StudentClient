import axios from '@/libs/api.request'

export const getClassesTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/class/GetClasses',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}
export const getYearsTable = () => {
  return axios.request({
    url: 'api/class/GetYearsTable',
    params: {
    },
    method: 'get'
  })
}

export const addClass = (formData) => {
  return axios.request({
    url: 'api/class/AddClass',
    data: {
      formData
    },
    method: 'post'
  })
}

export const updateClass = (formData) => {
  return axios.request({
    url: 'api/class/UpdateClass',
    data: {
      formData
    },
    method: 'post'
  })
}

export const getTeacherClass = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/class/GetTeacherClass',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}
