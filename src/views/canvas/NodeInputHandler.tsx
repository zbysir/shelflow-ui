import PropTypes from 'prop-types'
import {Box, Typography, Tooltip} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles'
import {tooltipClasses} from '@mui/material/Tooltip'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useState, useEffect, useRef, useContext} from 'react'

const CustomWidthTooltip = styled(({className, ...props}) => <Tooltip {...props} classes={{popper: className}}/>)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})

function NodeInputHandler({inputAnchor, data}) {
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