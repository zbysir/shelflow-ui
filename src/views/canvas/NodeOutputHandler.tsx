import PropTypes from 'prop-types'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useContext, useEffect, useRef, useState} from 'react'
//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeData, INodeParams} from '@/custom_types/index'
import {isValidConnection} from "@/utils/genericHelper";
import {flowContext} from "@/store/context/ReactFlowContext";


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


// ===========================|| NodeOutputHandler ||=========================== //
const NodeOutputHandler = ({outputAnchor, data}: { outputAnchor: INodeParams, data: INodeData }) => {
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const [position, setPosition] = useState(0)
    const {reactFlowInstance, runResult} = useContext(flowContext)

    useEffect(() => {
        if (ref.current) {
            const dom = ref.current as HTMLElement
            if (ref.current && dom.offsetTop && dom.clientHeight) {
                setTimeout(() => {
                    setPosition(dom.offsetTop + dom.clientHeight / 2)
                    updateNodeInternals(data.id)
                }, 0)
            }
        }
    }, [data.id, ref, updateNodeInternals, data.input_params?.length, data.output_anchors?.length])

    useEffect(() => {
        setTimeout(() => {
            updateNodeInternals(data.id)
        }, 0)
    }, [data.id, position, updateNodeInternals])

    return (
        <div className="relative" ref={ref}>
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Handle
                                type='source'
                                position={Position.Right}
                                key={outputAnchor.key}
                                id={outputAnchor.key}
                                isValidConnection={(connection) => isValidConnection(connection, outputAnchor, 'source', reactFlowInstance)}
                                style={{
                                    height: 10,
                                    width: 10,
                                    // top: position
                                }}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                            {outputAnchor.type}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="p-2 text-end">
                    <LabelComp
                        className="mr-2"
                        name={outputAnchor.name}
                        defaultValue={outputAnchor.key}></LabelComp>
                </div>
            </>
        </div>
    )
}

NodeOutputHandler.propTypes = {
    outputAnchor: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool
}

export default NodeOutputHandler
