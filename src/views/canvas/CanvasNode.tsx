import {styled, useTheme} from "@mui/material/styles";
import MainCard from "../ui-components/card/MainCard";
import PropTypes from 'prop-types'
import {Typography, Divider, Box} from '@mui/material'
import NodeInputHandler from "./NodeInputHandler";

const CardWrapper = styled(MainCard)(({theme}) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 1px',
    borderColor: theme.palette.primary[200] + 75,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    '&:hover': {
        borderColor: theme.palette.primary.main
    }
}));

interface Node {
    label: string;
    description: string;
    name: string;
    id: string;
    type: string;
    selected?: boolean;
}

export default function CanvasNode({data}: { data: Node }) {
    const theme = useTheme()
    return <CardWrapper
        content={false}
        sx={{
            padding: 0,
            borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary
        }}
        border={false}>
        <Box>
            <Typography>{data.label}</Typography>
        </Box>

        {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
            <>
                <Divider/>
                <Box sx={{background: theme.palette.asyncSelect.main, p: 1}}>
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
        {data.inputAnchors.map((inputAnchor, index) => (
            <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data}/>
        ))}
    </CardWrapper>
}

CanvasNode.propTypes = {
    data: PropTypes.object
}