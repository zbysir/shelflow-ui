export const getUniqueNodeId = () => {
    return Math.random().toString(36).substr(2, 9);
}


export const initializeDefaultNodeData = (nodeParams: any[]) => {
    const initialValues = {}

    for (let i = 0; i < nodeParams.length; i += 1) {
        const input = nodeParams[i]
        initialValues[input.key] = input.default || ''
    }

    return initialValues

}


export const initNode = (nodeData: any, id: string) => {
    nodeData.id = id;
    if (nodeData.input_params) {
        nodeData.input_params.forEach((inputParam: any) => {
            inputParam.id = getUniqueNodeId();
        })
        nodeData.inputs = initializeDefaultNodeData(nodeData.input_params)
    } else {
        nodeData.inputs = {};
        nodeData.input_params = []
    }
    return nodeData
}


export const flowDetail = (data: any) => {
    const edges: any = []
    data.graph.nodes = data.graph.nodes.map((node: any) => {
        if (node.data.input_anchors && node.data.inputs) {
            node.data.input_anchors.forEach((one: any) => {
                const key = one.key;
                const item = node.data.inputs[key]
                console.log('key:', key, item);
                if (item) {
                    edges.push({
                        id: 'reactflow__edge-' + key.replace('.', '') + '-' + node.id + item.split('.')[0],
                        source: item.split('.')[0],
                        target: node.id,
                        sourceHandle: item.split('.')[1],
                        targetHandle: key
                    })
                }
            })

        }
        return {
            ...node,
            type: 'customNode',
            data: {
                ...node.data,
                id: node.id,
                type: node.type
            }
        }


    })
    data.graph.edges = edges;
    return data
}


export const edgeToData = (flow: any) => {
    flow.nodes = flow.nodes.map((node: any) => {
        return {
            ...node,
            type: node.data.type,
        }
    })
    flow.edges.forEach((edge: any) => {
        const target = flow.nodes.find((node: any) => node.id === edge.target)
        // TODO:删除的边的情况需要处理
        target.data.inputs[edge.targetHandle] = [edge.source, edge.sourceHandle].join('.')
    })
    return flow
}