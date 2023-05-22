import {Card, CardContent, CardHeader, Divider, Typography} from '@mui/material'
import {forwardRef} from 'react'
import {useTheme} from '@mui/material/styles'

const MainCard = forwardRef((props, ref) => {
    const {title, subtitle, content, ...other} = props
    const theme = useTheme()
    return (
        <Card ref={ref} {...other} sx={{border: 'solid 1px', borderColor: theme.palette.text.secondary}}>
            <CardHeader
                action={subtitle}
                title={title}
                titleTypographyProps={{
                    variant: 'h6',
                }}
            />
            <Divider/>
            <CardContent>
                <Typography variant="body2">{content}</Typography>
            </CardContent>
        </Card>
    )
})

export default MainCard