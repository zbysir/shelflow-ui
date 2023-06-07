import axios, {AxiosResponse} from 'axios'

axios.defaults.baseURL = 'https://writeflow.bysir.top/api'

axios.interceptors.request.use((config: any) => {
    return config
})

axios.interceptors.response.use((res: AxiosResponse) => {
    if (res.status !== 200) {
        return Promise.reject(res.data)
    }
    return res.data;
}, (error: any) => {
    return Promise.reject(error.response.data)
})

export default axios