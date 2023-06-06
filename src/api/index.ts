import axios from './http'


export const getFlowList = (params: any): Promise<any> => {
    return axios.get('/flow', {
        params
    })
}

export const getFlow = (id: string): Promise<any> => {
    return axios.get(`/flow_one`, {params: {id: id}})
}

export const editFlow = (data: any): Promise<any> => axios.put('/flow', data)

export const addFlow = (data: any): Promise<any> => {
    return axios.post('/flow', data)
}


export const getComps = (params: any): Promise<any> => {
    return axios.get('/component', {
        params
    })
}

export default {
    getFlowList,
    getFlow,
    addFlow,
    editFlow,
    getComps
}
