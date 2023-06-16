import PropTypes from 'prop-types'
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import AddKeyHandle from "./AddKeyHandle";
//  labelComp
import LabelComp from '../ui-components/label/Index'

import {INodeData, INodeParams, NodeAnchor} from '@/custom_types/index'
import {useSnackbar} from 'notistack';
import {flowContext, NodeStatus} from "@/store/context/ReactFlowContext";
import React, {useContext} from "react";
import LinearProgress from '@mui/material/LinearProgress';
import {buildEdgeId} from "@/utils/genericHelper";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"

export interface NodeStyle {
    borderColor?: string
    borderWidth?: number
    running?: boolean,
    header?: {
        color?: string,
        background?: string,
    },
    errorMsg?: string
}

export const getNodeRunStatusStyle = (runStatus: Record<string, NodeStatus>, nodeId: string): NodeStyle => {
    const s = runStatus[nodeId]

    const ns: NodeStyle = {}
    if (!s) {
        return ns
    }
    // ns.borderWidth = 2
    switch (s.status) {
        case 'success':
            ns.borderColor = "#388e3c"
            ns.header = {
                color: "#fff",
                background: "#388e3c"
            }
            break
        case 'running':
            ns.borderColor = "#00e676"
            ns.header = {
                color: "#fff",
                background: "#00e676"
            }
            ns.running = true
            break
        case 'failed':
            ns.borderColor = "red"
            ns.errorMsg = s.error
            break
    }
    return ns
}

export default function CanvasNode({data}: { data: INodeData }) {
    const {enqueueSnackbar} = useSnackbar();
    const {updateNodeData, runResult, deleteEdge} = useContext(flowContext)

    const nodeStyle = getNodeRunStatusStyle(runResult, data.id)
    const addAnchor = (item: INodeParams, key = 'input_anchors') => {
        const newData = {...data}
        if (item.key && item.type) {

            if (!newData[key]) {
                newData[key] = []
            }
            // 需要判断key是否存在
            if (newData[key].find((x: INodeParams) => x.key === item.key)) {
                enqueueSnackbar('key 已存在', {variant: 'error'})
                return
            }
            newData[key].push(item)
        }
        // 更新nodeData
        updateNodeData(data.id, newData)
    }

    const delAnchor = (fieldKey: string, key = 'input_params') => {
        const newData = {...data}
        // 如果连线了，需要去删除连线
        const inputAnchor = newData[key].find((x: INodeParams) => x.key === fieldKey)
        if (inputAnchor && inputAnchor.anchors) {
            inputAnchor.anchors.forEach((anchor: NodeAnchor) => {
                const edgeId = buildEdgeId(anchor.node_id, anchor.output_key, data.id, fieldKey)
                deleteEdge(edgeId);
            })
        }

        newData[key] = newData[key].filter((x: INodeParams) => x.key !== fieldKey)
        updateNodeData(data.id, newData)
    }

    return <Card id={data.id}
                 className="border border-solid shadow-md
                 border-color hover:shadow-xl w-[300px] overflow-hidden dark:bg-secondary"
                 style={{borderColor: nodeStyle.borderColor}}>
        <CardHeader className='p-0'>
            <div className="bg-gray-100 relative p-2 dark:bg-background"
                 style={nodeStyle.header}>
                <LabelComp name={data.name}></LabelComp>
                <div style={{position: "absolute", bottom: 0, width: "100%"}}>
                    {
                        nodeStyle.running ? <LinearProgress color="success"/> : null
                    }
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            {data.input_params && data.input_params.map((inputParam, index) => (
                <NodeInputHandler
                    key={index} inputParam={inputParam} data={data}
                    deleteInputAnchor={() => {
                        delAnchor(inputParam.key, 'input_params')
                    }}/>
            ))}
            {data.dynamic_input && <AddKeyHandle
                onSelect={(x: INodeParams) => {
                    addAnchor(x, 'input_params')
                }}
            ></AddKeyHandle>}
            <Separator></Separator>
            {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
                <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
            ))}
            {data.dynamic_output && <AddKeyHandle
                onSelect={(x: INodeParams) => {
                    addAnchor(x, 'output_anchors')
                }}
            ></AddKeyHandle>}
            {
                nodeStyle.errorMsg ?
                    <>
                        <Separator></Separator>
                        <div className="p-2">
                            <p className="text-start font-medium" style={{'color': '#d04e4e'}}>
                                {nodeStyle.errorMsg}
                            </p>
                        </div>
                    </> : null
            }
        </CardContent>
    </Card>
}

CanvasNode.propTypes = {
    data: PropTypes.object
}