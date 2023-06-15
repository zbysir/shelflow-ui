import React from 'react'
import {Box, Divider, Typography} from '@mui/material'
import {useTheme} from "@mui/material/styles";
import LabelComp from '../ui-components/label/Index'
import {INodeData} from "../../custom_types";
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import {flowContext} from "../../store/context/ReactFlowContext";
import {CardWrapper, getNodeRunStatusStyle} from "./CanvasNode.tsx";

export default function OutputNode({data}: { data: INodeData }) {
    const theme: any = useTheme()
    const {runResult} = React.useContext(flowContext)
    const nodeStyle = getNodeRunStatusStyle(runResult, data.id)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <CardWrapper
        border={false}
        sx={{
            padding: 0,
            borderRadius: "8px",
            borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
            ...nodeStyle,
        }}
        content={false}
    >
        <Box
            sx={{
                background: "#f5f5f5",
                ...nodeStyle.header,
                position: "relative"
            }}
        >
            <LabelComp name={data.name} sx={{padding: 1}}></LabelComp>
        </Box>

        <Divider/>
        {data.input_params && data.input_params.map((inputParam, index) => (
            <NodeInputHandler key={index} inputParam={inputParam} data={data}/>
        ))}
        <Box sx={{padding: 1, minHeight: 100, textAlign: 'center'}}>
            {<Typography variant="body1">
                {runResult[data.id]?.result?.default || <span>run your flow to see data</span>}
            </Typography>}
        </Box>
        {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
            <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
        ))}
    </CardWrapper>
}