import {useEffect} from "react";
//  mui
import {Box, CssBaseline, AppBar, Toolbar, ButtonBase, Card, Stack, Button, Grid} from '@mui/material'
import {useTheme, styled} from '@mui/material/styles'
import logo from '../../assets/images/logo.png'

//  hooks
import useApi from "../../hooks/useApi";

// api
import api from "../../api";

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(({theme}) => ({
    ...theme.typography.mainContent,
}))

const Flows = () => {
    const getFlowListApi = useApi(api.getFlowList)
    const theme = useTheme()
    console.log("Flows  theme:", theme);

    // useEffect
    useEffect(() => {
        console.log('getListxxx')
        getFlowListApi.request()
    }, [])

    return <Box sx={{display: 'flex'}}>
        <CssBaseline/>
        <AppBar
            position='fixed'
            color='inherit'
            elevation={0}
            sx={{bgcolor: theme.palette.background.default,}}>
            <Toolbar>
                <Box sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}>
                    <Box>
                        <ButtonBase>
                            <img
                                style={{objectFit: 'contain', height: 'auto', width: 150}}
                                src={logo} alt="writeflow"/>
                        </ButtonBase>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>

        <Main theme={theme}>
            <Card sx={{padding: 2}}>
                <Stack flexDirection='row'>
                    <h1 className="flex-auto">Flows</h1>
                    <Button variant="contained" disableElevation>
                        Add New
                    </Button>
                </Stack>
                <Grid container spacing={3}>

                </Grid>
            </Card>
        </Main>
    </Box>
}


export default Flows
