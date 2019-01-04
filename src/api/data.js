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

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}
