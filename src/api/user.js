import axios from '@/libs/api.request'

export const login = ({ userName, password, status }) => {
  const data = {
    userName,
    password,
    status
  }
  return axios.request({
    url: 'api/login/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token, status) => {
  return axios.request({
    url: 'api/login/get_info',
    params: {
      token,
      status
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'api/login/logout',
    method: 'post'
  })
}

export const getUnreadCount = (userId) => {
  return axios.request({
    url: 'api/message/GetUnreadCount',
    params: {
      userId
    },
    method: 'get'
  })
}

export const getMessage = (userId) => {
  return axios.request({
    url: 'api/message/GetMessageList',
    params: {
      userId
    },
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'api/message/GetContent',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'api/message/setReaded',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'api/message/removeReaded',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'api/message/Restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const saveDraft = formData => {
  return axios.request({
    url: 'api/message/SaveDraft',
    method: 'post',
    data: {
      formData
    }
  })
}

export const deleteDraft = draft_id => {
  return axios.request({
    url: 'api/message/DeleteDraft',
    method: 'post',
    data: {
      draft_id
    }
  })
}

export const getDrafts = () => {
  return axios.request({
    url: 'api/message/GetDrafts',
    method: 'get'
  })
}

export const sendMessage = (teacherArr, studentArr, title, messageContext) => {
  return axios.request({
    url: 'api/message/SendMessage',
    data: {
      teacherArr,
      studentArr,
      title,
      messageContext
    },
    method: 'post'
  })
}
