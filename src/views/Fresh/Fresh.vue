<!-- 入门 -->
<script lang='ts' setup>
import { reactive, toRefs, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { errMessage, successMessage } from '../../utils'
import { useTodoListStore } from '../../store/index'
import scrollbar from '../../components/scrollbar/index.vue'


const todoListStore = useTodoListStore()

const data = reactive({
    inputVal: '',
})

const addItem = () => {
    const result = todoListStore.addItem(data.inputVal, false, false, '', '1')
    result ? successMessage('添加成功') : errMessage('该代办事项已存在')
    data.inputVal = ''
}

</script>

<template>
    <div class="container">
        <div class="title">入门</div>
        <el-scrollbar class="showList">
            <scrollbar :finishedOrunfinished="todoListStore.fresh$"></scrollbar>
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