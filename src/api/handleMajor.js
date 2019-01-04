import axios from '@/libs/api.request'

export const getMajorsTable = ({ pageNum, pageSize, searchKey, searchValue }) => {
    return axios.request({
        url: 'api/major/GetMajors',
        params: {
            pageNum,
            pageSize,
            searchKey,
            searchValue
        },
        method: 'get'
    })
}