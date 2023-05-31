import axios from './http'


export const getFlowList = (params: any): Promise<any> => {
    return axios.get('/flow', {
        params
    })
}

export const getFlow = (id: string): Promise<any> => {
    return axios.get(`/flow`, {
        params: { id: id}
    })
}

