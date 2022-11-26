<!-- 计划内 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { useTodoListStore } from '../../store/index'
import ScrollBar from '../../components/scrollbar/index.vue'
import { getDate } from '../../utils';

const todoListStore = useTodoListStore()
</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">今日计划</div>
            <div>{{ getDate() }}</div>
        </div>
        <div class="tip" v-if="todoListStore.PlanItemAndUnfinishe$.length === 0">
            <el-empty :image-size="250" description="今日暂无待办事项" />
        </div>
        <div v-else class="showList">
            <el-scrollbar>
                <ScrollBar :finishedOrunfinished="todoListStore.PlanItemAndUnfinishe$"></ScrollBar>
                <template v-if="todoListStore.PlanItemAndfinished$.length !== 0">
                    已完成({{ todoListStore.PlanItemAndfinished$.length }})
                    <ScrollBar :finishedOrunfinished="todoListStore.PlanItemAndfinished$"></ScrollBar>
                </template>
            </el-scrollbar>
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
}
</style>