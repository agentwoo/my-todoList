<!-- 计划内 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useTodoListStore } from '../../store/index'
import ScrollBar from '../../components/scrollbar/index.vue'
import { getNowDate, errMessage, successMessage } from '../../utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const todoListStore = useTodoListStore()
const data = reactive({
    inputVal: '',
})

//添加
async function addItem() {
    let task_cate_id = router.currentRoute.value.path
    const res = await todoListStore.addItem(
        {
            user_id: window.G.user.user_id,
            task_cate_id: task_cate_id,
            task_name: data.inputVal,
            closing_date: getNowDate()
        })
    if (res.ok) {
        successMessage('添加成功！！')
    }
    data.inputVal = ''
}
</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">计划内</div>
        </div>
        <div class="tip" v-if="(todoListStore.plan$.haveDeadLineArr.length === 0)">
            <el-empty :image-size="250" description="暂无待办事项" />
        </div>
        <div v-else class="showList">
            <el-scrollbar>
                <span v-if="todoListStore.plan$.last.length">
                    先前:({{ todoListStore.plan$.last.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.last"></ScrollBar>
                </span>
                <span v-if="todoListStore.plan$.today.length">
                    今天:({{ todoListStore.plan$.today.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.today"></ScrollBar>
                </span>
                <span v-if="todoListStore.plan$.tomorrow.length">
                    明天:({{ todoListStore.plan$.tomorrow.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.tomorrow"></ScrollBar>
                </span>
                <span v-if="todoListStore.plan$.thisMonth.length">
                    {{ todoListStore.plan$.nearDeadLine }} 至: {{ todoListStore.plan$.firstDayOfNextMonthFormat }}
                    ({{ todoListStore.plan$.thisMonth.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.thisMonth"></ScrollBar>
                </span>
                <span v-if="todoListStore.plan$.future.length">
                    稍后:({{ todoListStore.plan$.future.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.plan$.future"></ScrollBar>
                </span>
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
        height: 10vh;
        margin-top: 10px;
        color: white;

        &_title {
            font-size: 35px;
            font-weight: 500;
        }
    }

    .tip {
        height: 80vh;
        display: flex;
        justify-content: center;
        font-weight: 900;

        :deep(.el-empty__description p) {
            color: white
        }
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