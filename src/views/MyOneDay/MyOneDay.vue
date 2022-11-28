<!-- 任务 -->
<script lang='ts' setup>
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getDate, errMessage, successMessage } from '../../utils'
import { useTodoListStore } from '../../store/index'
import ScrollBar from '../../components/scrollbar/index.vue'

const data = reactive({
    inputVal: '',
})

const todoListStore = useTodoListStore()

//添加
const addItem = () => {
    const result = todoListStore.addItem(data.inputVal, false, true, '', '')
    result ? successMessage('添加成功') : errMessage('该代办事项已存在')
    data.inputVal = ''
}

</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">我的一天</div>
            <div>{{ getDate() }}</div>
        </div>
        <div class="tip" v-if="todoListStore.todayTodoListCount$ === 0">
            <el-empty :image-size="250" description="暂无待办任务" />
        </div>
        <!-- 展示列表 -->
        <div v-else class="showList">
            <el-scrollbar>
                <!-- 未完成事项 -->
                <ScrollBar :finishedOrunfinished="todoListStore.todayTodoListAndUnfinished$"></ScrollBar>
                <!-- 完成事项  -->
                <template v-if="todoListStore.todayTodoListAndFinished$.length !== 0">
                    已完成({{ todoListStore.todayTodoListAndFinished$.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.todayTodoListAndFinished$"></ScrollBar>
                </template>
            </el-scrollbar>
        </div>
        <!-- 输入框 -->
        <div class="addIput">
            <el-input v-model="data.inputVal" placeholder="添加任务" :prefix-icon="Plus" @keyup.enter="addItem" />
        </div>
    </div>
</template>

<style lang='scss' scoped>
.container {
    display: flex;
    flex-direction: column;
    margin-left: 40px;

    .header {
        height: 15vh;
        margin-top: 10px;
        color: white;

        &_title {
            font-size: 35px;
            font-weight: 500;
        }
    }

    .tip {
        height: 75vh;
        display: flex;
        justify-content: center;
        font-weight: 900;
    }

    .showList {
        height: 75vh;
        width: 90%;
    }

    .addIput {
        width: 95%;
        height: 10vh;
    }
}
</style>