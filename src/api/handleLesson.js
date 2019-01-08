import axios from '@/libs/api.request'

export const getLessonsTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/lesson/GetLessons',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}

export const addLesson = (formData) => {
  return axios.request({
    url: 'api/lesson/AddLesson',
    data: {
      formData
    },
    method: 'post'
  })
}

export const updateLesson = (formData) => {
  return axios.request({
    url: 'api/lesson/UpdateLesson',
    data: {
      formData
    },
    method: 'post'
  })
}
