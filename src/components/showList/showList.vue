<!-- 我的一天 -->
<script lang='ts' setup>
import { reactive, toRefs, ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getDate, errMessage, successMessage } from '../../utils'
import { useTodoListStore } from '../../store/index'

const data = reactive({
    inputVal: '',
})

const todoListStore = useTodoListStore()

//添加
const addItem = () => {
    const result = todoListStore.addSignificant(data.inputVal)
    result ? successMessage('添加成功') : errMessage('该代办事项已存在')
    data.inputVal = ''
}

</script>

<template>
    <div class="container">
        <div class="header">
            <div class="header_title">重要</div>
            <div>{{ getDate() }}</div>
        </div>
        <div class="tip" v-if="todoListStore.SignificantCount$ === 0">
            <el-empty :image-size="250" description="暂无重要事项" />
        </div>
        <div v-else class="showList">
            <el-scrollbar height="70vh">
                <div v-for="item in todoListStore.significant$" :key="item.text" class="scrollbar-demo-item">
                    <div>
                        <el-checkbox v-model="item.finished" />
                        {{ item.text }}
                    </div>
                    <div @click="item.significant = !item.significant">
                        <el-icon v-show="!item.significant">
                            <Star />
                        </el-icon>
                        <el-icon v-show="item.significant">
                            <StarFilled />
                        </el-icon>
                    </div>
                </div>
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

        .scrollbar-demo-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            height: 50px;
            margin: 10px;
            text-align: center;
            border-radius: 4px;
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
        }
    }

    .addIput {
        width: 95%;
        height: 10vh;
    }
}
</style>