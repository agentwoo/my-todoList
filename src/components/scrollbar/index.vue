<!-- 列表组件  -->
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { errMessage, delDialog, getNowDate, getYesterday, getTomorrow, successMessage } from '@/utils'
import { useTodoListStore } from '@/store/index'
// 将语言改为中文
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRouter } from 'vue-router'

const todoListStore = useTodoListStore()
const router = useRouter()

const data = reactive({
    showDialog: false,
    showDesDialog: false,
    currentItem: null as null | $api.$dd_task,
    form: { myday: '', task_name: '', task_desc: '', closing_date: '', task_id: '' }
})

type Props = {
    finishedOrunfinished?: $api.$dd_task[]
}
defineProps<Props>()

// 删除
async function delItem(item: $api.$dd_task) {
    let opt = await delDialog("是否删除待办事项", "提示")
    if (!opt) return errMessage('取消删除')

    const res = await $api.dd.task.del({ user_id: window.G.user.user_id, task_id: item.task_id })
    if (!res.ok) return

    todoListStore.delItem(item)
}

// 修改
const editItem = (item: $api.$dd_task) => {
    data.currentItem = item
    data.form.task_id = item.task_id
    data.form.task_name = item.task_name
    data.form.task_desc = item.task_desc
    data.form.myday = item.myday
    data.form.closing_date = item.closing_date > '1900-01-01' ? item.closing_date : getNowDate()
    data.showDialog = true
}


// 待办事项验证规则
const validateText = (rule: any, value: string, callback: any) => {
    const v = value.trim()
    if (!v) return callback("待办项不能为空")
    if (v.length >= 40) return callback("待办项不能超过40个字")
    if (data.currentItem?.task_name === v) return callback()
    return callback()
}

const rules = reactive({
    task_name: [{ validator: validateText }],
    task_desc: [{ max: 40, message: '备注长度不能超过40个字' }]
})

// 确定修改
let formRef = ref()
async function confirmEdit() {
    const $form = formRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let res = await todoListStore.editItem({
        task_name: data.form.task_name,
        task_desc: data.form.task_desc,
        closing_date: data.form.closing_date,
        myday: data.form.myday === '1900-01-01' ? '1900-01-01' : getNowDate(),
        task_id: data.form.task_id
    })
    if (res.ok) {
        successMessage('修改成功！')
    }

    data.form.task_name = ''
    data.form.task_desc = ''
    data.showDialog = false
}


// 切换是否重要
async function switchImportant(item: $api.$dd_task) {
    const task_id = item.task_id
    const important = item.is_important === 1 ? 0 : 1
    await $api.dd.task.set_is_important({ user_id: item.user_id, task_id: task_id, is_important: important })
    let index = useTodoListStore().testTodo.findIndex(v => v.task_id === item.task_id)
    if (index === -1) return
    useTodoListStore().testTodo.splice(index, 1, { ...item, is_important: important })
}

// 切换是否完成
async function isFinished(item: $api.$dd_task) {
    const finished = item.is_finished === 1 ? 0 : 1
    await $api.dd.task.set_is_finished({ user_id: item.user_id, task_id: item.task_id, is_finished: finished })

    let index = useTodoListStore().testTodo.findIndex(v => v.task_id === item.task_id)
    if (index === -1) return
    useTodoListStore().testTodo.splice(index, 1, { ...item, is_finished: finished })
}

</script>

<template>
    <div v-for="item in finishedOrunfinished" :key="item.task_id" class="scrollbar-demo-item">
        <div :class="{
            isDesc: item.task_desc, isDeadLine: item.closing_date, isListName: item.task_name,
            notPid: !item.task_cate_id, finishedText: item.is_finished
        }">
            <div>
                <el-checkbox v-model="item.is_finished" :true-label=1 :false-label=0 @click="isFinished(item)" />
                <span style="margin-left:8px">{{ item.task_name }}</span>
            </div>
            <!-- 所属列表、截止日期 -->
            <div style="font-size: 8px;">
                <div>
                    <span v-if="(item.myday === '1900-01-01' && router.currentRoute.value.path !== '/assignment')"
                        style="margin-right:8px">
                        任务
                    </span>
                    <span v-if="(router.currentRoute.value.path !== '/myOneDay' && item.myday === getNowDate())"
                        style="margin-right:8px">
                        我的一天
                    </span>
                    <span v-if="(
                        item.task_cate_id !== '/myOneDay'
                        && item.task_cate_id !== '/significant'
                        && item.task_cate_id !== '/plan'
                        && item.task_cate_id !== '/assignment'
                    )" style="margin-right:8px">
                        {{ item.task_name }}
                    </span>
                </div>
                <div v-show="item.closing_date !== '1900-01-01'">
                    <template v-if="item.closing_date === getYesterday()">
                        <span style="color:red">截止日期:昨天</span>
                    </template>
                    <template v-else-if="item.closing_date === getNowDate()">
                        <div style="color:#005FB8">
                            截止日期: 今天
                        </div>
                    </template>
                    <template v-else-if="item.closing_date === getTomorrow()">
                        截止日期: 明天
                    </template>
                    <template v-else>
                        <div
                            :style="{ color: Date.parse(item.closing_date) < Date.parse(getNowDate()) ? ' red' : 'black' }">
                            截止日期：{{ item.closing_date }}
                        </div>
                    </template>
                </div>
            </div>
            <!-- 备注 -->
            <div v-show="item.task_desc" style="font-size: 8px;">备注:{{ item.task_desc }}</div>
        </div>
        <!-- 列表右侧操作 -->
        <div class="scrollbar-demo-item_right">
            <el-button text :icon="Edit" @click="editItem(item)" v-show="item.is_finished == 0">修改</el-button>
            <el-button text :icon="Delete" @click="delItem(item)">删除</el-button>
            <div @click="switchImportant(item)">
                <el-icon v-if="item.is_important === 0" style="margin-top:6px">
                    <Star />
                </el-icon>
                <el-icon v-if="item.is_important === 1" style="margin-top:6px">
                    <StarFilled />
                </el-icon>
            </div>
        </div>
    </div>
    <!-- 修改弹窗 -->
    <el-dialog v-model="data.showDialog" title="提示">
        <el-form :model="data.form" label-width="90px" ref="formRef" :rules="rules">
            <el-form-item label="修改事项:" prop="task_name" required>
                <el-input v-model="data.form.task_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="添加描述:" prop="task_desc">
                <el-input v-model="data.form.task_desc" autocomplete="off" />
            </el-form-item>
            <el-form-item label="截止日期:" prop="closing_date">
                <el-config-provider :locale="zhCn">
                    <el-date-picker v-model="data.form.closing_date" type="date" placeholder="选择日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" :clearable="false" :editable="false" />
                </el-config-provider>
            </el-form-item>
            <el-form-item label="我的一天:" prop="myday">
                <el-checkbox v-model="data.form.myday" :true-label=getNowDate() false-label='1900-01-01' size="large" />
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
    color: black;

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

    .notPid,
    .isDesc,
    .isListName,
    .isDeadLine {
        display: flex;
        flex-direction: column;

        div {
            display: flex;
            align-items: center;
        }
    }
}
</style>