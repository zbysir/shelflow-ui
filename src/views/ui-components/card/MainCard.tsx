import {Card, CardContent, CardHeader, Divider} from '@mui/material'
import {ForwardedRef, forwardRef} from 'react'
import {useTheme} from '@mui/material/styles'

const MainCard = forwardRef((props, ref: ForwardedRef<any>) => {
    const {title, content, border, contentSX, contentClass, children, ...other}: {
        title?: any,
        content?: boolean,
        border?: boolean,
        contentSX?: any,
        contentClass?: any,
        children?: React.ReactNode,
        [propName: string]: any;
    } = props
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

export default MainCard

