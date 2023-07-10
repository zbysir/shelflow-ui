import PropTypes from 'prop-types'
import {getConnectedEdges, Handle, Position, useStore, useUpdateNodeInternals} from 'reactflow'
import React, {ReactNode, useContext, useEffect, useMemo, useRef, useState} from 'react'

import {flowContext} from "@/store/context/ReactFlowContext";
import {isValidConnection} from '@/utils/genericHelper'

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"

// ui-components
import InputComp from '../ui-components/input/Index'
import TextAreaComp from '../ui-components/textarea/Textarea'
import {Switch} from "@/components/ui/switch"

import {Maximize, MoreHorizontal, Trash2} from 'lucide-react'

//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeData, INodeParams} from '@/custom_types/index'
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu.tsx";


interface Props {
    isDel?: boolean;
    className: string;
    deleteInputAnchor: () => void;
    swapNode: () => void;
}

function MoreDropDown({isDel, className, deleteInputAnchor, swapNode}: Props) {
    return <Menubar className={"p-0 h-auto"}>
        <MenubarMenu>
            <MenubarTrigger className={"p-0"}>
                <MoreHorizontal className={`w-4 h-4 ${className}`}></MoreHorizontal>

            </MenubarTrigger>

            <MenubarContent>
                <MenubarItem
                    onClick={() => swapNode()}>
                    Swap
                </MenubarItem>
                <MenubarItem
                    onClick={() => deleteInputAnchor()}
                    className={"text-destructive focus:text-destructive space-x-1 pl-1"}
                >
                    <Trash2 className={"w-3 h-3"}></Trash2>
                    <div>Delete</div>
                </MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>
}

const showDisplay = (type: string) => {
    const newType = type.split('/')[0]
    return newType
}

function NodeInputHandler({nodeId, inputParam, deleteInputAnchor, changeParam}: {
    nodeId: string;
    disabled?: boolean;
    inputParam: INodeParams;
    deleteInputAnchor?: () => void;
    changeParam?: (node: INodeParams, type?: string) => void;
}) {
    const [position, setPosition] = useState(0)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const {reactFlowInstance} = useContext(flowContext)

    const connected = useStore((s) => {
        const node = s.nodeInternals.get(nodeId);
        const connectedEdges = getConnectedEdges([node!], s.edges);
        return !!connectedEdges.find(i => i.targetHandle == inputParam.key)
    })

    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const onExpandDialogClicked = () => {
        setShowExpandDialog(true)
    }

    const displayType = showDisplay(inputParam.display_type || inputParam.type);
    const changeInputParamValue = (v: any) => {
        changeParam && changeParam({...inputParam, value: v})
    }

    const swapNodeHandle = () => {
        const newParam = {...inputParam}
        if (newParam.input_type === 'anchor') {
            newParam.input_type = 'literal'
        } else {
            newParam.input_type = 'anchor'
        }

        changeParam && changeParam(newParam, 'swapNode')

    }


    useEffect(() => {
        if (ref.current) {
            const dom = ref.current as HTMLElement
            if (dom.offsetTop && dom.clientHeight) {
                setPosition(dom.offsetTop + dom.clientHeight / 2)
                updateNodeInternals(nodeId)
            }
        }

    }, [nodeId, ref, updateNodeInternals])
    useEffect(() => {
        updateNodeInternals(nodeId)
    }, [nodeId, position, updateNodeInternals])

    const onMenuClick = function (action: string) {
        switch (action) {
            case 'delete':
                deleteInputAnchor&&deleteInputAnchor()
                break
            case 'swap':
                swapNodeHandle()
                break
        }
    }

    return <div className="flex flex-col relative py-1.5" ref={ref}>
        {inputParam && inputParam.input_type === 'anchor' && (
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Handle
                                type='target'
                                position={Position.Left}
                                key={inputParam.key}
                                id={inputParam.key}
                                isConnectable={true}
                                isValidConnection={(connection) => isValidConnection(connection, inputParam, 'target', reactFlowInstance)}
                                className={"flex justify-center items-center bg-transparent w-auto h-auto p-1"}
                            >
                                <div
                                    className={`border-neuter-foreground ${connected ? 'bg-neuter-foreground' : ''} border-2 h-1.5 w-1.5 rounded-xl pointer-events-none`}></div>
                            </Handle>
                        </TooltipTrigger>
                        <TooltipContent side="left" align="center">
                            {inputParam.type}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div>
                    <NodeContextMenu onMenuClick={onMenuClick} inputParam={inputParam}>
                        <div className="flex items-center justify-between group text-xs">
                            <LabelComp
                                name={inputParam.name} defaultValue={inputParam.key}
                                className="pl-3"></LabelComp>
                            {/*{Math.random()}*/}
                        </div>
                    </NodeContextMenu>
                </div>
            </>
        )}
        {inputParam && inputParam.input_type !== 'anchor' &&
            <NodeInputItem
                inputParam={inputParam}
                onChangeInputParamValue={changeInputParamValue}
                onDeleteInputAnchor={deleteInputAnchor}
                onExpandDialogClicked={onExpandDialogClicked} onSwapNodeHandle={swapNodeHandle}/>}
    </div>
}

interface NodeInputItemProps {
    inputParam: INodeParams
    onDeleteInputAnchor?: () => void
    onSwapNodeHandle: () => void
    onExpandDialogClicked: () => void
    onChangeInputParamValue: (v: any) => void
    hideTitle?: boolean
}

interface NodeContextMenu {
    inputParam: INodeParams
    onMenuClick: (action: string) => void
    children?: ReactNode
}

function NodeContextMenu({inputParam, onMenuClick, children}: NodeContextMenu) {
    const actions: { name: string, value: string, className?: string }[] = []
    const displayType = showDisplay(inputParam.display_type) || inputParam.type


    switch (displayType) {
        case 'code':
        case 'textarea':
        case 'bool':
        case 'string':
        case 'number':
        case 'int':
        case 'input':
            actions.push({name: "Swap", value: "swap"})
            break
    }
    if (inputParam.dynamic) {
        actions.push({name: "Delete", value: 'delete', className: "text-destructive"})
    }

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>
        {actions.length > 0 ? <ContextMenuContent>
            {actions.map(i => <ContextMenuItem onClick={() => onMenuClick(i.value)}><span
                className={i.className}>{i.name}</span></ContextMenuItem>)}
        </ContextMenuContent> : null
        }
    </ContextMenu>
}

function NodeInputItem(
    {
        inputParam,
        onDeleteInputAnchor,
        onSwapNodeHandle,
        onChangeInputParamValue,
        hideTitle
    }: NodeInputItemProps) {
    const displayType = showDisplay(inputParam.display_type || inputParam.type)
    const [showExpandDialog, setShowExpandDialog] = useState(false)

    const onMenuClick = function (action: string) {
        switch (action) {
            case 'delete':
                onDeleteInputAnchor && onDeleteInputAnchor()
                break
            case 'swap':
                onSwapNodeHandle()
                break
        }
    }

    const labelLine = useMemo(() => {
        return <div className="flex items-center justify-between group text-xs">
            {hideTitle ? null :
                <NodeContextMenu onMenuClick={onMenuClick} inputParam={inputParam}>
                    <div className={"flex-1"}>
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key}
                                   className={"flex-1 block pb-1.5"}></LabelComp>
                    </div>
                </NodeContextMenu>
            }

            {displayType == 'code' || displayType == 'textarea' ?
                <Maximize
                    onClick={() => setShowExpandDialog(true)}
                    className="w-4 h-4 cursor-pointer hover:bg-secondary"/> : null
            }
        </div>
    }, [inputParam, displayType])

    switch (displayType) {
        // 上下布局
        case 'code':
        case 'textarea':
            return <div className={"flex flex-col"}>

                {labelLine}

                <TextAreaComp
                    inputParam={inputParam}
                    onChange={onChangeInputParamValue}
                    value={inputParam.value ?? inputParam.value ?? ''}
                    showDlg={showExpandDialog}
                    onDialogCancel={() => {
                        setShowExpandDialog(false)
                    }}
                ></TextAreaComp>
            </div>
        case 'text':
        case 'password':
        default:
            return <div className={"flex flex-col space-y-1.5"}>
                {labelLine}
                <InputComp
                    displayType={displayType}
                    inputParam={inputParam}
                    onChange={onChangeInputParamValue}
                    value={inputParam.value ?? inputParam.value ?? ''}
                />
            </div>
        case 'bool':
            // 左右布局
            return <div className={"flex space-x-3 h-8 text-xs items-center "}>
                {hideTitle ? null :
                    <NodeContextMenu onMenuClick={onMenuClick} inputParam={inputParam}>
                        <div>
                            <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
                        </div>
                    </NodeContextMenu>
                }

                <div className={"flex items-center bg-input border-0 px-3 h-full rounded-md flex-1"}>
                    <Switch checked={inputParam.value as boolean}
                            onCheckedChange={onChangeInputParamValue}
                    ></Switch>
                </div>
            </div>
        case 'number':
        case 'int':
            return <div className={"flex space-x-3 h-8 text-xs items-center "}>
                {hideTitle ? null :
                    <NodeContextMenu onMenuClick={onMenuClick} inputParam={inputParam}>
                        <div>
                            <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
                        </div>
                    </NodeContextMenu>
                }

                <Input
                    className={"flex-1 bg-input border-0 px-3 h-8 rounded-md"}
                    value={inputParam.value || ''}
                    placeholder={inputParam?.placeholder}
                    type={displayType}
                    onChange={(e) => {
                        onChangeInputParamValue(e.target.value)
                    }}></Input>
            </div>
    }
}

NodeInputHandler.propTypes = {
    inputAnchor: PropTypes.object,
    inputParam: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    isAdditionalParams: PropTypes.bool
}

export default React.memo(NodeInputHandler)