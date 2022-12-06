<!-- 展示搜索结果 -->
<script lang='ts' setup>
import { useTodoListStore } from '../../store';
import ScrollBar from '../../components/scrollbar/index.vue'

const todoListStore = useTodoListStore()

</script>

<template>
    <div class="searchList">
        <div v-if="todoListStore.searchRes.length === 0">
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
    height: 100%;
    overflow-y: scroll;
}
</style>