import { defineStore } from "pinia";
import { computed, reactive, toRefs, watch } from "vue";
import { Names } from './store-name'
import { getDate } from '../utils/index'
// todoListest
interface todoListItem {
    text: string,
    finished: boolean
}

export const useTodoListTestStore = defineStore(Names.TODOLISTTEST, () => {
    // state
    const state = reactive({
        showFinished: false,
        todoList: JSON.parse(localStorage.getItem('todoList') as string) || [] as todoListItem[]
    })
    // getters
    const finishedCount$ = computed(() => {
        return state.todoList.filter((v: { finished: boolean; }) => v.finished).length
    })
    const unFinishedCount$ = computed(() => {
        return state.todoList.filter((v: { finished: boolean }) => !v.finished).length
    })
    const todoList$ = computed(() => {
        if (state.showFinished) return state.todoList.filter((v: { finished: boolean; }) => v.finished)
        return state.todoList.filter((v: { finished: boolean; }) => !v.finished)
    })
    // actions
    function addItem(Val: string) {
        let inputlVal = Val.trim()
        if (!inputlVal) return false
        let index = state.todoList.findIndex((v: { text: string; }) => v.text === inputlVal)
        if (index !== -1) return false
        state.todoList.push({ finished: false, text: inputlVal })
        return true
    }
    function delItem(item: todoListItem) {
        let index = state.todoList.findIndex((v: { text: string; }) => v.text === item.text)
        if (index === -1) return false
        state.todoList.splice(index, 1)
        return true
    }
    function editItem(item: todoListItem | null, text: string) {
        const currentItem = item
        if (!currentItem) return false
        let index = state.todoList.findIndex((v: { text: string; }) => v.text === currentItem?.text)
        if (index === -1) return false
        let updaText = text.trim()
        state.todoList.splice(index, 1, { finished: false, text: updaText })
        return true
    }
    watch(() => state.todoList, (newVal) => {
        localStorage.setItem('todoList', JSON.stringify(newVal))
    }, {
        deep: true
    })
    return {
        ...toRefs(state),
        finishedCount$,
        unFinishedCount$,
        todoList$,
        addItem,
        delItem,
        editItem
    }
})




// 菜单栏
interface IMenus {
    id: number;
    parentId: number;
    createTime: string;
    title: string;
    level: number;
    sort: number;
    name: string;
    icon: string;
    hidden: number;
    children?: IMenus[]
}

interface INewMenusList {
    [key: number]: IMenus
}

export const useMenusListStore = defineStore(Names.MENUSLIST, {
    state: () => {
        return {
            menus: [
                { "id": 3, "parentId": 99, "createTime": "2020-02-02T06:52:44.000+00:00", "title": "添加商品", "level": 1, "sort": 0, "name": "addProduct", "icon": "product-add", "hidden": 0 },
                { "id": 4, "parentId": 99, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "商品分类", "level": 1, "sort": 0, "name": "productCate", "icon": "product-cate", "hidden": 0 },
                { "id": 5, "parentId": 99, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "品牌管理", "level": 1, "sort": 0, "name": "brand", "icon": "product-brand", "hidden": 0 },
                { "id": 6, "parentId": 99, "createTime": "2020-02-02T06:56:29.000+00:00", "title": "属性管理", "level": 1, "sort": 0, "name": "productAttr", "icon": "product-attr", "hidden": 0 },
                { "id": 13, "parentId": 118, "createTime": "2020-02-04T08:19:22.000+00:00", "title": "秒杀活动列表", "level": 1, "sort": 0, "name": "flash", "icon": "sms-flash", "hidden": 0 },
                { "id": 14, "parentId": 118, "createTime": "2020-02-04T08:20:16.000+00:00", "title": "优惠券列表", "level": 1, "sort": 0, "name": "coupon", "icon": "sms-coupon", "hidden": 0 },
                { "id": 16, "parentId": 118, "createTime": "2020-02-07T08:22:38.000+00:00", "title": "品牌推荐", "level": 1, "sort": 0, "name": "homeBrand", "icon": "product-brand", "hidden": 0 }, { "id": 17, "parentId": 118, "createTime": "2020-02-07T08:23:14.000+00:00", "title": "新品推荐", "level": 1, "sort": 0, "name": "homeNew", "icon": "sms-new", "hidden": 0 }, { "id": 18, "parentId": 118, "createTime": "2020-02-07T08:26:38.000+00:00", "title": "人气推荐", "level": 1, "sort": 0, "name": "homeHot", "icon": "sms-hot", "hidden": 0 }, { "id": 19, "parentId": 118, "createTime": "2020-02-07T08:28:16.000+00:00", "title": "专题推荐", "level": 1, "sort": 0, "name": "homeSubject", "icon": "sms-subject", "hidden": 0 }, { "id": 20, "parentId": 118, "createTime": "2020-02-07T08:28:42.000+00:00", "title": "广告列表", "level": 1, "sort": 0, "name": "homeAdvertise", "icon": "sms-ad", "hidden": 0 }, { "id": 22, "parentId": 97, "createTime": "2021-08-21T01:36:21.000+00:00", "title": "用户列表", "level": 1, "sort": 0, "name": "admin", "icon": "ums-admin", "hidden": 0 }, { "id": 25, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "资源列表", "level": 1, "sort": 0, "name": "resource", "icon": "ums-resource", "hidden": 0 }, { "id": 29, "parentId": 97, "createTime": "2021-08-21T01:36:21.000+00:00", "title": "分配菜单", "level": 1, "sort": 0, "name": "allocMenu", "icon": "allocMenu", "hidden": 1 }, { "id": 30, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "分配资源", "level": 1, "sort": 0, "name": "allocResource", "icon": "allocResource", "hidden": 1 }, { "id": 31, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "编辑角色", "level": 1, "sort": 0, "name": "editRole", "icon": "editRole", "hidden": 1 }, { "id": 32, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "添加角色", "level": 1, "sort": 0, "name": "addRole", "icon": "addRole", "hidden": 1 }, { "id": 33, "parentId": 97, "createTime": "2021-08-21T01:36:21.000+00:00", "title": "添加菜单", "level": 1, "sort": 0, "name": "addMenu", "icon": "addMenu", "hidden": 1 }, { "id": 34, "parentId": 97, "createTime": "2021-08-21T01:36:21.000+00:00", "title": "编辑菜单", "level": 1, "sort": 0, "name": "editMenu", "icon": "editMenu", "hidden": 1 }, { "id": 38, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "分配角色", "level": 1, "sort": 0, "name": "allocRole", "icon": "allocRole", "hidden": 1 }, { "id": 42, "parentId": 118, "createTime": "2021-05-26T10:06:38.000+00:00", "title": "秒杀时间段列表", "level": 1, "sort": 0, "name": "flashSession", "icon": "flashSession", "hidden": 1 }, { "id": 43, "parentId": 118, "createTime": "2021-05-26T10:15:07.000+00:00", "title": "秒杀活动设置商品", "level": 1, "sort": 0, "name": "selectSession", "icon": "selectSession", "hidden": 1 }, { "id": 44, "parentId": 118, "createTime": "2021-05-26T10:25:08.000+00:00", "title": "秒杀商品列表", "level": 1, "sort": 0, "name": "flashProductRelation", "icon": "flashProductRelation", "hidden": 1 }, { "id": 45, "parentId": 118, "createTime": "2021-05-28T01:54:30.000+00:00", "title": "添加优惠券", "level": 1, "sort": 0, "name": "addCoupon", "icon": "addCoupon", "hidden": 1 }, { "id": 46, "parentId": 118, "createTime": "2021-05-28T02:01:56.000+00:00", "title": "编辑优惠券", "level": 1, "sort": 0, "name": "updateCoupon", "icon": "updateCoupon", "hidden": 1 }, { "id": 47, "parentId": 118, "createTime": "2021-05-28T02:08:19.000+00:00", "title": "优惠券领取详情", "level": 1, "sort": 0, "name": "couponHistory", "icon": "couponHistory", "hidden": 1 }, { "id": 48, "parentId": 97, "createTime": "2021-08-21T01:36:21.000+00:00", "title": "菜单列表", "level": 1, "sort": 0, "name": "menu", "icon": "ums-menu", "hidden": 0 }, { "id": 49, "parentId": 118, "createTime": "2021-06-04T06:46:31.000+00:00", "title": "添加广告", "level": 1, "sort": 0, "name": "addAdvertise", "icon": "addAdvertise", "hidden": 1 }, { "id": 50, "parentId": 118, "createTime": "2021-06-04T06:48:52.000+00:00", "title": "编辑广告", "level": 1, "sort": 0, "name": "updateAdvertise", "icon": "updateAdvertise", "hidden": 1 }, { "id": 51, "parentId": 99, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "编辑商品分类", "level": 1, "sort": 0, "name": "updateProductCate", "icon": "updateProductCate", "hidden": 1 }, { "id": 52, "parentId": 99, "createTime": "2021-06-04T08:29:03.000+00:00", "title": "添加商品分类", "level": 1, "sort": 0, "name": "addProductCate", "icon": "addProductCate", "hidden": 1 }, { "id": 53, "parentId": 99, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "查看属性列表", "level": 1, "sort": 0, "name": "productAttrList", "icon": "productAttrList", "hidden": 1 }, { "id": 54, "parentId": 99, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "编辑商品属性", "level": 1, "sort": 0, "name": "updateProductAttr", "icon": "updateProductAttr", "hidden": 1 }, { "id": 55, "parentId": 99, "createTime": "2021-06-04T09:33:51.000+00:00", "title": "添加商品属性", "level": 1, "sort": 0, "name": "addProductAttr", "icon": "addProductAttr", "hidden": 1 }, { "id": 56, "parentId": 99, "createTime": "2021-06-04T09:43:57.000+00:00", "title": "添加品牌", "level": 1, "sort": 0, "name": "addBrand", "icon": "addBrand", "hidden": 1 }, { "id": 57, "parentId": 99, "createTime": "2021-06-04T09:51:46.000+00:00", "title": "编辑品牌", "level": 1, "sort": 0, "name": "updateBrand", "icon": "updateBrand", "hidden": 1 }, { "id": 60, "parentId": 97, "createTime": "2021-07-15T14:27:14.000+00:00", "title": "角色列表", "level": 1, "sort": 0, "name": "role", "icon": "ums-role", "hidden": 0 }, { "id": 97, "parentId": 0, "createTime": "2021-09-22T06:24:30.000+00:00", "title": "权限", "level": 0, "sort": 0, "name": "ums", "icon": "ums", "hidden": 0 }, { "id": 99, "parentId": 0, "createTime": "2021-09-22T06:24:30.000+00:00", "title": "商品", "level": 0, "sort": 0, "name": "pms", "icon": "product", "hidden": 0 }, { "id": 115, "parentId": 99, "createTime": "2021-08-21T02:36:15.000+00:00", "title": "商品列表", "level": 1, "sort": 0, "name": "product", "icon": "product-list", "hidden": 0 }, { "id": 117, "parentId": 0, "createTime": "2021-09-22T08:05:30.000+00:00", "title": "订单", "level": 0, "sort": 0, "name": "oms", "icon": "order", "hidden": 0 }, { "id": 118, "parentId": 0, "createTime": "2021-09-22T08:06:47.000+00:00", "title": "营销", "level": 0, "sort": 0, "name": "sms", "icon": "sms", "hidden": 0 }, { "id": 119, "parentId": 117, "createTime": "2021-09-22T08:13:54.000+00:00", "title": "订单列表", "level": 1, "sort": 0, "name": "order", "icon": "product-list", "hidden": 0 }, { "id": 120, "parentId": 117, "createTime": "2021-09-22T08:14:20.000+00:00", "title": "订单详情", "level": 1, "sort": 0, "name": "orderDetail", "icon": "orderDetail", "hidden": 1 }, { "id": 121, "parentId": 117, "createTime": "2021-09-22T08:14:56.000+00:00", "title": "发货列表", "level": 1, "sort": 0, "name": "deliverOrderList", "icon": "deliverOrderList", "hidden": 1 }, { "id": 122, "parentId": 117, "createTime": "2021-09-22T08:15:20.000+00:00", "title": "订单设置", "level": 1, "sort": 0, "name": "orderSetting", "icon": "order-setting", "hidden": 0 }, { "id": 123, "parentId": 117, "createTime": "2021-09-22T08:15:44.000+00:00", "title": "退货申请处理", "level": 1, "sort": 0, "name": "returnApply", "icon": "order-return", "hidden": 0 }, { "id": 124, "parentId": 117, "createTime": "2021-09-22T08:16:08.000+00:00", "title": "退货原因设置", "level": 1, "sort": 0, "name": "returnReason", "icon": "order-return-reason", "hidden": 0 }, { "id": 125, "parentId": 117, "createTime": "2021-09-22T08:16:26.000+00:00", "title": "退货原因详情", "level": 1, "sort": 0, "name": "returnApplyDetail", "icon": "returnApplyDetail", "hidden": 1 }]
        }
    },
    getters: {
        getNewMenus() {
            const newMenus: INewMenusList = {}
            const menus = this.menus
            for (let i = 0; i < menus.length; i++) {
                if (menus[i].parentId === 0) {
                    newMenus[menus[i].id] = menus[i]
                }
            }
            for (let i = 0; i < menus.length; i++) {
                if (menus[i].parentId !== 0) {
                    let parentId = menus[i].parentId
                    newMenus[parentId].children = newMenus[parentId].children || []
                    newMenus[parentId].children?.push(menus[i])
                }
            }
            return newMenus
        }
    },

    actions: {

    }
})



// todoList
interface ItodoList {
    id: number;
    text: string;
    finished: boolean;
    significant: boolean;
    desc: string;
    deadLine: string;
    createTime: string;
}

// form
interface IForm {
    text: string;
    desc: string;
    deadLine: string;
}

export const useTodoListStore = defineStore(Names.TODOLIST, () => {
    // state
    const state = reactive({
        todoList: JSON.parse(localStorage.getItem('myTodoList') as string) || [] as ItodoList[],
        searchVal: '',
        searchRes: [] as [] | ItodoList[],
        // editText: ''
    })
    // getters
    // 用于判断是否展示列表
    const todoListCount$ = computed(() => {
        return state.todoList.length
    })
    // 未完成事项
    const unfinishedTodoList$ = computed(() => {
        return state.todoList.filter((v: { finished: boolean }) => !v.finished)
    })
    // 已完成事项
    const finishedTodoList$ = computed(() => {
        return state.todoList.filter((v: { finished: boolean }) => v.finished)
    })
    // 已完成数量
    const finishedTodoListCount$ = computed(() => {
        return state.todoList.filter((v: { finished: boolean }) => v.finished).length
    })
    // 重要事项
    const SignificantCount$ = computed(() => {
        return state.todoList.filter((v: { significant: boolean }) => v.significant).length
    })
    const significant$ = computed(() => {
        return state.todoList.filter((v: { significant: boolean; }) => v.significant)
    })

    // actions
    // 添加待办事项
    let id = 1//此处id有问题
    function addItem(Val: string, significant: boolean): boolean {
        let inputVal = Val.trim()
        if (!inputVal) return false
        let index = state.todoList.findIndex((v: { text: string; }) => v.text === inputVal)
        if (index !== -1) return false
        state.todoList.unshift({ id: id++, text: inputVal, finished: false, significant: significant, desc: '', deadLine: '', createTime: getDate() })
        return true
    }
    // 删除
    function delItem(item: ItodoList): boolean {
        let index = state.todoList.findIndex((v: { id: number }) => v.id === item.id)
        if (index === -1) return false
        state.todoList.splice(index, 1)
        return true
    }
    // 修改待办事项
    function editItem(item: ItodoList, form: IForm): boolean {
        let index = state.todoList.findIndex((v: { id: number }) => v.id === item.id)
        if (index === -1) return false
        state.todoList.splice(index, 1, { ...item, text: form.text, desc: form.desc, deadLine: form.deadLine })
        return true
    }
    // 查找待办事项
    function searchItem(Val: string) {
        let val = Val.trim()
        if (!val) return 0
        let arr = state.todoList.filter((v: { text: string; }) => v.text.indexOf(val) !== -1)
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
        todoListCount$,
        unfinishedTodoList$,
        finishedTodoList$,
        finishedTodoListCount$,
        SignificantCount$,
        significant$,
        addItem,
        delItem,
        editItem,
        searchItem
    }
})