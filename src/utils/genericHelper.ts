import {INodeParams, INodeData, NodeAnchor, INode, FlowData, Graph} from '../custom_types/index'
import {ReactFlowJsonObject, Edge} from 'reactflow'

export const getUniqueNodeId = () => {
    return Math.random().toString(36).substr(2, 9);
}

export const initializeDefaultNodeData = (nodeParams: INodeParams[], inputs: Record<string, any>) => {
    const initialValues: Record<string, any>= {}

    for (let i = 0; i < nodeParams.length; i += 1) {
        const input = nodeParams[i]
        initialValues[input.key] = inputs[input.key] || ''
    }

    return initialValues
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
    data.graph.nodes = data.graph.nodes.map((node: INodeData) => {
        const inputAnchors = node.data.input_params?.filter(item => item.input_type === 'anchor')
        console.log('inputAnchors:', inputAnchors);
        inputAnchors?.forEach(item => {
            if (item.anchors && item.anchors.length) {
                item.anchors.forEach((anchor: NodeAnchor) => {
                    // source+sourceHandle+target+targetHandle
                    const edgeId = 'reactflow__edge-' + anchor.node_id + anchor.output_key + '-' + node.id + item.key;
                    if (!(edges.find(item => item.id === edgeId))) {
                        edges.push({
                            id: 'reactflow__edge-' + anchor.node_id + anchor.output_key + '-' + node.id + item.key,
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
        const NodeType = node.type === 'output' ? 'outputNode' : 'customNode'
        return {
            ...node,
            type: NodeType,
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


export const edgeToData = (flow: Graph) => {
    flow.nodes = flow.nodes.map((node: INodeData) => {
        return {
            ...node,
            type: node.data.type,
        }
    })
    flow.edges?.forEach((edge: Edge) => {
        const target = flow.nodes.find((node: INodeData) => node.id === edge.target)
        // source|sourceHandle |target|targetHandle
        const inputParams = target.data.input_params.find((inputParam: INodeParams) => inputParam.key === edge.targetHandle)
        if (inputParams.input_type === 'anchor') {

            if (!inputParams.anchors) {
                inputParams.anchors = []
            }

            const one = inputParams.anchors.find(item => {
                return item.node_id === edge.source && item.output_key === edge.sourceHandle
            })
            if (!one) {
                inputParams.anchors.push({
                    node_id: edge.source,
                    output_Key: edge.sourceHandle
                })
            }
        }
    })


    return flow
}


export const isValidConnection = (connection: any, inputAnchor: INodeParams, start: string, reactFlowInstance: any): boolean => {
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