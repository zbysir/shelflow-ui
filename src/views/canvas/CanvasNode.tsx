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

export default function CanvasNode({data}: { data: INodeData }) {
    const theme: any = useTheme()
    const {enqueueSnackbar} = useSnackbar();
    const addInputAnchor = (item: INodeParams) => {
        if (item.key && item.type) {

            if (!data.input_anchors) {
                data.input_anchors = []
            }
            // 需要判断key是否存在
            if (data.input_anchors.find((x: INodeParams) => x.key === item.key)) {
                enqueueSnackbar('key已存在', {variant: 'error'})
                return
            }
            data?.input_anchors?.push(item)
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <CardWrapper
        content={false}
        sx={{
            padding: 0,
            borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary
        }}
        border={false}>
        <Box sx={{padding: 1}}>
            <LabelComp name={data.name}></LabelComp>
        </Box>
        {(data.input_anchors && data.input_anchors.length > 0 || data.input_params && data.input_params.length > 0) && (
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
        {data.input_anchors && data.input_anchors.map((inputAnchor: INodeParams, index: number) => (
            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} deleteInputAnchor={() => {
                data.input_anchors?.splice(index, 1)
                // TODO：如果inputs有值，需要删除，后期会删除inputs，所以先不处理
            }}/>
        ))}
        {data.input_params && data.input_params.map((inputParam, index) => (
            <NodeInputHandler key={index} inputParam={inputParam} data={data}/>
        ))}

        {data.dynamic_input && <AddKeyHandle
            onSelect={(x: INodeParams) => {
                addInputAnchor(x)
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
    </CardWrapper>
}

CanvasNode.propTypes = {
    data: PropTypes.object
}