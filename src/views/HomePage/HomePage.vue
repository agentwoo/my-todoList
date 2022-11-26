<!-- 首页 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useTodoListStore, useUserStore, useMenusListStore } from '../../store/index'
import { delDialog, errMessage } from '../../utils/index'
import { useRouter } from 'vue-router'
const todoListStore = useTodoListStore()
const userStore = useUserStore()
const menusListStore = useMenusListStore()


const router = useRouter()

// 查询待办事项
const search = () => {
    let res = todoListStore.searchItem(todoListStore.searchVal)
    if (res === 0)
        return errMessage('输入不能为空')
    if (res === 1)
        return errMessage('没有该待办事项')
    todoListStore.searchRes = res
    router.push({ path: '/search' })
    todoListStore.searchVal = ''
}

// 个人中心
const UserInfo = () => {
    router.push({
        path: '/userInfo'
    })
}

// 退出登录
async function SignOut() {
    let res = await delDialog("确定退出登录", "提示")
    res ? router.push({ path: '/login' }) : undefined
}


const toMyOneDay = () => {
    router.push({
        path: '/myOneDay'
    })
}

const toAssignment = () => {
    router.push({
        path: '/assignment'
    })
}

const toSignificant = () => {
    router.push({
        path: '/significant'
    })
}

const toPlan = () => {
    router.push({
        path: '/plan'
    })
}


</script>

<template>
    <div class="homePage_container">
        <div class="homePage_aside">
            <!-- 头像 -->
            <div class="homePage_aside_user">
                <img :src="userStore.userImg" alt="用户">
                <!-- 下拉菜单 -->
                <el-dropdown style="margin-top:50px" size="large">
                    <span>
                        <el-icon class="el-icon--right">
                            <DCaret />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="UserInfo">个人中心</el-dropdown-item>
                            <el-dropdown-item @click="SignOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <!-- 查找输入框 -->
            <div class="homePage_aside_input">
                <el-input v-model="todoListStore.searchVal" placeholder="Search" @keyup.enter="search">
                    <template #suffix>
                        <el-icon class="el-input__icon" @click="search">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
            <!-- 菜单 -->
            <div class="homePage_aside_menu">
                <el-menu active-text-color="#ffd04b" background-color="#F2F2F2" default-active="1" text-color="black">
                    <el-menu-item index="1" class="menu_item" @click="toMyOneDay">
                        <div>
                            <el-icon>
                                <Sunny />
                            </el-icon>
                            我的一天
                        </div>
                        <el-badge :value="todoListStore.todayTodoListAndUnfinished$.length"
                            v-show="todoListStore.todayTodoListAndUnfinished$.length" class="item" type="info">
                        </el-badge>
                    </el-menu-item>
                    <el-menu-item index="2" class="menu_item" @click="toSignificant">
                        <div>
                            <el-icon>
                                <Star />
                            </el-icon>
                            重要
                        </div>
                        <el-badge :value="todoListStore.significantAndUnfinished$.length"
                            v-show="todoListStore.significantAndUnfinished$.length" class="item" type="info">
                        </el-badge>
                    </el-menu-item>
                    <el-menu-item index="3" class="menu_item" @click="toPlan">
                        <div>
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            计划内
                        </div>
                        <el-badge :value="todoListStore.PlanItemAndUnfinishe$.length"
                            v-show="todoListStore.PlanItemAndUnfinishe$.length" class="item" type="info">
                        </el-badge>
                    </el-menu-item>
                    <el-menu-item index="4" class="menu_item" @click="toAssignment">
                        <div>
                            <el-icon>
                                <Sunny />
                            </el-icon>
                            任务
                        </div>
                        <el-badge :value="todoListStore.unfinishedTodoList$.length"
                            v-show="todoListStore.unfinishedTodoList$.length" class="item" type="info">
                        </el-badge>
                    </el-menu-item>
                </el-menu>
            </div>



            <!-- 菜单栏测试 -->
            <!-- <div class="homePage_aside_menu">
                <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                    text-color="#fff" :unique-opened="true" :router="true">
                    <el-sub-menu :index="item.id + ''" v-for="item in menusListStore.getNewMenus" :key="item.id">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <el-menu-item :index="`${item.id}-${i.id}`" v-for="i in item.children" :key="i.id">
                            {{ i.title }}
                            <RouterLink to="/myOneDay" style="text-decoration:none;color: white;">{{ i.title }}
                            </RouterLink>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div> -->



        </div>
        <!-- 内容 -->
        <div class="homePage_content">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style lang='scss' scoped>
body {
    color: #F2F2F2;
}

.homePage_container {
    height: 100%;

    .homePage_aside {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        background-color: #F2F2F2;
        padding-left: 20px;
        padding: 10px;

        div {
            margin-bottom: 10px;
        }

        &_user {
            img {
                height: 60px;
                border-radius: 50%;
            }
        }

        &_input {
            :deep(.el-input) {
                width: 90%;
                border-bottom: 1px solid gray;
                border-radius: 5.5%;
            }
        }

        &_menu {
            height: 80%;
            overflow: hidden;
            // overflow: scroll;

            :deep(.el-menu) {
                border: none;
            }

            .menu_item {
                display: flex;
                justify-content: space-between;

                .item {
                    margin-top: -12%;
                }
            }
        }
    }

    .homePage_content {
        position: absolute;
        top: 0;
        left: 320px;
        bottom: 0;
        right: 0;
        background-image: url('../../assets/bgmImg.webp');
        overflow: hidden;
        border-radius: 20px 0 0 0;
    }
}
</style>