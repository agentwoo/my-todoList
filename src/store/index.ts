import { defineStore } from "pinia";
import { computed, onMounted, reactive, toRefs, watch } from "vue";
import { Names } from './store-name'
import { getNowDate } from '../utils/index'



// form--待办事项
interface IForm {
    task_name: string;
    task_desc: string;
    closing_date: string;
    myday: string;
    task_id: string;
}

interface IaddItem {
    user_id: string;
    task_cate_id?: string | undefined;
    task_name: string;
    is_important?: number | undefined;
    myday?: string | undefined;
    closing_date?: string | undefined;
}

const arr = {
    replace: function <T>(list: T[], item: T, key: keyof T) {
        let index = list.findIndex(v => v[key] === item[key])
        if (index === -1) {
            list.push(item)
        } else {
            list.splice(index, 1, item)
        }
    }
}

export const useTodoListStore = defineStore(Names.TODOLIST, () => {
    // state
    const state = reactive({
        testTodo: window.G.tasks || [] as $api.$dd_task[],
        searchVal: '',
        searchRes: [] as $api.$dd_task[]
    })
    // getters
    // 我的一天
    const todayTodoListCount$ = computed(() => {
        return state.testTodo.filter(v => v.myday === getNowDate()).length
    })
    const todayTodoListAndUnfinished$ = computed(() => {
        return state.testTodo.filter((v) => v.myday === getNowDate() && v.is_finished === 0)
    })
    const todayTodoListAndFinished$ = computed(() => {
        return state.testTodo.filter((v) => v.myday === getNowDate() && v.is_finished === 1)
    })

    // 用于任务列表中判断是否展示列表
    const todoListCount$ = computed(() => {
        return state.testTodo.length
    })

    // 未完成事项
    const unfinishedTodoList$ = computed(() => {
        return state.testTodo.filter(v => v.is_finished === 0)
    })

    // 已完成事项
    const finishedTodoList$ = computed(() => {
        return state.testTodo.filter(v => v.is_finished === 1)
    })

    // 重要且未完成
    const significantAndUnfinished$ = computed(() => {
        return state.testTodo.filter(v => v.is_important && !v.is_finished)
    })


    // 计划内
    const plan$ = computed(() => {
        let last: $api.$dd_task[] = []
        let today: $api.$dd_task[] = []
        let tomorrow: $api.$dd_task[] = []
        let thisMonth: $api.$dd_task[] = []
        let future: $api.$dd_task[] = []

        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1

        // 下个月第一天时间戳
        let firstDayOfNextMonthStamp = 0
        let firstDayOfNextMonthFormat = ''
        if (m < 12) {
            firstDayOfNextMonthStamp = new Date(Date.parse(`${y}-${m + 1}-1`) + (24 * 60 * 60 * 1000 - 1)).getTime()
            firstDayOfNextMonthFormat = `${m + 1}月1日`
        } else {
            firstDayOfNextMonthStamp = new Date(Date.parse(`${y + 1}-1-1`) + (24 * 60 * 60 * 1000 - 1)).getTime()
            firstDayOfNextMonthFormat = `${y + 1}年1月1日`
        }

        //当天0点时间戳
        let todayOStamp = new Date(new Date().toLocaleDateString()).getTime();
        //当天24点时间戳
        let today24Stamp = new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 * 1000 - 1)).getTime();
        // 获取第二天时间戳
        let nextDay24Stamp = new Date(today24Stamp + (24 * 60 * 60 * 1000)).getTime();
        // 存储所有事件的截止时间
        let deadLineArr: number[] = []

        // 过滤出含有截止日期的数据
        let haveDeadLineArr = state.testTodo.filter(v => v.closing_date && v.closing_date !== '1900-01-01')
        haveDeadLineArr.forEach((item: $api.$dd_task) => {
            let timeStamp = Date.parse(item.closing_date)
            if (timeStamp < todayOStamp) {//今天之前
                last.push(item)
            } else if (timeStamp > todayOStamp && timeStamp < today24Stamp) {//今天
                today.push(item)
            } else if (timeStamp > today24Stamp && timeStamp < nextDay24Stamp) {//明天
                tomorrow.push(item)
            } else if (timeStamp > nextDay24Stamp && timeStamp < firstDayOfNextMonthStamp) {//今天之后至下个月第一天
                thisMonth.push(item)
                // 将所有截止时间以时间戳格式存储
                let deadLine = Date.parse(item.closing_date)
                deadLineArr.push(deadLine)
            } else {
                future.push(item)
            }
        });

        // 查找最近的一个截止时间
        let nearDeadLineStamp = deadLineArr[0]
        for (let i = 0; i < deadLineArr.length; i++) {
            if (nearDeadLineStamp > deadLineArr[i]) {
                nearDeadLineStamp = deadLineArr[i]
            }
        }
        let nearDeadLineFormat = new Date(nearDeadLineStamp)
        let nearY = nearDeadLineFormat.getFullYear()
        let nearM = nearDeadLineFormat.getMonth() + 1
        let nearD = nearDeadLineFormat.getDate()
        let nearDeadLine = `${nearY}年${nearM}月${nearD}日`

        // 获取拥有截止日期但未完成的数量
        let haveDeadLineArrAndUnFinishedCount = haveDeadLineArr.filter(v => v.is_finished === 0).length
        return {
            haveDeadLineArr,
            haveDeadLineArrAndUnFinishedCount,
            firstDayOfNextMonthFormat,
            nearDeadLine,
            last,
            today,
            tomorrow,
            thisMonth,
            future
        }
    })

    // 添加事项
    async function addItem(item: IaddItem) {
        let res = await $api.dd.task.add(item)
        if (res.ok) {
            state.testTodo.push(res.data)
        }
        return res
    }

    // 删除
    function delItem(item: $api.$dd_task): boolean {
        let index = state.testTodo.findIndex(v => v.task_id === item.task_id)
        if (index === -1) return false
        state.testTodo.splice(index, 1)
        return true
    }


    // 修改待办事项
    async function editItem(form: IForm) {
        let res = await $api.dd.task.set({
            user_id: window.G.user.user_id,
            task_id: form.task_id,
            task_name: form.task_name,
            myday: form.myday,
            task_desc: form.task_desc,
            closing_date: form.closing_date
        })
        if (res.ok) {
            arr.replace(state.testTodo, res.data, 'task_id')
        }
        return res
    }


    // 查找事项
    function searchItem(Val: string): 0 | 1 | $api.$dd_task[] {
        let val = Val.trim()
        if (!val) return 0
        let arr = state.testTodo.filter((v) => v.task_name.indexOf(val) !== -1)
        if (arr.length === 0) return 1
        return arr
    }

    return {
        ...toRefs(state),
        todayTodoListCount$,
        todayTodoListAndUnfinished$,
        todayTodoListAndFinished$,
        todoListCount$,
        unfinishedTodoList$,
        finishedTodoList$,
        significantAndUnfinished$,
        plan$,
        addItem,
        delItem,
        editItem,
        searchItem
    }
})


interface INewMenus {
    [key: string]: {
        task_cate_pid: string;
        task_cate_id: string;
        task_cate_name: string;
        children?: {
            task_cate_pid: string;
            task_cate_id: string;
            task_cate_name: string;
        }[]
    }
}

// 列表菜单
interface IlistArr {
    name: string,
    pid: string
}
export const useMenusStore = defineStore(Names.MENUS, () => {
    const state = reactive({
        testMenus: (window.G.task_cates || []) as $api.$dd_task_cate[],
        taskCaseid: '',
        paramsId: '',
    })

    // 展示自定义列表中的todo
    const todoListStore = useTodoListStore()
    const defineListTodo$ = computed(() => {
        return todoListStore.testTodo.filter(v => v.task_cate_id === state.paramsId && v.is_finished === 0)
    })
    // 已完成
    const defineListTodoAndUndefinish$ = computed(() => {
        return todoListStore.testTodo.filter(v => v.task_cate_id === state.paramsId && v.is_finished === 1)
    })


    interface IListUnfinishedCount {
        num: number;
        taskId: string;
    }
    // 计算未完成数量
    const unfinishedTodo$ = computed(() => {
        let arr: IListUnfinishedCount[] = []
        state.testMenus.forEach((item: $api.$dd_task_cate) => {
            let listItem = todoListStore.testTodo.filter((v) => v.task_cate_id === item.task_cate_id && v.is_finished === 0).length
            const opt = {
                num: listItem,
                taskId: item.task_cate_id
            }
            arr.push(opt)
        })
        return arr
    })


    // 删除自定义列表
    async function delList(val: string) {
        let res = await $api.dd.task_cate.del({ user_id: window.G.user.user_id, task_cate_id: val })
        if (!res.ok) return

        let index = state.testMenus.findIndex(v => v.task_cate_id === val)
        if (index === -1) return
        state.testMenus.splice(index, 1)

        // 删除该自定义列表所拥有的todo
        // 此处应倒序遍历，否则将会出错
        for (let i = todoListStore.testTodo.length - 1; i > -1; i--) {
            if (todoListStore.testTodo[i].task_cate_id === val) {
                todoListStore.testTodo.splice(i, 1)
            }
        }
        return res
    }


    function getTaskCase() {
        const newMenus: INewMenus = {}
        let taskGroup = state.testMenus.filter(v => v.task_cate_type === 0)
        for (let i = 0; i < taskGroup.length; i++) {
            if (taskGroup[i].task_cate_pid === '') {
                newMenus[taskGroup[i].task_cate_id] = {
                    ...taskGroup[i],
                    children: newMenus[taskGroup[i].task_cate_id]?.children || []
                }
            } else {
                let task_cate_pid = taskGroup[i].task_cate_pid;
                newMenus[task_cate_pid] = newMenus[task_cate_pid] || {}
                newMenus[task_cate_pid].children = newMenus[task_cate_pid].children || [];
                newMenus[task_cate_pid].children?.push(taskGroup[i]);
            }
        }
        return newMenus
    }

    function taskList() {
        return state.testMenus.filter(v => v.task_cate_type === 1)
    }



    return {
        ...toRefs(state),
        defineListTodo$,
        unfinishedTodo$,
        defineListTodoAndUndefinish$,
        delList,
        getTaskCase,
        taskList
    }
})



// 用户信息
export const useUserStore = defineStore(Names.USER, () => {
    const state = reactive({
        userInfo: window?.G?.user || {}
    })
    return {
        ...toRefs(state),
    }

})