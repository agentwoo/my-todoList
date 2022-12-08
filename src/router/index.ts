import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/myOneDay' },
    {
        path: '/', component: () => import('../views/HomePage/HomePage.vue'),
        children: [
            { path: 'myOneDay', component: () => import('../views/MyOneDay/MyOneDay.vue') },
            { path: 'assignment', component: () => import('../views/Assignment/Assignment.vue') },
            { path: 'significant', component: () => import('../views/Significant/Significant.vue') },
            { path: 'plan', component: () => import('../views/Plan/Plan.vue') },
            { path: 'userInfo', component: () => import('../views/UserInfo/UserInfo.vue') },
            { path: 'search', component: () => import('../views/SearchPage/SearchPage.vue') },
            { path: 'list/:pid', name: 'List', component: () => import('../views/DefineList/DefineList.vue') }
        ]
    },
    { path: '/login', component: () => import('../views/Login/Login.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router