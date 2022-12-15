<!-- 自定义列表 -->
<script lang='ts' setup>
import { reactive, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { errMessage, successMessage } from '../../utils'
import { useTodoListStore, useMenusStore } from '../../store/index'
import scrollbar from '../../components/scrollbar/index.vue'
import { useRoute } from 'vue-router'

const todoListStore = useTodoListStore()
const menusStore = useMenusStore()
const route = useRoute()

const data = reactive({
    inputVal: '',
    item: {
        name: '',
        id: ''
    }
})

watch(() => route.params, newVal => {
    const item = menusStore.testMenus.find((v) => v.task_cate_id === newVal.id)
    if (item) {
        data.item.name = item.task_cate_name
        useMenusStore().paramsId = item.task_cate_id
        data.item.id = item.task_cate_id
    }
}, {
    immediate: true
})

async function addItem() {
    const res = await todoListStore.addItem(
        {
            user_id: window.G.user.user_id,
            task_cate_id: data.item.id,
            task_name: data.inputVal
        })
    if (res.ok) {
        successMessage('添加成功！！')
    }
    data.inputVal = ''
}
</script>

<template>
    <div class="container">
        <div class="title">{{ data.item.name }}</div>
        <el-scrollbar class="showList">
            <scrollbar :finishedOrunfinished="menusStore.defineListTodo$"></scrollbar>
            <template v-if="(menusStore.defineListTodoAndUndefinish$.length !== 0)">
                <div>已完成({{ menusStore.defineListTodoAndUndefinish$.length }})</div>
                <scrollbar :finishedOrunfinished="menusStore.defineListTodoAndUndefinish$"></scrollbar>
            </template>
        </el-scrollbar>
        <div class="addIput">
            <el-input v-model="data.inputVal" placeholder="添加任务" :prefix-icon="Plus" @keyup.enter="addItem" />
        </div>
    </div>
</template>

<style lang='scss' scoped>
.container {
    margin-left: 40px;

    .title {
        height: 10vh;
        margin-top: 10px;
        color: white;
        font-size: 35px;
        font-weight: 500;
    }

    .showList {
        height: 80vh;
        width: 94%;
    }

    .addIput {
        width: 95%;
        height: 10vh;
    }
}
</style>