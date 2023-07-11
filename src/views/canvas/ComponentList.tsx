import * as React from 'react';
import {Button} from "@/components/ui/button"

interface Cate {
    category: {
        name: {
            'zh-CN': string;
            // 任意多个属性
            [propName: string]: any;
        }
    },
    children: any[]
}

const ComponentList = ({comps}: { comps: Cate[] }) => {
    const onDragStart = (event: any, node: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
        event.dataTransfer.effectAllowed = 'move';
    }

    return <>
        {comps && comps.map((item: Cate, index: number) => (
            <PlanMenuItem title={item.category.name['zh-CN']}>
                {item.children && item.children.map((child, i) => (
                    <Button
                        className={"w-full text-left"}
                        draggable
                        onDragStart={(event) => onDragStart(event, child)}
                        variant="ghost" key={i}>
                        <div className={"w-full flex flex-col justify-start space-y-0.5"}>
                            <div className={"text-xs"}>
                                {child.data.name['zh-CN']}
                            </div>
                            {child.data.description?.['zh-CN'] ? <div
                                className={"text-xs text-muted-foreground"}> {child.data.description['zh-CN']} </div> : null}
                        </div>

                    </Button>
                ))}
            </PlanMenuItem>
        ))}
    </>
}

function PlanMenuItem({title, children}: { title: string, children?: React.ReactNode }) {
    return <div className={""}>
        <h3 className={"font-medium text-xs text-neuter-foreground py-3"}>{title}</h3>
        <div>
            {children}
        </div>
    </div>
}

export default ComponentList