import {INodeParams, INodeData, NodeAnchor} from '../custom_types/index'
import {ReactFlowJsonObject, Node, Edge} from 'reactflow'

export const getUniqueNodeId = () => {
    return Math.random().toString(36).substr(2, 9);
}


export const initializeDefaultNodeData = (nodeParams: INodeParams[], inputs: { [propName: string]: any; }) => {
    const initialValues: { [propName: string]: any; } = {}

    for (let i = 0; i < nodeParams.length; i += 1) {
        const input = nodeParams[i]
        initialValues[input.key] = inputs[input.key] || ''
    }

    return initialValues

}


export const initNode = (nodeData: INodeData, id: string) => {
    nodeData.id = id;
    if (nodeData.input_params) {
        nodeData.input_params.forEach((inputParam: any) => {
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


export const flowDetail = (data: any) => {
    const edges: any = []
    data.graph.nodes = data.graph.nodes.map((node: Node) => {
        const inputAnchors = node.data.input_params.filter(item => item.input_type === 'anchor')
        console.log('inputAnchors:', inputAnchors);
        inputAnchors.forEach(item => {
            if (item.anchors && item.anchors.length) {
                item.anchors.forEach((anchor: NodeAnchor) => {
                    // source+sourceHandle+target+targetHandle
                    edges.push({
                        id: 'reactflow__edge-' + anchor.node_id + anchor.output_key + '-' + node.id + item.key,
                        source: anchor.node_id,
                        target: node.id,
                        sourceHandle: anchor.output_key,
                        targetHandle: item.key
                    })
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


export const edgeToData = (flow: ReactFlowJsonObject) => {
    flow.nodes = flow.nodes.map((node: Node) => {
        return {
            ...node,
            type: node.data.type,
        }
    })
    flow.edges.forEach((edge: Edge) => {
        const target = flow.nodes.find((node: Node) => node.id === edge.target)
        // source|sourceHandle |target|targetHandle
        const inputParams = target.data.input_params.find((inputParam: INodeParams) => inputParam.key === edge.targetHandle)
        if (inputParams.input_type === 'anchor') {

            inputParams.anchors = []
            inputParams.anchors.push({
                node_id: edge.source,
                output_Key: edge.sourceHandle
            })
        }
    })
    // TODO:删除的边的情况需要处理
    // if (target && edge.targetHandle) {
    //     target.data.inputs[edge.targetHandle] = [edge.source, edge.sourceHandle].join('.')
    // }

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