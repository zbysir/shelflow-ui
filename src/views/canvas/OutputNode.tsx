import React from 'react'
import LabelComp from '../ui-components/label/Index'
import {INodeData} from "@/custom_types";
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import {flowContext} from "@/store/context/ReactFlowContext";
import {getNodeRunStatusStyle} from "./CanvasNode.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// WIP
export default function OutputNode({data}: { data: INodeData }) {
    const {runResult} = React.useContext(flowContext)
    const nodeStyle = getNodeRunStatusStyle(runResult, data.id)

    return <Card className="border border-solid border-color shadow-md hover:shadow-xl w-[300px] overflow-hidden"
                 style={{borderColor: nodeStyle.borderColor}}>
        <CardHeader className="p-0">
            <div className="bg-gray-100 relative p-2 dark:bg-gray-950"
                 style={nodeStyle.header}>
                <LabelComp name={data.name}></LabelComp>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            {data.input_params && data.input_params.map((inputParam, index) => (
                <NodeInputHandler key={index} inputParam={inputParam} nodeId={data.id}/>
            ))}
            <div className="p-1  text-center"
                 style={{'minHeight': '100px'}}>
                <p>
                    {runResult[data.id]?.result?.default || <span>run your flow to see data</span>}
                </p>
            </div>
            {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
                <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
            ))}
        </CardContent>
    </Card>
}