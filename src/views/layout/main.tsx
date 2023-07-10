import {Link, Outlet} from "react-router-dom";
import {Flame, Github, Library, Workflow} from "lucide-react";
import {ReactNode} from "react";

interface MenuItemProps {
    active: boolean
    title: string
    icon: ReactNode
    link: string
}

function MenuItem(props: MenuItemProps) {
    return <div>
        <Link to={props.link}>
            <div
                className={`flex space-x-2.5 items-center py-2.5 pl-6 hover:bg-accent  rounded-md ${props.active ? 'text-primary' : 'text-muted-foreground hover:text-secondary-foreground'}`}>
                {props.icon}
                <div className={`flex-1 `}>{props.title}</div>
                {props.active ? <div className="h-5 w-1 bg-primary rounded-tl-md rounded-bl-md"></div> : null}
            </div>
        </Link>
    </div>
}

export default function MainLayout() {
    return <div className="flex ">
        {/* left */}
        <div className="flex flex-col justify-between w-60 pl-8 bg-secondary">
            <div className={"flex flex-col"}>
                {/* logo */}
                <div className="h-12 flex items-center">
                    <a href="/" className="flex items-center space-x-2">
                        <Workflow className="w-4 h-4"></Workflow>
                        <h1 className="font-medium inline-block">WriteFlow</h1>
                    </a>
                </div>
                <div className="mt-3 text-sm">
                    <MenuItem
                        active={true}
                        icon={<Flame strokeWidth={1.5} className={"w-4"}></Flame>}
                        link={"/"}
                        title={"Flow"}
                    ></MenuItem>
                    <MenuItem
                        active={false}
                        icon={<Library strokeWidth={1.5} className={"w-4"}/>}
                        link={"/library"}
                        title={"Library"}
                    ></MenuItem>
                </div>
            </div>

            <div className={"flex  pb-4"}>
                <a href="https://github.com/zbysir/writeflow-ui"
                   target="_blank"><Github className={"w-4"} strokeWidth={1.5}></Github></a>
            </div>

        </div>

        {/* body */}
        <div className="flex-1 bg-background">
            <Outlet/>
        </div>
    </div>
}