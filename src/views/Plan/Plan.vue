<!-- 计划内 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useTodoListStore } from '../../store/index'
import ScrollBar from '../../components/scrollbar/index.vue'
import { getDate, getNowDate, errMessage, successMessage } from '../../utils'


const todoListStore = useTodoListStore()
// console.log(todoListStore.plan$);

const data = reactive({
    inputVal: '',
})

//添加
const addItem = () => {
    const result = todoListStore.addItem(data.inputVal, false, false, getNowDate(), '')
    result ? successMessage('添加成功') : errMessage('该代办事项已存在')
    data.inputVal = ''
}

</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">计划内</div>
        </div>
        <div class="tip"
            v-if="todoListStore.plan$.last.length === 0 && todoListStore.plan$.today.length == 0 &&
            todoListStore.plan$.tomorrow.length && todoListStore.plan$.thisMonth.length && todoListStore.plan$.future.length == 0">
            <el-empty :image-size="250" description="今日暂无待办事项" />
        </div>
        <div v-else class="showList">
            <el-scrollbar>
                <template v-if="todoListStore.plan$.last.length" class="lastColor">
                    先前:({{ todoListStore.plan$.last.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.last"></ScrollBar>
                </template>
                <template v-if="todoListStore.plan$.today.length">
                    今天:({{ todoListStore.plan$.today.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.today"></ScrollBar>
                </template>
                <template v-if="todoListStore.plan$.tomorrow.length">
                    明天:({{ todoListStore.plan$.tomorrow.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.tomorrow"></ScrollBar>
                </template>
                <template v-if="todoListStore.plan$.thisMonth.length">
                    {{ getDate() }}至:{{ todoListStore.plan$.firstDayOfNextMonthFormat }}
                    ({{ todoListStore.plan$.thisMonth.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.thisMonth"></ScrollBar>
                </template>
                <template v-if="todoListStore.plan$.future.length">
                    稍后:({{ todoListStore.plan$.future.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.future"></ScrollBar>
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