<!-- 列表组件  -->
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { errMessage, successMessage, delDialog, getNowDate, getYesterday, getTomorrow } from '../../utils'
import { useTodoListStore } from '../../store/index'
// 将语言改为中文
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRouter } from 'vue-router'

const todoListStore = useTodoListStore()
const router = useRouter()

interface ItodoList {
    id: string;
    text: string;
    finished: boolean;
    significant: boolean;
    desc: string;
    deadLine: string;
    createTime: string;
    updateTime: string;
    today: boolean;
    pid: string;
    definieListName: string;
}

const data = reactive({
    showDialog: false,
    showDesDialog: false,
    currentItem: null as null | ItodoList,
    form: { today: false, text: '', desc: '', deadLine: '' }
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
    data.form.desc = item.desc
    data.form.today = item.today
    data.form.deadLine = item.deadLine
    data.showDialog = true
}

// 待办事项验证规则
const validateText = (rule: any, value: string, callback: any) => {
    const v = value.trim()
    if (!v) return callback("待办项不能为空")
    if (data.currentItem?.text === v) return callback()
    let isExist = todoListStore.todoList.some((i: { text: string; }) => i.text === v)
    return callback(isExist ? '该待办项已存在' : undefined)
}

const rules = reactive({
    text: [{ validator: validateText, trigger: 'blur' }]
})

// 确定修改
let formRef = ref()
async function confirmEdit() {
    const $form = formRef.value
    if (!$form) return
    const valid = await $form.validate()
    if (!valid) return

    let result = todoListStore.editItem(data.currentItem as ItodoList, data.form)
    result ? successMessage('修改成功') : errMessage('修改失败')
    data.form.text = ''
    data.form.desc = ''
    data.showDialog = false
}

</script>

<template>
    <div v-for="item in finishedOrunfinished" :key="item.id" class="scrollbar-demo-item">
        <div :class="{
            finishedText: item.finished, isDesc: item.desc, isDeadLine: item.deadLine,
            isListName: item.definieListName
        }">
            <div>
                <el-checkbox v-model="item.finished" />
                {{ item.text }}
            </div>
            <!-- 所属列表、截止日期 -->
            <div style="font-size: 8px;">
                <div style="margin-right:8px">
                    <template v-if="(!item.pid && !item.today)">
                        任务
                    </template>
                    <template v-if="(item.today && router.currentRoute.value.path !== '/myOneDay')">
                        我的一天
                    </template>
                    <template
                        v-if="item.pid && (router.currentRoute.value.path === '/myOneDay'
                        || router.currentRoute.value.path === '/significant' || router.currentRoute.value.path === '/plan')">
                        {{ item.definieListName }}
                    </template>
                </div>
                <div v-show="item.deadLine">
                    <template v-if="item.deadLine === getYesterday()">
                        <span style="color:red">截止日期:昨天</span>
                    </template>
                    <template v-else-if="item.deadLine === getNowDate()">
                        <div style="color:#005FB8">
                            截止日期: 今天
                        </div>
                    </template>
                    <template v-else-if="item.deadLine === getTomorrow()">
                        截止日期: 明天
                    </template>
                    <template v-else>
                        <div
                            :style="{ color: Date.parse(item.deadLine) < Date.parse(getNowDate()) ? ' red' : 'black' }">
                            截止日期：{{ item.deadLine }}
                        </div>
                    </template>
                </div>
            </div>
            <!-- 备注 -->
            <div v-show="item.desc" style="font-size: 8px;">备注:{{ item.desc }}</div>
        </div>
        <!-- 列表右侧操作 -->
        <div class="scrollbar-demo-item_right">
            <el-button text :icon="Edit" @click="editItem(item)" v-show="!item.finished">修改</el-button>
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
        <el-form :model="data.form" label-width="90px" ref="formRef" :rules="rules">
            <el-form-item label="修改事项:" prop="text" required>
                <el-input v-model="data.form.text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="添加描述:" prop="desc">
                <el-input v-model="data.form.desc" autocomplete="off" />
            </el-form-item>
            <el-form-item label="截止日期:" prop="deadLine">
                <el-config-provider :locale="zhCn">
                    <el-date-picker v-model="data.form.deadLine" type="date" placeholder="选择日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-config-provider>
            </el-form-item>
            <el-form-item label="我的一天:" prop="today">
                <el-checkbox v-model="data.form.today" size="large" />
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