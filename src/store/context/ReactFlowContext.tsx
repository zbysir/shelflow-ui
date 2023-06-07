import {createContext, useState} from 'react'
import {ReactFlowInstance} from 'reactflow'



export const flowContext = createContext({
    reactFlowInstance: {} as ReactFlowInstance,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setReactFlowInstance: (instance: ReactFlowInstance): void => {
    }
})


export const ReactFlowContext = ({children}: { children: any }) => {
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>({} as ReactFlowInstance)
    return (
        <flowContext.Provider
            value={{
                reactFlowInstance,
                setReactFlowInstance
            }}
        >
            {children}
        </flowContext.Provider>
    )
}