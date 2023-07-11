import {useEffect, useState} from "react";
//  hooks
import useApi from "@/hooks/useApi";

// api
import api from "@/api";
import {FlowData} from "@/custom_types";


import {Button} from "@/components/ui/button"
import {Delete, Edit, Laptop, Loader2, LogOut, Moon, Star, Sun, Trash2, Truck} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger,} from "@/components/ui/menubar"
import Pagination from '../ui-components/pagination/Pagination'
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import dayjs from 'dayjs';

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

    return <div className="min-h-full">
        <header className="h-12">
            <nav className="mx-auto flex max-w-7xl items-center justify-between"
                 aria-label="Global">
                <div className={"flex flex-1 items-center justify-end space-x-1"}>

                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <Sun className={"w-4"}></Sun>
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem
                                    className={"space-x-1 pl-1"}
                                    onClick={() => changeMode('light')}>
                                    <Sun className="w-3 h-3"></Sun>
                                    <div>Light</div>
                                </MenubarItem>
                                <MenubarItem
                                    className={"space-x-1 pl-1"}
                                    onClick={() => changeMode('dark')}>
                                    <Moon className="w-3 h-3"></Moon>
                                    <div>Dark</div>
                                </MenubarItem>
                                <MenubarItem className={"space-x-1 pl-1"}>
                                    <Laptop className="w-3 h-3"></Laptop>
                                    <div>System</div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>

                        <MenubarMenu>
                            <MenubarTrigger>
                                <div className={"flex space-x-2 items-center"}>
                                    <div>bysir</div>
                                    <Avatar className={"w-6 h-6"}>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem
                                    onClick={() => changeMode('light')}
                                    className={"space-x-1 pl-1"}
                                >
                                    <LogOut className={"w-3 h-3"}></LogOut>
                                    <div>Logout</div>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>


            </nav>
        </header>
        <main className="px-6">
            <div className="mx-auto max-w-7xl px-2">
                {/* header */}
                <div className="flex items-center justify-between mb-4 h-16">
                    <h2 className="text-lg font-medium ">Flows</h2>
                    <Link to={"/canvas"}>
                        <Button size={"sm"}>New</Button>
                    </Link>
                </div>
                {getFlowListApi.loading && <div
                    className="flex items-center justify-center h-64"
                ><Loader2 className="mr-2 h-8 w-8 animate-spin"></Loader2></div>}
                {
                    !getFlowListApi.loading && getFlowListApi.data &&
                    <>
                        <div className="grid lg:grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-4">
                            {list.list.map((item: FlowData, index: number) => (
                                <Card
                                    key={index}
                                    className="border border-solid
                                        border-color
                                    group
                                    hover:shadow-xl"
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            <div className={"flex justify-between items-center"}>
                                                <div>
                                                    {item.name || '--'}
                                                </div>
                                                <Star className={"w-3.5 opacity-30 group-hover:opacity-100"}></Star>
                                            </div>
                                        </CardTitle>
                                        {item.description ?
                                            <CardDescription className={"text-xs"}>{item.description || ''}</CardDescription> : null}
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className={"flex justify-end items-center text-muted-foreground space-x-1"}>
                                            <Edit className={"w-3"}></Edit>
                                            <div
                                                className={"text-xs"}>{dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                                        </div>
                                        <div className="flex pt-2 justify-end space-x-3">
                                            <Button variant="default" size={"sm"}> Play </Button>
                                            <Link to={'/canvas/' + item.id}>
                                                <Button variant="secondary" size={"sm"}> Edit </Button>
                                            </Link>
                                            <Menubar className={"p-0 h-auto"}>
                                                <MenubarMenu >
                                                    <MenubarTrigger className={"p-0"}>
                                                        <Button variant="secondary" size={"sm"}> ... </Button>
                                                    </MenubarTrigger>

                                                    <MenubarContent>
                                                        <MenubarItem
                                                            onClick={() => changeMode('light')}
                                                        >
                                                            Duplicate
                                                        </MenubarItem>
                                                        <MenubarItem
                                                            onClick={() => changeMode('light')}
                                                            className={"text-destructive focus:text-destructive space-x-1 pl-1"}
                                                        >
                                                            <Trash2 className={"w-3 h-3"}></Trash2>
                                                            <div>Delete</div>
                                                        </MenubarItem>
                                                    </MenubarContent>
                                                </MenubarMenu>

                                            </Menubar>
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
