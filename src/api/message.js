import request from '@/utils/request';

export const getMessageList = (params) =>
request({
    url: '/Message/lists',
    method: 'get',
    params
})

export const getMessageDetail = (id) =>
request({
    url: '/Message/detail',
    method: 'get',
    params: {
        id: id
    }
})

export const deleteMessage = (id) =>
request({
    url: `/Message/delete`,
    method: 'post',
    data: {
        id: id
    }
})

export const deleteAllMessage = (ids) =>
request({
    url: `/Message/deleteAll`,
    method: 'post',
    data: {
        ids: ids
    }
})