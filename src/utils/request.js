import axios from 'axios'
import store  from "@/store"
import { ElMessage } from 'element-plus'

//let countRequest = 0;
//let loadingInstance;

//创建axios实例
const service = axios.create({
    baseURL: 'http://www.testblog.com/admin',
    timeout: 50000
})

//添加请求拦截器
service.interceptors.request.use(
    (config) => {
        /*
        if (!config.unLoading) {
            countRequest++;
        }
        loadingInstance = ElLoading.service();
        */

        //清空为空的参数
        if (config.params) {
            Object.keys(config.params).map((key) => {
                if (config.params[key] === '' || config.params[key] === null || config.params[key] === undefined) {
                    delete config.params[key];
                }
            })
        }
        return config;
    },
    (error) => {
        Promise.reject(error)
    }
);

//添加响应拦截器
service.interceptors.response.use(
    (response) => {
        /*
        if (!response.config.unLoading) {
            countRequest--;
        }

        if (countRequest === 0) {
            loadingInstance.close();
        }
        */

        const res = response.data;
        if (res.code !== 200) {
            ElMessage({
                message: res.msg || 'Error',
                type: 'error'
            })
            return Promise.reject(new Error(res.msg || '服务器繁忙，请稍后再试'))
        } else {
            return response.data
        }
    },
    (error) => {
        /*
        countRequest--;
        if (countRequest === 0) {
            loadingInstance.close();
        }
        */
        
        ElMessage({
            message: error.message,
            type: 'error'
        })
        return Promise.reject(new Error(error));
    }
)

export default service