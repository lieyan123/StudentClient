import axios from '@/libs/api.request'

export const getUsersTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/user/GetUsers',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}

export const insertUser = (formData) => {
  return axios.request({
    url: 'api/user/insertUser',
    data: {
      formData
    },
    method: 'post'
  })
}

export const banUser = (id, state) => {
  return axios.request({
    url: 'api/user/banUser',
    data: {
      id,
      state
    },
    method: 'post'
  })
}
