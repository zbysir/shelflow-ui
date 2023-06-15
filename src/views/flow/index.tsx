import {useEffect, useState} from "react";

import {useTheme, styled} from '@mui/material/styles'
import {useNavigate} from 'react-router-dom'
//  hooks
import useApi from "../../hooks/useApi";

// api
import api from "../../api";
import {FlowData} from "../../custom_types";


import {Button} from "@/components/ui/button"
import {Loader2, BadgeX, Edit} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"

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


    return <div className="min-h-full bg-blue-50">
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <h1 className="text-3xl font-bold">WriteFlow</h1>
                    </a>
                </div>
            </nav>
        </header>
        <main className="p-6">
            <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">flows</h1>
                    <Button
                        onClick={addFlow}>Add New</Button>
                </div>
                {getFlowListApi.loading && <div
                    className="flex items-center justify-center h-64"
                ><Loader2 className="mr-2 h-8 w-8 animate-spin"></Loader2></div>}
                {
                    !getFlowListApi.loading && getFlowListApi.data &&
                    <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-4">
                        {list.list.map((item: FlowData, index: number) => (
                            <Card
                                key={index}
                                className="border border-solid  border-gray-100
                            cursor-pointer
                            group
                            hover:shadow-xl"

                            >
                                <CardHeader>
                                    <CardTitle>{item.name || 'demo'}

                                    </CardTitle>
                                    <CardDescription>{item.description || 'description'}</CardDescription>
                                </CardHeader>
                                <CardContent className="border border-solid border-gray-100">
                                    <div className="flex pt-2 justify-between">
                                        <Button variant="ghost">
                                            <BadgeX className="text-gray-400"></BadgeX>
                                            <span className="ml-1">Delete</span>
                                        </Button>
                                        <Button variant="ghost"
                                                onClick={() => {
                                                    goToCanvas(item)
                                                }}>
                                            <Edit className="text-gray-400"></Edit>
                                            <span className="ml-1">Edit</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>}

            </div>
        </main>

        {/*<Main theme={theme}>*/}
        {/*    <Card sx={{padding: 2}}>*/}
        {/*        <Stack flexDirection='row' sx={{mb: 1.25}}>*/}
        {/*            <Typography variant={'h2'} className="flex-auto">Flows</Typography>*/}
        {/*            <Button variant="contained" disableElevation*/}
        {/*                    onClick={() => addFlow()}>*/}
        {/*                Add New*/}
        {/*            </Button>*/}
        {/*        </Stack>*/}
        {/*        {getFlowListApi.loading && <Box*/}
        {/*            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px'}}*/}
        {/*        ><CircularProgress/></Box>}*/}
        {/*        {!getFlowListApi.loading &&*/}
        {/*            getFlowListApi.data && <Box>*/}
        {/*                <Grid container spacing={3}>*/}
        {/*                    {*/}
        {/*                        list.list.map((data: FlowData, index: number) => (*/}
        {/*                            <Grid key={index} item lg={3} md={4} sm={6} xs={12}>*/}
        {/*                                <Card*/}
        {/*                                    sx={{*/}
        {/*                                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',*/}
        {/*                                        cursor: 'pointer',*/}
        {/*                                        '&:hover': {*/}
        {/*                                            boxShadow: '0 2px 14px 0 rgb(32 40 45 / 20%)'*/}
        {/*                                        },*/}
        {/*                                    }}*/}
        {/*                                    onClick={() => {*/}
        {/*                                        goToCanvas(data)*/}
        {/*                                    }}*/}
        {/*                                >*/}
        {/*                                    <CardHeader*/}
        {/*                                        title={data.name || 'demo'}*/}
        {/*                                        subheader={data.description || 'description'}*/}
        {/*                                        action={*/}
        {/*                                            <IconButton aria-label="settings">*/}
        {/*                                                <DeleteForeverIcon/>*/}
        {/*                                            </IconButton>*/}
        {/*                                        }/>*/}
        {/*                                    /!*<CardActions>*!/*/}
        {/*                                    /!*    <Button*!/*/}
        {/*                                    /!*        variant="outlined"*!/*/}
        {/*                                    /!*    >Delete</Button>*!/*/}
        {/*                                    /!*    <Button*!/*/}
        {/*                                    /!*        variant="contained"*!/*/}
        {/*                                    /!*    >Detail</Button>*!/*/}

        {/*                                    /!*</CardActions>*!/*/}
        {/*                                </Card>*/}
        {/*                            </Grid>*/}
        {/*                        ))}*/}
        {/*                </Grid>*/}

        {/*                <Pagination*/}
        {/*                    count={list.totalPage}*/}
        {/*                    color="primary"*/}
        {/*                    className="flex justify-center mt-4"*/}
        {/*                    onChange={(e, page) => {*/}
        {/*                        changePageHandle(page)*/}
        {/*                    }}*/}
        {/*                />*/}
        {/*            </Box>}*/}

        {/*    </Card>*/}
        {/*</Main>*/}
    </div>
}


export default Flows
