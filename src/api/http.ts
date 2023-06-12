import axios, {AxiosResponse} from 'axios'

let baseURL = `https://${import.meta.env.VITE_HOST}/api`;

// window.__service_host__ = {api: 'http://localhost::9433', ws: 'ws://localhost::9433'}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const service_host = window.__service_host__
if (service_host) {
    baseURL = `${service_host.api}/api`
}

axios.defaults.baseURL = baseURL
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