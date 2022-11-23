import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/', component: () => import('../views/HomePage/HomePage.vue'),
        children: [
            { path: 'myOneDay', component: () => import('../views/MyOneDay/MyOneDay.vue') },
            { path: 'significant', component: () => import('../views/Significant/Significant.vue') },
            { path: 'userInfo', component: () => import('../views/UserInfo/UserInfo.vue') },
            { path: 'search', component: () => import('../views/SearchPage/SearchPage.vue') }
        ]
    },
    { path: '/todoList', component: () => import('../components/todoList/index.vue') },
    { path: '/login', component: () => import('../views/Login/Login.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router