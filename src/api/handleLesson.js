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

export const getClassLessons = (class_id) => {
  return axios.request({
    url: 'api/lesson/GetClassLessons',
    params: {
      class_id
    },
    method: 'get'
  })
}

export const addClassLesson = (lesson_id, class_id, team, teacher_id) => {
  return axios.request({
    url: 'api/lesson/AddClassLesson',
    data: {
      lesson_id,
      class_id,
      team,
      teacher_id
    },
    method: 'post'
  })
}

export const deleteClassLesson = (lesson_id, class_id) => {
  return axios.request({
    url: 'api/lesson/DeleteClassLesson',
    data: {
      lesson_id,
      class_id
    },
    method: 'post'
  })
}

export const getLessonScore = (class_id, lesson_id) => {
  return axios.request({
    url: 'api/lesson/GetLessonScore',
    params: {
      class_id,
      lesson_id
    },
    method: 'get'
  })
}

export const updateScores = (tableData) => {
  return axios.request({
    url: 'api/lesson/UpdateScores',
    data: {
      tableData
    },
    method: 'post'
  })
}
