import axios from './http'


export const getFlowList = (params: any): Promise<any> => {
    return axios.get('/flow', {
        params
    })
}

export const getFlow = (id: string): Promise<any> => {
    return axios.get(`/flow_one`, {params: {id: id}})
}

export const addFlow = (data: any): Promise<any> => {
    return axios.post('/flow', data)
}


export default {
    getFlowList,
    getFlow,
    addFlow
}
