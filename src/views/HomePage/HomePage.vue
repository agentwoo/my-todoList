<!-- 首页 -->
<script lang='ts' setup>
import { reactive, toRefs, ref, watch, computed } from 'vue'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import { useTodoListStore, useUserStore, useMenusStore } from '../../store/index'
import { delDialog, errMessage, successMessage } from '../../utils/index'
import { useRouter } from 'vue-router'

const todoListStore = useTodoListStore()
const userStore = useUserStore()
const menusStore = useMenusStore()
const router = useRouter()

let color = ref<string>('')
watch(() => router.currentRoute.value.path, newVal => {
    switch (newVal) {
        case '/myOneDay':
            color.value = '#5C8ABB'
            break;
        case '/significant':
            color.value = '#EB897C'
            break;
        case '/plan':
            color.value = '#86C5BC'
            break;
        default:
            color.value = '#8BBFCC'
    }
}, {
    immediate: true
})

// 查询待办事项
const search = () => {
    let res = todoListStore.searchItem(todoListStore.searchVal)
    if (res === 0) return errMessage('输入不能为空')
    if (res === 1) {
        todoListStore.searchRes = []
        router.push({ path: '/search' })
        return errMessage('没有该待办事项')
    }

    todoListStore.searchRes = res
    router.push({ path: '/search' })
    successMessage('查询成功！')
    todoListStore.searchVal = ''
}

// 个人中心
const UserInfo = () => {
    router.push({
        path: '/userInfo'
    })
}

const menus = computed(() => {
    return [
        {
            path: '/myOneDay', icon: 'Sunny', title: '我的一天',
            store: todoListStore.todayTodoListAndUnfinished$.length
        },
        {
            path: '/significant', icon: 'Star', title: '重要',
            store: todoListStore.significantAndUnfinished$.length
        },
        {
            path: '/plan', icon: 'Tickets', title: '计划内',
            store: todoListStore.plan$.haveDeadLineArrAndUnFinishedCount
        },
        {
            path: '/assignment', icon: 'House', title: '任务',
            store: todoListStore.unfinishedTodoList$.length
        }
    ]
})

// 添加列表
const data = reactive({
    dialogFormVisible: false,
    form: {
        name: ''
    },
    dialogGroup: false,
    groupForm: {
        name: ''
    },
    dialogGroupTask: false,
    groupTaskForm: {
        name: ''
    }
})

const rules = reactive({
    name: [
        { required: true, message: '输入不能为空', trigger: 'blur' },
        { min: 1, max: 10, message: '输入不能超过10个字' }
    ]
})
// 新建列表
const addList = () => {
    data.dialogFormVisible = true
}
let formRef = ref()
async function confirmAddList() {
    const $form = formRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let res = await $api.dd.task_cate.add(
        {
            user_id: window.G.user.user_id,
            task_cate_pid: '',
            task_cate_name: data.form.name,
            task_cate_type: 1
        }
    )
    if (!res.ok) return
    useMenusStore().testMenus.push(res.data)

    data.dialogFormVisible = false
    data.form.name = ''
    successMessage('列表添加成功')
}

// 新建分组
const addGroup = () => {
    data.dialogGroup = true
}
let groupformRef = ref()
async function confirmAddGroup() {
    const $form = groupformRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let res = await $api.dd.task_cate.add(
        {
            user_id: window.G.user.user_id,
            task_cate_pid: '',
            task_cate_name: data.groupForm.name,
            task_cate_type: 0
        }
    )
    if (!res.ok) return
    useMenusStore().testMenus.push(res.data)

    data.dialogGroup = false
    data.groupForm.name = ''
    successMessage('分组添加成功')
}


// 分组内新建列表
const addGroupTask = (id: string) => {
    data.dialogGroupTask = true
    useMenusStore().taskCaseid = id
}
let groupTaskFormRef = ref()
async function confirmAddGroupTask() {
    const $form = groupTaskFormRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let res = await $api.dd.task_cate.add(
        {
            user_id: window.G.user.user_id,
            task_cate_pid: useMenusStore().taskCaseid,
            task_cate_name: data.groupTaskForm.name,
            task_cate_type: 0
        }
    )
    if (!res.ok) return
    useMenusStore().testMenus.push(res.data)

    data.dialogGroupTask = false
    data.groupTaskForm.name = ''
    successMessage('列表添加成功')
}


const toTaskList = (id: string) => {
    router.push({
        name: 'taskList',
        params: { id }
    })
}

// 删除自定义列表
async function delTask(taskCateId: string) {
    let delListTitle = menusStore.testMenus.find(v => v.task_cate_id === taskCateId)?.task_cate_name
    let res = await delDialog(`将永久删除"${delListTitle}"`, "删除列表")
    if (!res) return
    let result = await menusStore.delList(taskCateId)
    if (!result) return
    result.ok ? successMessage('列表删除成功') : errMessage('')
    router.push('/myOneDay')
}

// 删除列表分组
async function delTaskGroup(taskCateId: string) {
    let delListTitle = useMenusStore().testMenus.find(v => v.task_cate_id === taskCateId)?.task_cate_name
    let result = await delDialog(`将永久删除"${delListTitle}"`, "删除分组")
    if (!result) return

    let index = useMenusStore().testMenus.findIndex(v => v.task_cate_id === taskCateId)
    // 获取子列表
    let groupList = useMenusStore().testMenus.filter(v => v.task_cate_pid === taskCateId)
    if (groupList.length === 0) {
        let res = await $api.dd.task_cate.del({ user_id: window.G.user.user_id, task_cate_id: taskCateId })
        if (!res.ok) return
    } else {
        for (let i = groupList.length - 1; i > -1; i--) {
            await useMenusStore().delList(groupList[i].task_cate_id)
        }
        // 删除分组
        let res = await $api.dd.task_cate.del({ user_id: window.G.user.user_id, task_cate_id: taskCateId })
        if (!res.ok) return
    }
    useMenusStore().testMenus.splice(index, 1)
    router.replace({
        path: '/myOneDay'
    })
}

</script>

<template>
    <div class="homePage_container">
        <div class="homePage_aside">
            <!-- 头像 -->
            <div class="homePage_aside_user">
                <img :src="userStore.userInfo.head_img_url" alt="用户">
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
                            <el-dropdown-item @click=userStore.logout()>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <!-- 查找输入框 -->
            <div class="homePage_aside_input">
                <el-input v-model="todoListStore.searchVal" placeholder="搜索" @keyup.enter="search">
                    <template #suffix>
                        <el-icon class="el-input__icon" @click="search">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
            <!-- 菜单 -->
            <div class="homePage_aside_menu">
                <el-menu active-text-color="#2D89EF" background-color="#F2F2F2" text-color="black"
                    :default-active="router.currentRoute.value.path" router>
                    <el-menu-item :index="item.path" class="menu_item" v-for="item in menus">
                        <div>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </div>
                        <el-badge :value="item.store" v-show="item.store" class="item" type="info">
                        </el-badge>
                    </el-menu-item>
                </el-menu>
            </div>
            <!-- 自定义列表分组 -->
            <div class="defineList">
                <el-menu active-text-color="#2D89EF" background-color="#F2F2F2" text-color="black"
                    :default-active="router.currentRoute.value.params.id">
                    <el-menu-item :index="item.task_cate_id" v-for="item in useMenusStore().taskList()"
                        class="list_item" @click="toTaskList(item.task_cate_id)">
                        <div>
                            <el-icon>
                                <Box />
                            </el-icon>
                            <span style="margin-left:6px">{{ item.task_cate_name }}</span>
                        </div>
                        <div>
                            <el-button type="danger" :icon="Delete" @click="delTask(item.task_cate_id)" circle
                                class="delBtn" />
                            <el-badge type="info"
                                :value="useMenusStore().unfinishedTodo$.find(v => v.taskId === item.task_cate_id)?.num"
                                v-show="useMenusStore().unfinishedTodo$.find(v => v.taskId === item.task_cate_id)?.num !== 0"
                                class="list_item_item">
                            </el-badge>
                        </div>
                    </el-menu-item>
                </el-menu>

                <el-menu active-text-color="#2D89EF" background-color="#F2F2F2" class="el-menu-vertical-demo"
                    :default-active="router.currentRoute.value.params.id" text-color="black"
                    v-for="item in useMenusStore().getTaskCase$">
                    <el-sub-menu :index="item.task_cate_id">
                        <template #title>
                            <div class="list_item">
                                <div>
                                    <el-icon>
                                        <Memo />
                                    </el-icon>
                                    <span style="margin-left:6px">{{ item.task_cate_name }}</span>
                                </div>
                                <div>
                                    <el-button type="danger" text :icon="Plus" circle
                                        style="position: absolute;left: 210px;top:10px;"
                                        @click="addGroupTask(item.task_cate_id)" />
                                    <el-button type="danger" text :icon="Delete" circle
                                        style="position: absolute;left: 170px;top:10px;"
                                        @click="delTaskGroup(item.task_cate_id)" />
                                </div>
                            </div>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item :index="subMenu.task_cate_id" v-for="subMenu in item.children"
                                @click="toTaskList(subMenu.task_cate_id)">
                                <el-icon>
                                    <Box />
                                </el-icon>
                                <span style="margin-left:6px">{{ subMenu.task_cate_name }}</span>
                                <el-button type="danger" text :icon="Delete" circle
                                    style="position: absolute;left: 210px;top:10px;"
                                    @click="delTask(subMenu.task_cate_id)" />
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </div>
            <!-- 新建列表、分组 -->
            <div class="createListAndGroup">
                <div class="createList">
                    <el-button text @click="addList">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span style="position: relative; top: 2px;left: 5px; margin-right: 120px;">新建列表</span>
                    </el-button>
                </div>
                <div class="createGroup">
                    <el-button text @click="addGroup">
                        <el-icon size="20px">
                            <FolderAdd />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>
        <!-- 新建列表 -->
        <el-dialog v-model="data.dialogFormVisible" title="添加列表">
            <el-form :model="data.form" ref="formRef" :rules="rules">
                <el-form-item label="列表名称" label-width="100px" prop="name">
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
        <!-- 新建分组 -->
        <el-dialog v-model="data.dialogGroup" title="新建分组">
            <el-form :model="data.groupForm" ref="groupformRef" :rules="rules">
                <el-form-item label="分组名称" label-width="100px" prop="name">
                    <el-input v-model="data.groupForm.name" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.dialogGroup = false">取消</el-button>
                    <el-button type="primary" @click="confirmAddGroup">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 新建分组列表 -->
        <el-dialog v-model="data.dialogGroupTask" title="新建分组">
            <el-form :model="data.groupTaskForm" ref="groupTaskFormRef" :rules="rules">
                <el-form-item label="列表名称" label-width="100px" prop="name">
                    <el-input v-model="data.groupTaskForm.name" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="data.dialogGroupTask = false">取消</el-button>
                    <el-button type="primary" @click="confirmAddGroupTask">
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

        &_user {

            div {
                margin-bottom: 10px;
            }

            img {
                height: 60px;
                border-radius: 50%;
            }
        }

        &_input {
            :deep(.el-input) {
                width: 96%;
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

        .defineList {
            height: calc(100vh - 400px);
            overflow-y: scroll;

            :deep(.el-menu) {
                border: none;
            }

            :deep(.el-icon) {
                margin-right: 0;
            }

            .list_item {
                display: flex;
                justify-content: space-between;


                :deep(.el-button) {
                    width: 30px;
                    height: 30px;
                    margin-bottom: 11px;
                }

                &_item {
                    :deep(.el-badge__content) {
                        margin-bottom: 16px;
                    }
                }

                .delBtn {
                    margin-right: 14px;
                }
            }

        }

        .createListAndGroup {
            display: flex;

            div:nth-child(1) {
                :deep(.el-button) {
                    width: 230px;
                }
            }

            div:nth-child(2) {
                position: absolute;
                left: 250px;

                :deep(.el-button) {
                    width: 50px;
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
        background-color: v-bind(color);
        overflow: hidden;
        border-radius: 20px 0 0 0;
    }


}
</style>