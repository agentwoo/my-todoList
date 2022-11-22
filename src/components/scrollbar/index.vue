<!-- 列表组件  -->
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { Delete, Edit, Comment } from '@element-plus/icons-vue'
import { errMessage, successMessage, delDialog } from '../../utils'
import { useTodoListStore } from '../../store/index'


const todoListStore = useTodoListStore()

interface ItodoList {
    id: number;
    text: string;
    finished: boolean;
    significant: boolean;
    desc: string
}

const data = reactive({
    showDialog: false,
    showDesDialog: false,
    currentItem: null as null | ItodoList,
    form: { text: '' },
    descFrom: { text: '' }
})

type Props = {
    finishedOrunfinished?: ItodoList[]
}
defineProps<Props>()


// 删除
async function delItem(item: ItodoList) {
    let opt = await delDialog("是否删除待办事项", "提示")
    if (opt) {
        let result = todoListStore.delItem(item)
        result ? successMessage('删除成功！') : undefined
    } else {
        errMessage('取消删除')
    }
}

// 修改
const editItem = (item: ItodoList) => {
    data.currentItem = item
    data.form.text = item.text
    data.showDialog = true
}

// 确定修改
const confirmEdit = () => {
    let result = todoListStore.editItem(data.currentItem as ItodoList, data.form.text)
    result ? successMessage('修改成功') : errMessage('修改失败')
    data.form.text = ''
    data.showDialog = false
}

// 添加备注
const addDesc = (item: ItodoList) => {
    data.currentItem = item
    data.descFrom.text = item.desc
    data.showDesDialog = true
}
// 确定修改备注
const confirmAddDesc = () => {
    let result = todoListStore.addDesc(data.currentItem as ItodoList, data.descFrom.text)
    result ? successMessage('修改成功') : errMessage('修改失败')
    data.descFrom.text = ''
    data.showDesDialog = false
}


</script>

<template>
    <div v-for="item in finishedOrunfinished" :key="item.id" class="scrollbar-demo-item">
        <div :class="{ finishedText: item.finished, isDesc: item.desc }">
            <div>
                <el-checkbox v-model="item.finished" />
                {{ item.text }}
            </div>
            <div>{{ item.desc }}</div>
        </div>
        <div class="scrollbar-demo-item_right">
            <el-button text :icon="Edit" @click="editItem(item)" v-show="!item.finished">修改</el-button>
            <el-button text :icon="Comment" @click="addDesc(item)">备注</el-button>
            <el-button text :icon="Delete" @click="delItem(item)">删除</el-button>
            <div @click="item.significant = !item.significant">
                <el-icon v-if="!item.significant">
                    <Star />
                </el-icon>
                <el-icon v-else>
                    <StarFilled />
                </el-icon>
            </div>
        </div>
    </div>
    <!-- 修改弹窗 -->
    <el-dialog v-model="data.showDialog" title="提示">
        <el-form :model="data.form">
            <el-form-item label="修改当前待办事项" prop="text">
                <el-input v-model="data.form.text" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="data.showDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmEdit">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 添加备注 -->
    <el-dialog v-model="data.showDesDialog" title="提示">
        <el-form :model="data.descFrom">
            <el-form-item label="添加描述" prop="text">
                <el-input v-model="data.descFrom.text" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="data.showDesDialog = false">取消</el-button>
                <el-button type="primary" @click="confirmAddDesc">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang='scss' scoped>
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 70px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);

    &_right {
        display: flex;

        :deep(.el-buttom) {
            margin-right: 5px;
        }
    }

    .finishedText {
        text-decoration: line-through;
        color: gray;
    }

    .isDesc {
        display: flex;
        flex-direction: column;

        div {
            display: flex;
            align-content: space-between;
        }
    }
}
</style>