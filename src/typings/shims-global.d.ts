declare global {
    /** 工具方法 */

    /** 后端注入全局 G 数据 */
    interface Window {
        G: {
            server_date: string
            server_time: numbeer
            user: $api.$pv_user
            tasks: $api.$dd_task[]
            task_cates: $api.$dd_task_cate[]
        }
    }
}

export { }