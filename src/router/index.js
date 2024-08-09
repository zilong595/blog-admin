import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutView from '@/layout/LayoutView.vue'

const routes = [
    {
        path: '/',
        component: LayoutView,
        redirect: '/console',
        children: [
            {
                path: 'console',
                name: 'ConsoleView',
                meta: { title: '首页' },
                component: () => import('@/views/console/ConsoleView.vue')
            }
        ]
    },
    {
        path: '/content',
        component: LayoutView,
        children: [
            {
                path: 'article',
                name: 'ArticleList',
                meta: { title: '文章列表' },
                component: () => import('@/views/article/ArticleList.vue'),
            },
            {
                path: 'message',
                name: 'MessagetList',
                meta: { title: '留言列表' },
                component: () => import('@/views/message/MessageList.vue'),
            }
        ]
    },
    {
        path: '/system',
        component: LayoutView,
        children: [
            {
                path: 'columnManagement',
                name: 'ColumnManagement',
                meta: { title: '栏目管理' },
                component: () => import('@/views/column/ColumnManagement.vue'),
            },
            {
                path: 'log',
                name: 'SystemLog',
                meta: { title: '系统日志' },
                component: () => import('@/views/system/SystemLog.vue'),
            }
        ]
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
