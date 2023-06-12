import {useEffect, useState} from "react";
//  mui
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    ButtonBase,
    Card,
    Stack,
    Button,
    Grid,
    CardContent,
    CardActions,
    Typography,
    CardHeader,
    Pagination,
    IconButton
} from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useTheme, styled} from '@mui/material/styles'
import {useNavigate} from 'react-router-dom'
//  hooks
import useApi from "../../hooks/useApi";

// api
import api from "../../api";
import {FlowData} from "../../custom_types";

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(({theme}: { theme: any }) => ({
    ...theme?.typography?.mainContent,
}))

const Flows = () => {
    const getFlowListApi = useApi(api.getFlowList)
    const theme = useTheme()
    const navigate = useNavigate()
    const addFlow = () => {
        navigate('/canvas')
    }

    const goToCanvas = (item: FlowData) => {
        navigate('canvas/' + item.id)
    }

    // useEffect
    useEffect(() => {
        const getFlowList = async () => {
            const res = await getFlowListApi.request({limit: 20})
            console.log('getListxxx res:', res)
        }
        getFlowList()
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
                            writeFlow
                        </ButtonBase>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>

        <Main theme={theme}>
            <Card sx={{padding: 2}}>
                <Stack flexDirection='row' sx={{mb: 1.25}}>
                    <h1 className="flex-auto">Flows{getFlowListApi.loading}</h1>
                    <Button variant="contained" disableElevation
                            onClick={() => addFlow()}>
                        Add New
                    </Button>
                </Stack>

                {!getFlowListApi.loading &&
                    getFlowListApi.data && <Box>
                        <Grid container spacing={3}>
                            {
                                getFlowListApi.data?.list?.map((data: FlowData, index: number) => (
                                    <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                                        <Card
                                            sx={{
                                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 20%)'
                                                },
                                            }}
                                            onClick={() => {
                                                goToCanvas(data)
                                            }}
                                        >
                                            <CardHeader
                                                title={data.name || 'demo'}
                                                subheader={data.description || 'description'}
                                                action={
                                                    <IconButton aria-label="settings">
                                                        <DeleteForeverIcon/>
                                                    </IconButton>
                                                }/>
                                            {/*<CardActions>*/}
                                            {/*    <Button*/}
                                            {/*        variant="outlined"*/}
                                            {/*    >Delete</Button>*/}
                                            {/*    <Button*/}
                                            {/*        variant="contained"*/}
                                            {/*    >Detail</Button>*/}

                                            {/*</CardActions>*/}
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                        {/*<Pagination*/}
                        {/*    count={10}*/}
                        {/*    color="primary"*/}
                        {/*    className="flex justify-center mt-4"/>*/}
                    </Box>}

            </Card>
        </Main>
    </Box>
}


export default Flows
