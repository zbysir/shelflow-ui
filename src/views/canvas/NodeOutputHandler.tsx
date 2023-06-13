import PropTypes from 'prop-types'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useContext, useEffect, useRef, useState} from 'react'

// material-ui
import {styled, useTheme} from '@mui/material/styles'
import {Box, Tooltip} from '@mui/material'
import {tooltipClasses} from '@mui/material/Tooltip'

//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeData, INodeParams} from '../../custom_types/index'
import {isValidConnection} from "../../utils/genericHelper";
import {flowContext} from "../../store/context/ReactFlowContext";
import {getNodeRunStatusStyle} from "./CanvasNode.tsx";

const CustomWidthTooltip = styled(({className, ...props}: any) => <Tooltip {...props} classes={{popper: className}}/>)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})

// ===========================|| NodeOutputHandler ||=========================== //
const NodeOutputHandler = ({outputAnchor, data}: { outputAnchor: INodeParams, data: INodeData }) => {
    const theme = useTheme()
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
        <div ref={ref}>
            <>
                <CustomWidthTooltip placement='right' title={outputAnchor.type}>
                    <Handle
                        type='source'
                        position={Position.Right}
                        key={outputAnchor.key}
                        id={outputAnchor.key}
                        isValidConnection={(connection) => isValidConnection(connection, outputAnchor, 'source', reactFlowInstance)}
                        style={{
                            height: 10,
                            width: 10,
                            backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                            top: position
                        }}
                    />
                </CustomWidthTooltip>
                <Box sx={
                    {
                        p: 2,
                        textAlign: 'end',
                    }
                }>
                    <LabelComp
                        name={outputAnchor.name}
                        defaultValue={outputAnchor.key}></LabelComp>
                </Box>
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
