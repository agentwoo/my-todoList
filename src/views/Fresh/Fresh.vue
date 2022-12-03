<!-- 入门 -->
<script lang='ts' setup>
import { reactive, toRefs, ref, watch } from 'vue'
import { LocationFilled, Plus } from '@element-plus/icons-vue'
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

let item = menusStore.listArr.find((v: { pid: string }) => v.pid === route.params.pid)
console.log(data.item);
watch(() => route.params, (newVal, oldVal) => {
    console.log(newVal);
})




const addItem = () => {
    const result = todoListStore.addItem(data.inputVal, false, false, '', data.item.pid)
    if (result === 0) {
        errMessage("输入不能为空！")
    } else if (result === 1) {
        errMessage('该代办事项已经存在！')
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