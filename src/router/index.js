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
        ]
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
