import PropTypes from 'prop-types'
import {Box, Tooltip, Stack, IconButton} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles'
import {tooltipClasses} from '@mui/material/Tooltip'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useState, useEffect, useRef, useContext} from 'react'
import {Input} from '../ui-components/input/Index'
import {flowContext} from "../../store/context/ReactFlowContext";
import {isValidConnection} from '../../utils/genericHelper'
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const CustomWidthTooltip = styled(({className, ...props}: any) => <Tooltip {...props} classes={{popper: className}}/>)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})


//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeParams, INodeData} from '../../custom_types/index'

function NodeInputHandler({data, disabled = false, inputParam, deleteInputAnchor}: {
    data: INodeData,
    disabled?: boolean,
    inputParam: INodeParams,
    deleteInputAnchor?: () => void

}) {
    const theme = useTheme()
    const [position, setPosition] = useState(0)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const {reactFlowInstance} = useContext(flowContext)
    const [showExpandDialog, setShowExpandDialog] = useState(false)

    const onExpandDialogClicked = () => {
        setShowExpandDialog(true)
    }
    const showDisplay = (type) => {
        const newType = type.split('/')[0]
        return ['textarea', 'code'].includes(newType)
    }

    useEffect(() => {
        if (ref.current) {
            const dom = ref.current as HTMLElement
            if (dom.offsetTop && dom.clientHeight) {
                setPosition(dom.offsetTop + dom.clientHeight / 2)
                updateNodeInternals(data.id)
            }
        }

    }, [data.id, ref, updateNodeInternals])
    useEffect(() => {
        updateNodeInternals(data.id)
    }, [data.id, position, updateNodeInternals])
    return <div ref={ref}>
        {inputParam && inputParam.input_type === 'anchor' && (
            <>
                <CustomWidthTooltip placement='left' title={inputParam.type}>
                    <Handle
                        type='target'
                        position={Position.Left}
                        key={inputParam.key}
                        id={inputParam.key}
                        isValidConnection={(connection) => isValidConnection(connection, inputParam, 'target', reactFlowInstance)}
                        style={{
                            height: 10,
                            width: 10,
                            backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                            top: position
                        }}

                    />
                </CustomWidthTooltip>
                <Box sx={{p: 2}}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        className="group"
                    >
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
                        <DeleteIcon
                            className="group-hover:opacity-100 opacity-0"
                            onClick={() => deleteInputAnchor && deleteInputAnchor()}
                        ></DeleteIcon>
                    </Stack>
                </Box>
            </>
        )}
        {inputParam && inputParam.input_type !== 'anchor' &&
            <>
                <Box sx={{p: 2}}>
                    <div className="flex items-center justify-between">
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>

                        {showDisplay(inputParam.display_type) && <IconButton
                            title='Expand'
                            color='primary'
                            onClick={onExpandDialogClicked}>
                            <FullscreenIcon/>
                        </IconButton>}
                    </div>

                    {<Input
                        disabled={disabled}
                        inputParam={inputParam}
                        onChange={(newValue) => (inputParam.value = newValue)}
                        value={inputParam.value ?? inputParam.value ?? ''}
                        showDlg={showExpandDialog}
                        onDialogCancel={() => {
                            setShowExpandDialog(false)
                        }}
                    />}
                </Box>
            </>}
    </div>
}

NodeInputHandler.propTypes = {
    inputAnchor: PropTypes.object,
    inputParam: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    isAdditionalParams: PropTypes.bool
}

export default NodeInputHandler