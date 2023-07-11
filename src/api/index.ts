import axios from './http'


export const flowChat = (data: {
    id: string;
    params: {
        query: string
    };
    output_node_id: string
}) => {
    return axios.post('/flow/run_sync', data)
}

export default {
    getFlowList: (params: any): Promise<any> => {
        return axios.get('/flow', {
            params
        })
    },
    getFlow: (id: string): Promise<any> => {
        return axios.get(`/flow_one`, {params: {id: id}})
    },
    addFlow: (data: any): Promise<any> => {
        return axios.post('/flow', data)
    },
    editFlow: (data: any): Promise<any> => axios.put('/flow', data),
    getComps: (params: any): Promise<any> => {
        return axios.get('/component', {
            params
        })
    },
    runFlow: (data: { id?: number, graph?: any, parallel?: number }): Promise<any> => {
        if (!data.parallel) {
            data.parallel = 10
        }
        return axios.post('/flow/run', data)
    }
}
