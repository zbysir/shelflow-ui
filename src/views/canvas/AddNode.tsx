import * as React from 'react';
import {Button} from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Plus} from 'lucide-react'

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

const AddNode = ({comps}: { comps: Cate[] }) => {
    const onDragStart = (event: any, node: any) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
        event.dataTransfer.effectAllowed = 'move';
    }

    return <>
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-10 rounded-full p-0 absolute z-50 top-4 left-4 shadow-xl">
                    <Plus className="h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="font-bold">组件库</div>

                <div className="mt-4 h-fit max-h-96 overflow-auto">
                    {comps && comps.map((item: Cate, index: number) => (
                        <div className="mb-4" key={index}>
                            <div>{item.category.name['zh-CN']}</div>
                            {item.children && item.children.map((child, i) => (
                                <Button
                                    draggable
                                    onDragStart={(event) => onDragStart(event, child)}
                                    variant="ghost" key={i}>{child.data.name['zh-CN']}</Button>
                            ))}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    </>
}

export default AddNode