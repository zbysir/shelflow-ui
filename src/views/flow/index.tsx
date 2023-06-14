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

    IconButton, CircularProgress
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
    const pageSize = 20;

    const [list, setList] = useState<{ total: number, list: FlowData[], totalPage: number }>({
        total: 0,
        list: [],
        totalPage: 0,
    })
    const addFlow = () => {
        navigate('/canvas')
    }

    const goToCanvas = (item: FlowData) => {
        navigate('canvas/' + item.id)
    }
    const getFlowList = async (page = 1) => {
        const res = await getFlowListApi.request({
            limit: pageSize,
            index: page
        })
        console.log('getListxxx res:', res)
        const data = {
            ...res,
        }
        data.totalPage = Math.ceil(data.total / pageSize)
        setList(data);
    }
    const changePageHandle = (page: number) => {
        console.log('page:', page)
        getFlowList(page)
    }
    // useEffect
    useEffect(() => {
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
                        <Typography variant="h1">writeFlow</Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>

        <Main theme={theme}>
            <Card sx={{padding: 2}}>
                <Stack flexDirection='row' sx={{mb: 1.25}}>
                    <Typography variant={'h2'} className="flex-auto">Flows</Typography>
                    <Button variant="contained" disableElevation
                            onClick={() => addFlow()}>
                        Add New
                    </Button>
                </Stack>
                {getFlowListApi.loading && <Box
                    sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px'}}
                ><CircularProgress/></Box>}
                {!getFlowListApi.loading &&
                    getFlowListApi.data && <Box>
                        <Grid container spacing={3}>
                            {
                                list.list.map((data: FlowData, index: number) => (
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

                        <Pagination
                            count={list.totalPage}
                            color="primary"
                            className="flex justify-center mt-4"
                            onChange={(e, page) => {
                                changePageHandle(page)
                            }}
                        />
                    </Box>}

            </Card>
        </Main>
    </Box>
}


export default Flows
