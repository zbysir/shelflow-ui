import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
// react-flow
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    Node,
    ReactFlowJsonObject,
    useEdgesState,
    useNodesState
} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';

//  shadcnUI
import {Button} from "@/components/ui/button"
import {Input} from '@/components/ui/input'
import {ArrowLeft, Check, Loader2} from 'lucide-react'
//  hooks
import useApi from "@/hooks/useApi";
// Api
import api from "@/api/index";
//  customNode
import GeneralNode from './CanvasNode';
// utils
import {edgeToData, flowDetail, getUniqueNodeId, initNode} from '@/utils/genericHelper'
//  custom types
import {FlowData, INodeParams} from "@/custom_types";
// context
import {flowContext} from "@/store/context/ReactFlowContext";
import {useSnackbar} from "notistack";
import {useToast} from "@/components/ui/use-toast"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import ComponentList from "@/views/canvas/ComponentList.tsx";

const nodeTypes = {
    customNode: GeneralNode,
};

const OverviewFlow = () => {
    const params = useParams();
    const navigate = useNavigate()
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    // const [rfInstance, setRfInstance] = useState<ReactFlowInstance>()
    const [detail, setDetail] = useState<FlowData>({} as FlowData);
    const ws = useRef<WebSocket | null>(null);
    const [delEdge, setDelEdge] = useState<Edge>()
    const [delNode, setDelNode] = useState<Node>()
    const [runLoading, setRunLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar();
    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)
    const editFlowApi = useApi(api.editFlow)
    const runFlowApiHook = useApi(api.runFlow)
    const {toast} = useToast()

    const {
        reactFlowInstance,
        setReactFlowInstance,
        runResult,
        setRunResult,
        deleteEdge,
        deleteNode
    } = useContext(flowContext);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const reactFlowBounds = (reactFlowWrapper.current! as HTMLElement).getBoundingClientRect();
        const nodeStr = event.dataTransfer.getData('application/reactflow')

        if (typeof nodeStr === 'undefined' || !nodeStr) {
            return
        }

        const nodeData: Node = JSON.parse(nodeStr)

        console.log('nodeData:', nodeData);
        if (!reactFlowInstance) {
            return
        }
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const id = getUniqueNodeId();
        const data = initNode(nodeData.data, id)
        data.type = nodeData.type
        const newNode = {
            id: id,
            position,
            type: 'customNode',
            data: data
        }

        console.log("newNode:", newNode)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance]);

    const onConnect = (params: Connection) => {
        setNodes((nds) => {
            return nds.map((node: Node) => {
                if (node.id === params.target) {
                    // 寻找目标节点的锚点
                    const targetAnchor = node.data?.input_params?.find((input: INodeParams) => input.key === params.targetHandle);
                    if (targetAnchor) {
                        if (!targetAnchor.anchors) {
                            targetAnchor.anchors = []
                        }
                        // 写入到anchors中的目的：为了在删除handle时，能够找到对应的node_id和output_key
                        targetAnchor.anchors.push({
                            node_id: params.source,
                            output_key: params.sourceHandle
                        })
                    }
                }
                return node
            })
        })
        setEdges((eds) => addEdge(params, eds));
    };

    const getFlow = () => {
        if (reactFlowInstance) {
            let flow: ReactFlowJsonObject = reactFlowInstance.toObject();
            flow = edgeToData(flow);
            return {
                ...detail,
                graph: flow
            }
        }

        return null
    }

    const onSave = async () => {
        console.log('saveFlow:', reactFlowInstance)
        if (reactFlowInstance) {
            let flow = reactFlowInstance.toObject();
            // return
            flow = edgeToData(flow);
            try {
                if (params.id) {
                    const data = {
                        ...detail,
                        graph: flow
                    }
                    await editFlowApi.request(data)
                    console.log('editFlowApi', editFlowApi)
                } else {
                    const data = {
                        name: 'first demo',
                        description: 'first demo',
                        graph: flow
                    }

                    await addFlowApi.request(data)
                }

                toast({
                    title: <div className={"flex space-x-2 text-green-600 items-center"}>
                        <Check className={"w-3.5 h-3.5"}></Check>
                        <div>Save Success</div>
                    </div>,
                    description: "",
                })
            } catch (e) {
                toast({
                    title: <div className={"flex space-x-2 text-destructive items-center"}>
                        <Check className={"w-3.5 h-3.5"}></Check>
                        <div>{e.data.msg}</div>
                    </div>,
                    description: "",
                })
            }
        }

    }

    const runFlow = async () => {
        setRunLoading(true)
        const runObj: Record<string, any> = {}
        setRunResult({})

        const flow = getFlow()
        const topic = await runFlowApiHook.request({graph: flow?.graph})

        let host = `${import.meta.env.VITE_WS_HOST}`

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const service_host = window.__service_host__

        if (service_host) {
            host = `${service_host.ws}`
        }
        ws.current = new WebSocket(`${host}/api/ws/` + topic);
        ws.current.onmessage = e => {
            console.log('messgae:', e.data);
            const data = JSON.parse(e.data);
            runObj[data.node_id] = data

            setRunResult({...runObj})
            return () => {
                setRunLoading(false)
                ws.current?.close();
            };
        };
        ws.current.onclose = () => {
            setRunLoading(false)
        }
    }

    const changeName = (name: string) => {
        setDetail({
            ...detail,
            name: name
        })
    }
    const onEdgesDelete = (edges: Edge[]) => {
        if (delEdge) {
            deleteEdge(delEdge.id)
        }
    }
    const onEdgeClick = (e: React.MouseEvent, edge: Edge) => {
        setDelEdge(edge)
    }

    const onNodeClick = (e: React.MouseEvent, node: Node) => {
        setDelNode(node)
    }

    const onNodesDelete = (nodes: Node[]) => {
        if (delNode) {
            deleteNode(delNode.id)
        }
    }

    // // =========|| useEffect ||======== //


    // 加载 flow
    useEffect(() => {
        if (params.id) {
            getFlowApi.request(params.id)
        }
    }, [])


    useEffect(() => {
            if (getFlowApi.data) {
                console.log('flowDetail:', getFlowApi.data)
                const data = flowDetail(getFlowApi.data);
                setNodes(data.graph.nodes || [])
                setEdges(data.graph.edges || [])
                setDetail(data)
            }
        },
        [getFlowApi.data, getFlowApi.error])

    return <div className="h-screen flex flex-col">
        <header
            className="flex items-center border border-b h-12 px-4 flex-shrink-0 "
        >
            <nav className="flex flex-1 items-center  justify-between">
                <div className={"flex items-center space-x-4"}>
                    <Link to={"/"}>
                        <Button size={"sm"} variant={"secondary"} className={"shadow-xl"}>
                            <ArrowLeft className={"w-3 h-3"}></ArrowLeft>
                        </Button>
                    </Link>

                    <Input value={detail.name || ''}
                           placeholder="flow name"
                           onChange={(e) => {
                               changeName(e.target.value)
                           }
                           }></Input>
                </div>
                <div className="flex">
                    <Button
                        disabled={runLoading}
                        variant="outline"
                        size={"sm"}
                        onClick={runFlow}>
                        {runLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Run
                    </Button>
                    <Button
                        disabled={editFlowApi.loading || addFlowApi.loading}
                        className="ml-2"
                        size={"sm"}
                        onClick={onSave}>
                        {(editFlowApi.loading || addFlowApi.loading) &&
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save
                    </Button>
                </div>

            </nav>
        </header>
        <main className={"flex flex-1 min-h-[0]"}>
            {/*left*/}
            <div className={"w-[250px] border-r"}>
                <LeftPlan></LeftPlan>
            </div>

            {/*body*/}
            <div className="flex-1 reactflow-wrapper bg-secondary" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onEdgesDelete={onEdgesDelete}
                    onEdgeClick={onEdgeClick}
                    onNodeClick={onNodeClick}
                    onNodesDelete={onNodesDelete}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    fitView
                    minZoom={0.1}
                >
                    <Controls style={{
                        display: 'flex',
                        flexDirection: 'row',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}/>
                    <Background color="#aaa" gap={16}/>
                    {/*{getCompsApi.data && <AddNode comps={getCompsApi.data}></AddNode>}*/}
                    {/*<ChatBox></ChatBox>*/}
                </ReactFlow>
            </div>
        </main>

    </div>
};

// 通用的错误提示，可以返回值
function UseApi() {
    const {toast} = useToast()
    toast({title: "xx"})
}

function LeftPlan() {
    const getCompsApi = useApi(api.getComps)
    // 加载组件
    useEffect(() => {
        getCompsApi.request()
    }, [])

    return <Tabs defaultValue="add" className="w-full p-4 h-full flex flex-col  ">
        <TabsList className={"flex p-0.5"}>
            <TabsTrigger className={"flex-1"} value="add">Add</TabsTrigger>
            <TabsTrigger className={"flex-1"} value="chat">Chat</TabsTrigger>
            <TabsTrigger className={"flex-1"} value="setting">Setting</TabsTrigger>
        </TabsList>
        <TabsContent className={"flex-1 h-full overflow-auto"} value="add">
            {/*<div className={"bg-gray-600 h-[1000px]"}></div>*/}
            {getCompsApi.data && <ComponentList comps={getCompsApi.data}></ComponentList>}
        </TabsContent>
        <TabsContent className={"flex-1"} value="chat"></TabsContent>
        <TabsContent className={"flex-1"} value="setting"></TabsContent>
    </Tabs>
}

function PlanMenuItem({title, children}: { title: string, children?: React.ReactNode }) {
    return <div>
        <h3 className={"font-medium"}>{title}</h3>
        {children}
    </div>
}

export default OverviewFlow;
