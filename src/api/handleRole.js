import axios from '@/libs/api.request'

export const getRolesTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
  return axios.request({
    url: 'api/role/GetRoles',
    params: {
      pageNum,
      pageSize,
      searchKey,
      searchValue
    },
    method: 'get'
  })
}

export const getOneRoleAccess = (id) => {
  return axios.request({
    url: 'api/role/GetOneRoleAccess',
    data: {
      id
    },
    method: 'post'
  })
}

export const changeRoleAccess = (id, selectedArr) => {
  return axios.request({
    url: 'api/role/ChangeRoleAccess',
    data: {
      id,
      selectedArr
    },
    method: 'post'
  })
}
