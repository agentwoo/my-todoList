import { defineStore } from "pinia";
import { computed, reactive, toRefs, watch } from "vue";
import { Names } from './store-name'
import { getNowDate } from '../utils/index'

// todoList
interface ItodoList {
    id: number;
    text: string;
    finished: boolean;
    significant: boolean;
    desc: string;
    deadLine: string;
    createTime: string;
    updateTime: string;
    today: boolean;
    pid: string;
}

// form--待办事项
interface IForm {
    text: string;
    desc: string;
    deadLine: string;
    today: boolean;
}

export const useTodoListStore = defineStore(Names.TODOLIST, () => {
    // state
    const state = reactive({
        todoList: (JSON.parse(localStorage.getItem('myTodoList') as string) || []) as ItodoList[],
        searchVal: '',
        searchRes: [] as ItodoList[]
    })
    // getters
    // 我的一天
    const todayTodoListCount$ = computed(() => {
        return state.todoList.filter((v) => v.today).length
    })
    const todayTodoListAndUnfinished$ = computed(() => {
        return state.todoList.filter((v) => v.today && !v.finished)
    })
    const todayTodoListAndFinished$ = computed(() => {
        return state.todoList.filter((v) => v.today && v.finished)
    })


    // 用于判断是否展示列表
    const todoListCount$ = computed(() => {
        return state.todoList.length
    })
    // 未完成事项
    const unfinishedTodoList$ = computed(() => {
        return state.todoList.filter((v) => !v.finished && v.pid === '')
    })
    // 已完成事项
    const finishedTodoList$ = computed(() => {
        return state.todoList.filter((v) => v.finished && v.pid === '')
    })
    // 重要且未完成
    const significantAndUnfinished$ = computed(() => {
        return state.todoList.filter((v) => v.significant && !v.finished)
    })

    // 计划内
    const plan$ = computed(() => {
        let last: ItodoList[] = []
        let today: ItodoList[] = []
        let tomorrow: ItodoList[] = []
        let thisMonth: ItodoList[] = []
        let future: ItodoList[] = []

        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1
        //获取下个月第一天
        let firstDayOfNextMonth = new Date(y, m, 1).getDate()
        // 下个月第一天时间戳
        let firstDayOfNextMonthStamp = new Date(Date.parse(`${y}-${m + 1}-${firstDayOfNextMonth}`) + (24 * 60 * 60 * 1000 - 1)).getTime()
        let firstDayOfNextMonthFormat = `${m + 1}月-${firstDayOfNextMonth}日`

        //当天24点时间戳
        let todayOStamp = new Date(new Date().toLocaleDateString()).getTime();//当天0点时间戳
        let today24Stamp = new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 * 1000 - 1)).getTime();
        // 获取第二天时间戳
        let nextDay24Stamp = new Date(today24Stamp + (24 * 60 * 60 * 1000)).getTime();
        // 过滤出含有截止日期的数据
        let haveDeadLineArr = state.todoList.filter(v => v.deadLine)
        haveDeadLineArr.forEach((item: ItodoList) => {
            let timeStamp = Date.parse(item.deadLine)
            if (timeStamp < todayOStamp) {//今天之前
                return last.push(item)
            } else if (timeStamp > todayOStamp && timeStamp < today24Stamp) {//今天
                return today.push(item)
            } else if (timeStamp > today24Stamp && timeStamp < nextDay24Stamp) {//明天
                return tomorrow.push(item)
            } else if (timeStamp > nextDay24Stamp && timeStamp < firstDayOfNextMonthStamp) {//今天之后至下个月第一天
                return thisMonth.push(item)
            } else {
                return future.push(item)
            }
        });
        let haveDeadLineArrAndUnFinishedCount = haveDeadLineArr.filter((v) => !v.finished).length
        return {
            haveDeadLineArrAndUnFinishedCount,
            firstDayOfNextMonthFormat,
            last,
            today,
            tomorrow,
            thisMonth,
            future
        }
    })

    // actions
    // 添加待办事项
    let id = 1
    function addItem(Val: string, significant: boolean, today: boolean, deadLine: string, pid: string): number {
        let inputVal = Val.trim()
        if (!inputVal) return 0
        const opt = {
            id: id++,
            text: inputVal,
            finished: false,
            significant: significant,
            desc: '',
            deadLine: deadLine,
            createTime: getNowDate(),
            updateTime: '',
            today: today,
            pid: pid
        }
        state.todoList.unshift(opt)
        return 2
    }
    // 删除
    function delItem(item: ItodoList): boolean {
        let index = state.todoList.findIndex((v) => v.id === item.id)
        if (index === -1) return false
        state.todoList.splice(index, 1)
        return true
    }
    // 修改待办事项
    function editItem(item: ItodoList, form: IForm): boolean {
        let index = state.todoList.findIndex((v) => v.id === item.id)
        if (index === -1) return false
        const opt = {
            ...item,
            text: form.text,
            desc: form.desc,
            deadLine: form.deadLine,
            today: form.today,
            updateTime: getNowDate()
        }
        state.todoList.splice(index, 1, opt)
        return true
    }
    // 查找事项
    function searchItem(Val: string): 0 | 1 | ItodoList[] {
        let val = Val.trim()
        if (!val) return 0
        let arr = state.todoList.filter((v) => v.text.indexOf(val) !== -1)
        if (arr.length === 0) return 1
        return arr
    }

    // watch
    watch(() => state.todoList, newVal => {
        localStorage.setItem('myTodoList', JSON.stringify(newVal))
    }, {
        deep: true
    })

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



// 列表菜单
interface IlistArr {
    name: string,
    pid: string
}
export const useMenusStore = defineStore(Names.MENUS, () => {
    const state = reactive({
        listArr: (JSON.parse(localStorage.getItem('listArr') as string) || []) as IlistArr[],
        pid: ''
    })
    // 默认提示
    const defaultTip$ = computed(() => {
        return state.listArr.filter((v) => v.name.indexOf('无标题列表') !== -1).length
    })
    // 展示自定义列表中的todo
    const todoListStore = useTodoListStore()
    const defineListTodo$ = computed(() => {
        return todoListStore.todoList.filter((v) => v.pid === state.pid && !v.finished)
    })
    // 已完成
    const defineListTodoAndUndefinish$ = computed(() => {
        return todoListStore.todoList.filter((v) => v.pid === state.pid && v.finished)
    })

    // 计算未完成数量
    const unfinishedTodo$ = computed(() => {
        let arr: number[] = []
        state.listArr.forEach((item: IlistArr) => {
            let listItem = todoListStore.todoList.filter((v) => v.pid === item.pid && !v.finished).length
            arr.push(listItem)
        })
        return arr
    })

    // 添加自定义列表
    let pid = 1
    function addList(val: string): boolean {
        const opt = {
            name: val,
            pid: `${pid++}`
        }
        state.listArr.push(opt)
        return true
    }



    // 删除自定义列表
    function delList(val: string): boolean {
        let index = state.listArr.findIndex((v) => v.pid === val)
        if (index === -1) return false
        state.listArr.splice(index, 1)
        // 删除该自定义列表所拥有的todo
        // 此处应倒序遍历，否则将会出错
        for (let i = todoListStore.todoList.length - 1; i > -1; i--) {
            if (todoListStore.todoList[i].pid === val) {
                todoListStore.todoList.splice(i, 1)
            }
        }
        return true
    }



    watch(() => state.listArr, newVal => {
        localStorage.setItem('listArr', JSON.stringify(newVal))
    }, {
        deep: true
    })

    return {
        ...toRefs(state),
        defaultTip$,
        defineListTodo$,
        unfinishedTodo$,
        defineListTodoAndUndefinish$,
        addList,
        delList
    }
})



// 用户信息
interface IUserInfo {
    user_id: number;
    user_name: string;
    user_remark: string;
    mobile: number;
    password: string;
    head_img_url: string;
    create_time: string;
    update_time: string;

}
export const useUserStore = defineStore(Names.USER, () => {
    const state = reactive({
        userImg: 'http://mms1.baidu.com/it/u=675116665,1307545876&fm=253&app=138&f=JPEG&fmt=auto&q=75?w=500&h=500',
        userInfo: [] as [] | IUserInfo[]
    })


    return {
        ...toRefs(state)
    }

})