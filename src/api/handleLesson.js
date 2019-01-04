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