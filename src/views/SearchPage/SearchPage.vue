<!-- 展示搜索结果 -->
<script lang='ts' setup>
import { useTodoListStore } from '../../store';
import ScrollBar from '../../components/scrollbar/index.vue'

const todoListStore = useTodoListStore()

</script>

<template>
    <div class="searchList">
        <div class="tip" v-if="todoListStore.searchRes.length === 0">
            <el-empty :image-size="250" description="查无此项" />
        </div>
        <template v-else>
            <el-scrollbar>
                <ScrollBar :finishedOrunfinished="todoListStore.searchRes"></ScrollBar>
            </el-scrollbar>
        </template>
    </div>
</template>

<style lang='scss' scoped>
.searchList {
    height: 96vh;
    margin-top: 2vh;
    overflow-y: scroll;

    .tip {
        height: 80vh;
        display: flex;
        justify-content: center;
        font-weight: 900;

        :deep(.el-empty__description p) {
            color: white
        }
    }
}
</style>