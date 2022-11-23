<!-- 首页 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useTodoListStore } from '../../store/index'
import { delDialog, errMessage } from '../../utils/index'
import router from '../../router';

const todoListStore = useTodoListStore()


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


</script>

<template>
    <div class="homePage_container">
        <div class="homePage_aside">
            <!-- 头像 -->
            <div class="homePage_aside_user">
                <img src="../../assets/pig.jpeg" alt="用户">
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
                    <el-menu-item index="1">
                        <el-icon>
                            <Sunny />
                        </el-icon>
                        <!-- <span>我的一天</span> -->
                        <RouterLink to="/myOneDay" style="text-decoration:none;">我的一天</RouterLink>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <el-icon>
                            <Star />
                        </el-icon>
                        <!-- <span>重要</span> -->
                        <RouterLink to="/significant" style="text-decoration:none;">重要</RouterLink>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>计划内</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>已分配给我</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>任务</span>
                    </el-menu-item>
                </el-menu>
            </div>
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
            :deep(.el-menu) {
                border: none;
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