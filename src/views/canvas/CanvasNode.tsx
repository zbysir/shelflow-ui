import PropTypes from 'prop-types'
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import AddKeyHandle from "./AddKeyHandle";
//  labelComp
import LabelComp from '../ui-components/label/Index'

import {INodeData, INodeParams, NodeAnchor} from '@/custom_types/index'
import {useSnackbar} from 'notistack';
import {flowContext} from "@/store/context/ReactFlowContext";
import React, {useContext} from "react";
import {buildEdgeId} from "@/utils/genericHelper";


import {Card, CardContent, CardHeader,} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"

const showResult = (result: any) => {
    const type = typeof result;
    switch (type) {
        case 'string':
        case 'number':
        case 'boolean':
            return result
        case 'object':
            return JSON.stringify(result)
        default:
            return result
    }
}

interface NodeStatusProps {
    status: "" | "success" | "running" | "failed"
}

function NodeStatusIcon(props: NodeStatusProps) {
    const cla: Record<NodeStatusProps["status"], string> = {
        success: "bg-green-600",
        running: "bg-green-600 animate-pulse duration-1000",
        failed: "bg-destructive",
        [""]: "bg-secondary-foreground/40"
    }
    const status = props.status || ''
    return <div className={`w-3 h-3 ${cla[status]} rounded-xl`}></div>
}

function CanvasNode({data}: { data: INodeData }) {
    const {enqueueSnackbar} = useSnackbar();
    const {updateNodeData, runResult, onlyDeleteEdge} = useContext(flowContext)
    const [cardKey, setCardKey] = React.useState(Date.now())

    const nodeStatus = runResult[data.id]
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
                onlyDeleteEdge(edgeId);
            })
        }

        newData[key] = newData[key].filter((x: INodeParams) => x.key !== fieldKey)
        updateNodeData(data.id, newData)
    }

    const changeParam = (index: number, params: INodeParams, type?: string) => {
        console.log('changeParam params:', params);
        const newData = {...data}
        newData.input_params[index] = params
        updateNodeData(data.id, newData)
        // 重新渲染(当inputParam类型切换时，会影响到其他node的位置，所以直接重新渲染整个CustomNode节点即可)
        if (type === 'swapNode') {
            setCardKey(Date.now())
        }
    }
    return <Card id={data.id}
                 key={cardKey}
                 className="border border-solid shadow-md
                 border-gray-300 hover:shadow-xl w-60 dark:bg-secondary">
        <CardHeader className='p-0 cursor-move'>
            <div className="bg-[#e8e8e8] relative p-1.5 rounded-t-lg">
                <div className={"flex items-center space-x-1.5"}>
                    <NodeStatusIcon status={nodeStatus?.status}/>
                    <LabelComp name={data.name} className={"text-sm"}/>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col px-3 pt-0.5 pb-1.5 nodrag">
            {
                data.input_params && data.input_params.map((inputParam, index) => (
                    <NodeInputHandler
                        key={index} inputParam={inputParam} nodeId={data.id}
                        changeParam={(param, type) => changeParam(index, param, type)}
                        deleteInputAnchor={() => {
                            delAnchor(inputParam.key, 'input_params')
                        }}
                    />
                ))
            }
            {data.dynamic_input && <AddKeyHandle
                onSelect={(x: INodeParams) => {
                    addAnchor(x, 'input_params')
                }}
            ></AddKeyHandle>}

            {data.type === 'output' ? <div className="p-1  text-center" style={{'minHeight': '100px'}}>
                <p>
                    {showResult(runResult[data.id]?.result?.default) || <span>run your flow to see data</span>}
                </p>
            </div> : null
            }
            {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
                <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
            ))}
            {data.dynamic_output && <AddKeyHandle
                onSelect={(x: INodeParams) => {
                    addAnchor(x, 'output_anchors')
                }}
            ></AddKeyHandle>}
            {
                nodeStatus?.error ?
                    <div className={""}>
                        <Separator className={"my-1.5"}></Separator>
                        <div className="text-xs font-medium text-destructive ">
                            {nodeStatus.error}
                        </div>
                    </div> : null
            }
        </CardContent>
    </Card>
}

export default React.memo(CanvasNode)

CanvasNode.propTypes = {
    data: PropTypes.object
}