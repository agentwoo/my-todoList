import { ElMessage, ElMessageBox } from 'element-plus'

// 删除弹框
export function delDialog(msg: string, title: string): Promise<boolean> {
    return new Promise((resolve) => {
        const opts = {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
        }
        ElMessageBox.confirm(msg, title, opts)
            .then(() => { resolve(true) })
            .catch(() => { resolve(false) })
    })
}


// 成功提示
export function successMessage(msg: string) {
    ElMessage.success(msg)
}

// 错误提示
export function errMessage(msg: string) {
    ElMessage.error(msg)
}


// 获取当天日期
export function getDate() {
    let date = new Date()
    let M = date.getMonth() + 1
    M = (M < 10 ? `0${M}` : M) as number
    let D = date.getDate()
    D = (D < 10 ? `0${D}` : D) as number
    let X = date.getDay()
    let arr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    let now = `${M}月${D}日，${arr[X]}`
    return now
}

