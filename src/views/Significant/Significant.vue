<!-- 我的一天 -->
<script lang='ts' setup>
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getDate, errMessage, successMessage } from '../../utils'
import { useTodoListStore } from '../../store/index'
import { useRouter } from 'vue-router'
import ScrollBar from '../../components/scrollbar/index.vue'

const router = useRouter()
const data = reactive({
    inputVal: '',
})

const todoListStore = useTodoListStore()

//添加
async function addItem() {
    let task_cate_id = router.currentRoute.value.path
    const res = await todoListStore.addItem(
        {
            user_id: window.G.user.user_id,
            task_cate_id: task_cate_id,
            task_name: data.inputVal,
            is_important: 1
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
            <div class="header_title">重要</div>
            <div>{{ getDate() }}</div>
        </div>
        <div class="tip" v-if="todoListStore.significantAndUnfinished$.length === 0">
            <el-empty :image-size="250" description="暂无重要事项" />
        </div>
        <div v-else class="showList">
            <el-scrollbar>
                <!-- 未完成 -->
                <ScrollBar :finished-orunfinished="todoListStore.significantAndUnfinished$"></ScrollBar>
            </el-scrollbar>
        </div>
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