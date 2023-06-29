import {createContext, ReactNode, useState} from 'react'
import {ReactFlowInstance} from 'reactflow'
import {INodeData, INodeParams, NodeAnchor} from "@/custom_types";


export interface NodeStatus {
    status: "running" | "failed" | "success",
    result?: Record<string, any>,
    error?:string
}

export const flowContext = createContext({
    reactFlowInstance: {} as ReactFlowInstance,
    runResult: {} as Record<string, NodeStatus>,
    setReactFlowInstance: (instance: ReactFlowInstance): void => {
    },
    updateNodeData: (id: string, data: INodeData): void => {
    },
    setRunResult: (result: any): void => {
    },
    deleteEdge: (id: string): void => {
    },
    deleteNode: (id: string): void => {
    },
    onlyDeleteEdge: (id: string): void => {
    }
})


export const ReactFlowContext = ({children}: { children: ReactNode }) => {
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>({} as ReactFlowInstance)
    const [runResult, setRunResult] = useState<{ [propName: string]: any; }>({})
    const updateNodeData = (id: string, data: INodeData) => {
        console.log('updateNodeData:', id, data);
        reactFlowInstance.setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                console.log('updateNodeData node:', node, id, node.id === id);
                if (node.id === id) {
                    node.data = data
                }
                return node
            })
        })
    }

    const onlyDeleteEdge = (id: string) => {
        reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter((edge) => edge.id !== id))
    }
    const deleteEdge = (id: string) => {
        deleteConnectedAnchor(id, 'edge')
        reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter((edge) => edge.id !== id))
    }

    const deleteNode = (nodeId: string) => {
        deleteConnectedAnchor(nodeId, 'node')
        reactFlowInstance.setNodes(reactFlowInstance.getNodes().filter((n) => n.id !== nodeId))
        reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter((ns) => ns.source !== nodeId && ns.target !== nodeId))
    }

    const deleteConnectedAnchor = (id: string, type: 'node' | 'edge') => {
        const connectedEdges =
            type === 'node'
                ? reactFlowInstance.getEdges().filter((edge) => edge.source === id)
                : reactFlowInstance.getEdges().filter((edge) => edge.id === id)
        console.log('deleteConnectedAnchor:', connectedEdges);

        for (const edge of connectedEdges) {
            reactFlowInstance.setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === edge.target) {
                        const inputParams = node.data.input_params.find((inputParam: INodeParams) => inputParam.key === edge.targetHandle)
                        const index = inputParams.anchors.findIndex((item: NodeAnchor) => {
                            return item.node_id === edge.source && item.output_key === edge.sourceHandle
                        })
                        inputParams.anchors.splice(index, 1)
                    }
                    return node
                })
            )
        }
    }

    return (
        <flowContext.Provider
            value={{
                reactFlowInstance,
                runResult,
                setReactFlowInstance,
                updateNodeData,
                setRunResult,
                onlyDeleteEdge,
                deleteEdge,
                deleteNode
            }}
        >
            {children}
        </flowContext.Provider>
    )
}