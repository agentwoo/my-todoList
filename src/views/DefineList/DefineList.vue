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
        pid: ''
    }
})

watch(() => route.params, newVal => {
    menusStore.pid = newVal.pid as string
    const item = menusStore.listArr.find((v) => v.pid === newVal.pid)
    if (item) data.item = item
}, {
    immediate: true
})

const addItem = () => {
    const result = todoListStore.addItem(data.inputVal, false, false, '', data.item.pid, data.item.name)
    if (result === 0) {
        errMessage("输入不能为空！")
    } else {
        successMessage('添加成功！')
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
        color: white;
        font-size: 35px;
        font-weight: 500;
    }

    .showList {
        height: 80vh;
        width: 90%;
    }

    .addIput {
        width: 95%;
        height: 10vh;
    }
}
</style>