import axios from 'axios'

const http = axios.create({
    baseURL: '',
    timeout: 2000
})

http.interceptors.request.use(config => {
    let token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = token
    }
    return config
}, err => {
    return Promise.reject(err)
})


http.interceptors.response.use(res => {
    return res.data
}, err => {
    return Promise.reject(err)
})

export default http