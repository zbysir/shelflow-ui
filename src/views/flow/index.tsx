import {useEffect, useState} from "react";
//  hooks
import useApi from "@/hooks/useApi";

// api
import api from "@/api";
import {FlowData} from "@/custom_types";


import {Button} from "@/components/ui/button"
import {Loader2, BadgeX, Edit, Sun, Github, Moon, Laptop, Workflow} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {Separator} from "@/components/ui/separator"
import Pagination from '../ui-components/pagination/Pagination'
import {useNavigate, useSearchParams} from "react-router-dom";


const Flows = () => {
    const getFlowListApi = useApi(api.getFlowList)
    const [pageSize, setPageSize] = useState(20);
    const [curPage, setCurPage] = useState(1);
    const navigate = useNavigate()
    // const query = useMatch()
    const [searchParams, setSearchParams] = useSearchParams();

    const [list, setList] = useState<{ total: number, list: FlowData[], totalPage: number }>({
        total: 0,
        list: [],
        totalPage: 0,
    })

    const getFlowList = async (page = 1, size = 20) => {
        const res = await getFlowListApi.request({
            limit: size,
            offset: (page - 1) * size,
        })
        const data = {
            ...res,
        }
        data.totalPage = Math.ceil(data.total / pageSize)
        setList(data);
    }

    const changeMode = (mode: string) => {
        console.log('changeMode:', mode)
        const html = document.documentElement;
        if (mode === 'dark') {
            html.classList.remove('light')
            html.classList.add(mode)

            html.setAttribute('style', `color-scheme: dark`)
        } else {
            html.classList.remove('dark')
            html.classList.add(mode)
            html.setAttribute('style', `color-scheme: light`)
        }
        sessionStorage.setItem('theme', mode)

    }
    const changePageHandle = (page: number) => {
        setCurPage(page)
        getFlowList(page)
        navigate('/?page=' + page, {
            replace: true,
        })
    }

    const pageSizeHandle = (size: number) => {
        setPageSize(size)
        setCurPage(1)
        getFlowList(1, size)
    }

    // useEffect
    useEffect(() => {
        const page = searchParams.get('page');
        let p = 1;
        if (page) {
            p = parseInt(page)
            setCurPage(p)
        }
        getFlowList(p)
    }, [])


    return <div className="min-h-full bg-secondary">
        <header className="bg-background">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
                 aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className="flex items-center">
                        <Workflow className="w-6 h-6"></Workflow>
                        <h1 className="font-bold inline-block ml-1">WriteFlow</h1>
                    </a>
                </div>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <a href="https://github.com/zbysir/writeflow-ui"
                               target="_blank"><Github></Github></a></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Sun></Sun></MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem
                                onClick={() => changeMode('light')}><Sun
                                className="w-4 h-4 mr-2"></Sun> Light</MenubarItem>
                            <MenubarItem
                                onClick={() => changeMode('dark')}><Moon
                                className="w-4 h-4 mr-2"></Moon> Dark</MenubarItem>
                            <MenubarItem><Laptop className="w-4 h-4 mr-2"></Laptop>System</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </nav>
        </header>
        <main className="p-6">
            <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8 bg-seco">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold tracking-tight">flows</h2>
                    <a href="/canvas">
                        <Button>Add New</Button>
                    </a>
                </div>
                {getFlowListApi.loading && <div
                    className="flex items-center justify-center h-64"
                ><Loader2 className="mr-2 h-8 w-8 animate-spin"></Loader2></div>}
                {
                    !getFlowListApi.loading && getFlowListApi.data &&
                    <>
                        <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-4">
                            {list.list.map((item: FlowData, index: number) => (
                                <Card
                                    key={index}
                                    className="border border-solid
                                border-color
                            cursor-pointer
                            group
                            hover:shadow-xl"

                                >
                                    <CardHeader>
                                        <CardTitle>{item.name || 'demo'}

                                        </CardTitle>
                                        <CardDescription>{item.description || 'description'}</CardDescription>
                                    </CardHeader>
                                    <Separator></Separator>
                                    <CardContent>
                                        <div className="flex pt-2 justify-between">
                                            <Button variant="ghost">
                                                <BadgeX className="text-gray-400"></BadgeX>
                                                <span className="ml-1">Delete</span>
                                            </Button>
                                            <a href={'/canvas/' + item.id}>
                                                <Button variant="ghost"
                                                >
                                                    <Edit className="text-gray-400"></Edit>
                                                    <span className="ml-1">Edit</span>
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                        </div>
                        <div className="mt-4 flex justify-end">
                            <Pagination
                                total={list.total}
                                pageSize={pageSize}
                                curPage={curPage}
                                pageChange={changePageHandle}
                                pageSizeChange={pageSizeHandle}
                            ></Pagination>
                        </div>
                    </>
                }


            </div>
        </main>
    </div>
}


export default Flows
