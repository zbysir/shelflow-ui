import React, {useEffect} from 'react'
import {Box, Divider, Typography} from '@mui/material'
import MainCard from "../ui-components/card/MainCard";
import {styled, useTheme} from "@mui/material/styles";
import LabelComp from '../ui-components/label/Index'
import {INodeData, INodeParams} from "../../custom_types";
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import {flowContext} from "../../store/context/ReactFlowContext";
const CardWrapper = styled(MainCard)(({theme}: { theme: any }) => ({
    background: theme?.palette?.card?.main,
    color: theme?.darkTextPrimary,
    border: 'solid 1px',
    borderColor: theme?.palette.primary[200] + 75,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    '&:hover': {
        borderColor: theme?.palette.primary.main
    }
}));
export default function OutputNode({data}: { data: INodeData }) {
    const theme: any = useTheme()
    const {runResult} = React.useContext(flowContext)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <CardWrapper
        border={false}
        sx={{
            padding: 0,
            borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary
        }}
        content={false}
    >
        <Box
            sx={{padding: 1}}
        >
            <LabelComp name={data.name}></LabelComp>
        </Box>
        <Divider/>
        {data.input_anchors && data.input_anchors.map((inputAnchor: INodeParams, index: number) => (
            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} deleteInputAnchor={() => {
                data.input_anchors?.splice(index, 1)
            }}/>
        ))}
        <Box sx={{padding: 1, minHeight: 100, textAlign: 'center'}}>
            {<Typography variant="body1">
                {!runResult[data.id]?.result?.default && <span>run your flow to see data</span>}
                {runResult[data.id]?.result?.default}
            </Typography>}
        </Box>
        {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
            <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
        ))}
    </CardWrapper>
}