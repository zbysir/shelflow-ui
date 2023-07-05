import {Link, Outlet} from "react-router-dom";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Workflow} from "lucide-react";

export default function MainLayout() {
    return <div className="flex">
        <div className="w-60 px-5">
            <div className="h-14 flex items-center border-b-gray border-b">
                <a href="/" className="flex items-center">
                    <Workflow className="w-6 h-6"></Workflow>
                    <h1 className="font-bold inline-block ml-1">WriteFlow</h1>
                </a>
            </div>
            <div className="mt-3 text-sm">
                <Link to={"/"} className={"p-3 block font-medium hover:bg-slate-500/10 rounded"}>Flows</Link>
                <Accordion type="multiple" className={""}>
                    <AccordionItem value="Library">
                        <AccordionTrigger className={"p-3 font-medium hover:bg-slate-500/10 rounded"}>
                            Library
                        </AccordionTrigger>
                        <AccordionContent>
                            <Link to={"/library/book"} className={"pl-5 p-3 block hover:bg-slate-500/10 rounded"}> Book </Link>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="Setting">
                        <AccordionTrigger className={"p-3 font-medium hover:bg-slate-500/10 rounded"}>
                            Setting
                        </AccordionTrigger>
                        <AccordionContent>
                            <Link to={"/setting/user"} className={"pl-5 p-3 block hover:bg-slate-500/10 rounded"}> User </Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
        <div className="flex-1">
            <Outlet/>
        </div>
    </div>
}