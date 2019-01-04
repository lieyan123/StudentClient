import axios from '@/libs/api.request'

export const getAcademysTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/academy/GetAcademys',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}

export const updateAcademy = (formData) => {
  return axios.request({
    url: 'api/academy/UpdateAcademy',
    data: {
      formData
    },
    method: 'post'
  })
}
