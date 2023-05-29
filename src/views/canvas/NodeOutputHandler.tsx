import PropTypes from 'prop-types'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'
import { useEffect, useRef, useState, useContext } from 'react'

// material-ui
import { useTheme, styled } from '@mui/material/styles'
import { Box, Typography, Tooltip } from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})

// ===========================|| NodeOutputHandler ||=========================== //

const NodeOutputHandler = ({ outputAnchor, data, disabled = false }) => {
    const theme = useTheme()
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const [position, setPosition] = useState(0)
    const [dropdownValue, setDropdownValue] = useState(null)

    useEffect(() => {
        if (ref.current && ref.current?.offsetTop && ref.current?.clientHeight) {
            setTimeout(() => {
                setPosition(ref.current?.offsetTop + ref.current?.clientHeight / 2)
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, ref, updateNodeInternals])

    useEffect(() => {
        setTimeout(() => {
            updateNodeInternals(data.id)
        }, 0)
    }, [data.id, position, updateNodeInternals])

    useEffect(() => {
        if (dropdownValue) {
            setTimeout(() => {
                updateNodeInternals(data.id)
            }, 0)
        }
    }, [data.id, dropdownValue, updateNodeInternals])

    return (
        <div ref={ref}>
            {outputAnchor.type !== 'options' && !outputAnchor.options && (
                <>
                    <CustomWidthTooltip placement='right' title={outputAnchor.type}>
                        <Handle
                            type='source'
                            position={Position.Right}
                            key={outputAnchor.id}
                            id={outputAnchor.id}
                            style={{
                                height: 10,
                                width: 10,
                                // backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                top: position
                            }}
                        />
                    </CustomWidthTooltip>
                    <Box sx={{ p: 2, textAlign: 'end' }}>
                        <Typography>{outputAnchor.label}</Typography>
                    </Box>
                </>
            )}
        </div>
    )
}

NodeOutputHandler.propTypes = {
    outputAnchor: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool
}

export default NodeOutputHandler
