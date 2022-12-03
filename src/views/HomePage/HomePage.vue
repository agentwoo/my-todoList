<!-- 首页 -->
<script lang='ts' setup>
import { reactive, toRefs, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useTodoListStore, useUserStore, useMenusStore } from '../../store/index'
import { delDialog, errMessage, successMessage } from '../../utils/index'
import { useRouter } from 'vue-router'

const todoListStore = useTodoListStore()
const userStore = useUserStore()
const menusStore = useMenusStore()

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

const toFresh = () => {
    router.push({
        path: '/fresh'
    })
}

const toGoods = () => {
    router.push({
        path: '/goods'
    })
}




// 添加列表
const data = reactive({
    dialogFormVisible: false,
    form: {
        name: `无标题列表`
    }
})
const addList = () => {
    data.dialogFormVisible = true
}

let formRef = ref()
async function confirmAddList() {
    const $form = formRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let result = menusStore.addList(data.form.name)
    result ? successMessage('添加列表成功！') : errMessage('')
    data.form.name = `无标题列表${menusStore.defaultTip$}`
    data.dialogFormVisible = false
}


const toList = (pid: string) => {
    router.push({
        name: 'List',
        params: { pid }
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
                        <el-badge :value="todoListStore.plan$.haveDeadLineArrAndUnFinishedCount"
                            v-show="todoListStore.plan$.haveDeadLineArrAndUnFinishedCount" class="item" type="info">
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

            <div class="list">
                <el-menu active-text-color="#ffd04b" background-color="#F2F2F2" text-color="black">
                    <!-- <el-menu-item index="1" class="menu_item" @click="toFresh">
                        <div>
                            <el-icon>
                                <Box />
                            </el-icon>
                            入门
                        </div>
                    </el-menu-item>
                    <el-menu-item index="2" class="menu_item" @click="toGoods">
                        <div>
                            <el-icon>
                                <Notebook />
                            </el-icon>
                            杂货
                        </div>
                    </el-menu-item> -->


                    <el-menu-item :index="item.pid" v-for="item in menusStore.listArr" :key="item.pid"
                        @click="toList(item.pid)">
                        <div>
                            <el-icon>
                                <Box />
                            </el-icon>
                            {{ item.name }}
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>

            <!-- 添加列表 -->
            <div class=" createList">
                <el-menu active-text-color="black" background-color="#F2F2F2" text-color="black" @click="addList">
                    <el-menu-item index="1" class="menu_item">
                        <div>
                            <el-icon>
                                <Plus />
                            </el-icon>
                            新建列表
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
        <!-- 列表弹出框 -->
        <el-dialog v-model="data.dialogFormVisible" title="添加列表">
            <el-form :model="data.form" ref="formRef">
                <el-form-item label="列表名称" label-width="100px" prop="name"
                    :rules="{ required: true, message: '新建列表不能为空' }">
                    <el-input v-model="data.form.name" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmAddList">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
            border-bottom: 1px solid #DDDDDD;

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

        .list {
            height: calc(100vh - 440px);
            overflow-y: scroll;

            :deep(.el-menu) {
                border: none;
            }
        }

        .createList {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 300px;

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