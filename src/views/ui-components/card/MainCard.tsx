import {Card, CardContent, CardHeader, Divider, Typography} from '@mui/material'
import {forwardRef} from 'react'
import {useTheme} from '@mui/material/styles'
import PropTypes from 'prop-types'
const MainCard = forwardRef((props, ref) => {
    const {title, content, border, contentSX, contentClass, children, ...other} = props
    const theme = useTheme()
    return (
        <Card ref={ref} {...other} sx={{border: 'solid 1px', borderColor: theme.palette.text.secondary}}>
            {title && <CardHeader
                title={title}
                titleTypographyProps={{
                    variant: 'h6',
                }}
            />}
            {title && <Divider/>}
            {content && (
                <CardContent sx={contentSX} className={contentClass}>
                    {children}
                </CardContent>
            )}
            {!content && children}
        </Card>
    )
})

MainCard.propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    children: PropTypes.node,
    content: PropTypes.bool,
    border: PropTypes.bool,
}
export default MainCard

