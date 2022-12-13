import http from './http'

export const loginApi = (data: any): any => http.post('/login', data)
