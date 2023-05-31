import PropTypes from 'prop-types'
import {Box, Typography, Tooltip} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles'
import {tooltipClasses} from '@mui/material/Tooltip'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useState, useEffect, useRef} from 'react'
import {Input} from '../ui-components/input/Index'

const CustomWidthTooltip = styled(({className, ...props}:any) => <Tooltip {...props} classes={{popper: className}}/>)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})

function NodeInputHandler({inputAnchor, data, disabled = false, inputParam}) {
    const theme = useTheme()
    const [position, setPosition] = useState(0)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
            setPosition(ref.current.offsetTop + ref.current.clientHeight / 2)
            updateNodeInternals(data.id)
        }
    }, [data.id, ref, updateNodeInternals])
    return <div ref={ref}>
        {inputAnchor && (
            <>
                <CustomWidthTooltip placement='left' title={inputAnchor.type}>
                    <Handle
                        type='target'
                        position={Position.Left}
                        key={inputAnchor.id}
                        id={inputAnchor.id}
                        style={{
                            height: 10,
                            width: 10,
                            backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                            top: position
                        }}
                    />
                </CustomWidthTooltip>
                <Box sx={{p: 2}}>
                    <Typography>
                        {inputAnchor.label}
                        {!inputAnchor.optional && <span style={{color: 'red'}}>&nbsp;*</span>}
                    </Typography>
                </Box>
            </>
        )}
        {
            inputParam && !inputParam.additionalParams && (
                <>
                    <Box sx={{p: 2}}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Typography>
                                {inputParam.name['en']}
                            </Typography>
                            <div style={{flexGrow: 1}}></div>

                        </div>

                        {(inputParam.type === 'string' || inputParam.type === 'password' || inputParam.type === 'number') && (
                            <Input
                                disabled={disabled}
                                inputParam={inputParam}
                                onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                                value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                            />
                        )}


                    </Box>
                </>
            )}
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