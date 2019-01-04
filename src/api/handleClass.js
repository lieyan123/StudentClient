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