<!-- 任务 -->
<script lang='ts' setup>
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { errMessage, successMessage } from '../../utils'
import { useTodoListStore } from '../../store/index'
import { useRouter } from 'vue-router'
import ScrollBar from '../../components/scrollbar/index.vue'

const data = reactive({
    inputVal: '',
})
const router = useRouter()

const todoListStore = useTodoListStore()

//添加
async function addItem() {
    let task_cate_id = router.currentRoute.value.path
    const result = await todoListStore.addItem({
        user_id: window.G.user.user_id,
        task_cate_id: task_cate_id,
        task_name: data.inputVal
    })
    if (result.ok) {
        successMessage('添加成功！！')
    }
    data.inputVal = ''
}

</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">任务</div>
        </div>
        <div class="tip" v-if="todoListStore.todoListCount$ === 0">
            <el-empty :image-size="250" description="暂无待办任务" />
        </div>
        <!-- 展示列表 -->
        <div v-else class="showList">
            <el-scrollbar>
                <!-- 未完成事项 -->
                <ScrollBar :finishedOrunfinished="todoListStore.unfinishedTodoList$"></ScrollBar>
                <!-- 完成事项  -->
                <template v-if="todoListStore.finishedTodoList$.length !== 0">
                    已完成({{ todoListStore.finishedTodoList$.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.finishedTodoList$"></ScrollBar>
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