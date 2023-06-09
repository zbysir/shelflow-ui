import {createContext, useState, ReactNode} from 'react'
import {ReactFlowInstance} from 'reactflow'
import {INodeData} from "../../custom_types";



export const flowContext = createContext({
    reactFlowInstance: {} as ReactFlowInstance,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setReactFlowInstance: (instance: ReactFlowInstance): void => {
    },
    updateNodeData: (id: string, data: INodeData): void => {}
})


export const ReactFlowContext = ({children}: { children: ReactNode }) => {
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>({} as ReactFlowInstance)

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
    return (
        <flowContext.Provider
            value={{
                reactFlowInstance,
                setReactFlowInstance,
                updateNodeData,
            }}
        >
            {children}
        </flowContext.Provider>
    )
}