import request from '@/utils/request';

export const getArticleList = (params) =>
request({
    url: '/article/lists',
    method: 'get',
    params
})

export const getArticleDetail = (id) =>
request({
    url: '/article/detail',
    method: 'get',
    params: {
        id: id
    }
})

export const createArticle = (data) =>
request({
    url: `/article/create`,
    method: 'post',
    data
})

export const updateArticle = (data) =>
request({
    url: `/article/update`,
    method: 'post',
    data
})

export const deleteArticle = (id) =>
request({
    url: `/article/delete`,
    method: 'post',
    data: {
        id: id
    }
})

export const getCategoryList = (params) =>
request({
    url: `/article_category/lists`,
    method: 'get',
    params
})