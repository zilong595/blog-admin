import request from '@/utils/request';

export const getColumnList = (params) =>
request({
    url: '/Column/lists',
    method: 'get',
    params
})

export const createColumn = (data) =>
request({
    url: `/Column/create`,
    method: 'post',
    data
})

export const updateColumn = (data) =>
request({
    url: `/Column/update`,
    method: 'post',
    data
})

export const deleteColumn = (id) =>
request({
    url: `/Column/delete`,
    method: 'post',
    data: {
        id: id
    }
})

export const getCategoryList = (params) =>
request({
    url: `/Column_category/lists`,
    method: 'get',
    params
})