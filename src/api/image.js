import request from '@/utils/request';

export const getImageList = (params) =>
request({
	url: '/image/lists',
	method: 'get',
	params
})

export const deleteImage = (ids) =>
request({
	url: `/image/deleteImage`,
	method: 'post',
	data: {
		id: ids
	}
})

export const uploadImage = (data) =>
request({
	url: `/image/uploadImage`,
	method: 'post',
	data
})