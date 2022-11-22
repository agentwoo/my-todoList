<!-- todoList -->
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { useTodoListTestStore, useMenusListStore } from '../../store/index'
import { delDialog, successMessage, errMessage } from '../../utils/index'

const menusListStore = useMenusListStore()


interface todoListItem {
    text: string,
    finished: boolean
}

const data = reactive({
    inputlVal: '',
    showEditDialog: false,
    currentEditItem: null as null | todoListItem,
    editForm: {
        text: ''
    }
})

// 获取store中todoList数据
const TodoListStore = useTodoListTestStore()

// 添加待办事项
const addItem = () => {
    const result = TodoListStore.addItem(data.inputlVal)
    result ? successMessage('添加成功!') : errMessage('该待办项已经存在')
    data.inputlVal = ''
}

// 删除待办项
async function delItem(item: todoListItem) {
    let opt = await delDialog('删除待办项', '提示')
    if (opt) {
        const result = TodoListStore.delItem(item)
        result ? successMessage('删除成功!') : errMessage('该待办项已经存在')
    }
    else { errMessage('取消') }
}


// 修改操作
const editItem = (item: todoListItem) => {
    data.editForm.text = item.text
    data.currentEditItem = item
    data.showEditDialog = true
}

// 定义修改规则
function validateForm(rule: any, value: string, callback: any) {
    const v = value.trim()
    if (!v) return callback("待办项不能为空")

    let isExist = TodoListStore.todoList.some((i: { text: string; }) => i.text === v)
    return callback(isExist ? '该待办项已存在' : undefined)
}

// 编辑表单
const formRef = ref()
async function confirmEdit() {
    const $form = formRef.value
    if (!$form) return

    const valid = await $form.validate()
    if (!valid) return

    const result = TodoListStore.editItem(data.currentEditItem, data.editForm.text)
    result ? successMessage('修改成功！') : undefined

    // 关闭编辑框
    data.showEditDialog = false
}

const cancelEdit = () => {
    data.showEditDialog = false
    errMessage("取消修改")
}

</script>

<template>
    <div class="todoList">
        <div class="container">
            <div class="header">
                <el-input type="text" :prefix-icon="Plus" v-model="data.inputlVal" autocomplete="off"
                    @keyup.enter="addItem" placeholder="请输入待办事项...." />
                <el-button type="primary" :icon="Plus" style="margin-left: 10px;" :disabled="!data.inputlVal.trim()"
                    @click="addItem">
                    添加
                </el-button>
            </div>
            <!-- 统计待办项 -->
            <el-checkbox size="large" v-model="TodoListStore.showFinished">
                已完成({{ TodoListStore.finishedCount$ }})/剩余待办({{ TodoListStore.unFinishedCount$ }})
            </el-checkbox>

            <el-empty v-if="TodoListStore.todoList$.length === 0" description="暂无待办事项" />
            <!-- 展示待办项 -->
            <template v-else>
                <el-scrollbar height="400px">
                    <p v-for="item in TodoListStore.todoList$" :key="item.text" class="scrollbar-demo-item"
                        :class="{ 'isFinished': item.finished }">
                    <div class="itemText">
                        <el-checkbox size="large" v-model="item.finished" />
                        {{ item.text }}
                    </div>
                    <div>
                        <el-button text :icon="Edit" v-show="!item.finished" @click="editItem(item)">修改</el-button>
                        <el-button text :icon="Delete" @click="delItem(item)">删除</el-button>
                    </div>
                    </p>
                </el-scrollbar>
            </template>
            <!-- 编辑弹窗 -->
            <el-dialog v-model="data.showEditDialog" title="编辑待办项">
                <el-form :model="data.editForm" ref="formRef">
                    <el-form-item label="编辑" label-width="60px" prop="text" required
                        :rules="[{ validator: validateForm }]">
                        <el-input v-model="data.editForm.text" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="cancelEdit">取消</el-button>
                        <el-button type="primary" @click="confirmEdit">
                            确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.todoList {
    display: flex;
    justify-content: center;

    .container {
        width: 500px;

        .header {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid gray;
        }

        .scrollbar-demo-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 50px;
            margin: 10px;
            padding: 0 15px;
            text-align: center;
            border-radius: 4px;
            color: var(--el-color-primary);
            border: 1px solid gray;
        }

        .isFinished .itemText {
            text-decoration: line-through;
            color: gray;
        }
    }
}
</style>