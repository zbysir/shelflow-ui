import {styled} from "@mui/material/styles";
import MainCard from "../ui-components/card/MainCard";
import PropTypes from 'prop-types'

const CardWrapper = styled(MainCard)(({theme}) => ({
    // background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 1px',
    // borderColor: theme.palette.primary[200] + 75,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    '&:hover': {
        // borderColor: theme.palette.primary.main
    }
}));


export default function CanvasNode({data}) {
    const {title, subtitle, content} = data;
    return <CardWrapper title={title} subtitle={subtitle} content={content}/>
}

CanvasNode.propTypes = {
    data: PropTypes.object
}