import {styled, useTheme} from "@mui/material/styles";
import MainCard from "../ui-components/card/MainCard";
import PropTypes from 'prop-types'
import {Box, Divider, Typography} from '@mui/material'
import NodeInputHandler from "./NodeInputHandler";
import NodeOutputHandler from "./NodeOutputHandler";
import AddKeyHandle from "./AddKeyHandle";
//  labelComp
import LabelComp from '../ui-components/label/Index'

import {INodeData, INodeParams} from '../../custom_types/index'
import {useSnackbar} from 'notistack';
import {flowContext, NodeStatus} from "../../store/context/ReactFlowContext";
import {useContext} from "react";
import LinearProgress from '@mui/material/LinearProgress';

export const CardWrapper = styled(MainCard)(({theme}: { theme: any }) => ({
    background: theme?.palette?.card?.main,
    color: theme?.darkTextPrimary,
    border: 'solid 1px',
    borderColor: theme?.palette.primary[200] + 75,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24);',
    '&:hover': {
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)'
    },
    transition: "box-shadow,border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
}));

export interface NodeStyle {
    borderColor?: string
    borderWidth?: number
    running?: boolean,
    header?: {
        color?: string,
        background?: string,
    }
}

export const getNodeRunStatusStyle = (runStatus: Record<string, NodeStatus>, nodeId: string): NodeStyle => {
    const s = runStatus[nodeId]
    console.log('s', s)

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
            break
    }
    return ns
}

export default function CanvasNode({data}: { data: INodeData }) {
    const theme: any = useTheme()
    const {enqueueSnackbar} = useSnackbar();
    const {updateNodeData, runResult} = useContext(flowContext)

    const nodeStyle = getNodeRunStatusStyle(runResult, data.id)
    const addAnchor = (item: INodeParams, key = 'input_anchors') => {
        const newData = {...data}
        if (item.key && item.type) {

            if (!newData[key]) {
                newData[key] = []
            }
            // 需要判断key是否存在
            if (newData[key].find((x: INodeParams) => x.key === item.key)) {
                enqueueSnackbar('key已存在', {variant: 'error'})
                return
            }
            newData[key].push(item)
        }
        // 更新nodeData
        updateNodeData(data.id, newData)
    }

    const delAnchor = (fieldKey: string, key = 'input_anchors') => {
        const newData = {...data}

        newData[key] = newData[key].filter((x: INodeParams) => x.key !== fieldKey)

        updateNodeData(data.id, newData)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <CardWrapper
        id={data.id}
        content={false}
        sx={{
            borderRadius: "8px",
            padding: 0,
            borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
            ...nodeStyle,
        }}
        border={false}>
        <Box sx={
            {
                background: "#f5f5f5",
                ...nodeStyle.header,
                position: "relative"
            }
        }>
            <LabelComp name={data.name} sx={{padding: 1}}></LabelComp>
            <div style={{position:"absolute", bottom: 0, width:"100%"}}>
                {
                    nodeStyle.running ? <LinearProgress color="success"/> : null
                }
            </div>

        </Box>
        {(data.input_params && data.input_params.length > 0) && (
            <>
                <Divider/>
                <Box sx={{background: theme.palette?.asyncSelect?.main, p: 1}}>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        Inputs
                    </Typography>
                </Box>
                <Divider/>
            </>
        )}
        {/*{data.input_anchors && data.input_anchors.map((inputAnchor: INodeParams, index: number) => (*/}
        {/*    <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} deleteInputAnchor={() => {*/}
        {/*        delAnchor(inputAnchor.key, 'input_anchors')*/}
        {/*    }}/>*/}
        {/*))}*/}
        {data.input_params && data.input_params.map((inputParam, index) => (
            <NodeInputHandler key={index} inputParam={inputParam} data={data}
                              deleteInputAnchor={() => {
                                  delAnchor(inputParam.key, 'input_params')
                              }}/>
        ))}

        {data.dynamic_input && <AddKeyHandle
            onSelect={(x: INodeParams) => {
                addAnchor(x, 'input_params')
            }}
        ></AddKeyHandle>}
        <Divider/>
        <Box sx={{background: theme?.palette?.asyncSelect?.main, p: 1}}>
            <Typography
                sx={{
                    fontWeight: 500,
                    textAlign: 'center'
                }}
            >
                Output
            </Typography>
        </Box>
        <Divider/>
        {data.output_anchors && data.output_anchors.map((outputAnchor, index) => (
            <NodeOutputHandler key={index} outputAnchor={outputAnchor} data={data}/>
        ))}
        {data.dynamic_output && <AddKeyHandle
            onSelect={(x: INodeParams) => {
                addAnchor(x, 'output_anchors')
            }}
        ></AddKeyHandle>}
    </CardWrapper>
}

CanvasNode.propTypes = {
    data: PropTypes.object
}