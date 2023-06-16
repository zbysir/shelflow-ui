import {INodeParams, INodeData, NodeAnchor, FlowData, Graph} from '../custom_types/index'
import {ReactFlowJsonObject, Edge, Node, Connection} from 'reactflow'

export const getUniqueNodeId = () => {
    return Math.random().toString(36).substr(2, 9);
}

export const initializeDefaultNodeData = (nodeParams: INodeParams[], inputs: Record<string, any>) => {
    const initialValues: Record<string, any> = {}

    for (let i = 0; i < nodeParams.length; i += 1) {
        const input = nodeParams[i]
        initialValues[input.key] = inputs[input.key] || ''
    }

    return initialValues
}

export const buildEdgeId = (source: string, sourceHandle: string, target: string, targetHandle: string) => {
    return 'reactflow__edge-' + source + sourceHandle + '-' + target + targetHandle;
}
export const initNode = (nodeData: INodeData, id: string) => {
    nodeData.id = id;
    if (nodeData.input_params) {
        nodeData.input_params.forEach((inputParam: INodeParams) => {
            inputParam.id = getUniqueNodeId();
        })
        nodeData.inputs = initializeDefaultNodeData(nodeData.input_params, nodeData.inputs || {})
    } else {
        nodeData.inputs = {};
        nodeData.input_params = []
    }
    if (!nodeData.input_anchors) {
        nodeData.input_anchors = []
    }
    return nodeData
}


export const flowDetail = (data: FlowData) => {
    const edges: Edge[] = []
    data.graph.nodes = (data.graph.nodes || []).map((node: Node) => {
        const inputAnchors = node.data.input_params?.filter((item: INodeParams) => item.input_type === 'anchor')

        inputAnchors?.forEach((item: INodeParams) => {
            if (item.anchors && item.anchors.length) {
                item.anchors.forEach((anchor: NodeAnchor) => {
                    // source+sourceHandle+target+targetHandle
                    const edgeId = buildEdgeId(anchor.node_id, anchor.output_key, node.id, item.key);
                    if (!(edges.find(item => item.id === edgeId))) {
                        edges.push({
                            id: edgeId,
                            source: anchor.node_id,
                            target: node.id,
                            sourceHandle: anchor.output_key,
                            targetHandle: item.key
                        })
                    }
                })
            }
        })

        console.log('flowDetail edges', edges)
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



// 将edge转换为转化到data.inputs
export const edgeToData = (flow: ReactFlowJsonObject) => {
    flow.nodes = flow.nodes.map((node: Node) => {
        if (node.data.input_params && node.data.input_params.length) {
            node.data.input_params.forEach((inputParam: INodeParams) => {
                if (inputParam.input_type === 'anchor') {
                    inputParam.anchors = []
                }
            })
        }
        return {
            ...node,
            type: node?.data?.type,
        }
    })
    flow.edges?.forEach((edge: Edge) => {
        const target = flow.nodes.find((node: Node) => node.id === edge.target)
        // source|sourceHandle |target|targetHandle
        const inputParams = target?.data.input_params.find((inputParam: INodeParams) => inputParam.key === edge.targetHandle)
        if (inputParams && inputParams.input_type === 'anchor') {

            if (!inputParams.anchors) {
                inputParams.anchors = []
            }

            const one = inputParams.anchors.find((item: NodeAnchor) => {
                return item.node_id === edge.source && item.output_key === edge.sourceHandle
            })
            if (!one) {
                inputParams.anchors.push({
                    node_id: edge.source,
                    output_key: edge.sourceHandle
                })
            }
        }
    })


    return flow
}


export const isValidConnection = (connection: Connection, inputAnchor: INodeParams, start: string, reactFlowInstance: any): boolean => {
    console.log('reactFlowInstance:', reactFlowInstance)
    if (inputAnchor.type === 'any') {
        return true
    }
    const flow = reactFlowInstance.toObject();
    let node = null, handle = null
    if (start === 'source') {
        node = flow.nodes.find((node: any) => node.id === connection.target);
        handle = node?.data?.input_params?.find((anchor: any) => anchor.key === connection.targetHandle);
    } else {
        node = flow.nodes.find((node: any) => node.id === connection.source);
        handle = node?.data?.output_anchors?.find((anchor: any) => anchor.key === connection.sourceHandle);
    }

    if (handle && handle.type === 'any') {
        return true
    }
    return handle?.type === inputAnchor.type
}

export const isConnectable = (inputParam: INodeParams) => {
    // console.log('isConnectable inputParam:', inputParam)
    if (inputParam.list) {
        return true
    } else {
        // console.log('isConnectable1111',!inputParam.anchors || inputParam.anchors && inputParam.anchors.length <= 1)
        return !inputParam.anchors || inputParam.anchors && inputParam.anchors.length <= 1
    }
}