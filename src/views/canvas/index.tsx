import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
// react-flow
import ReactFlow, {
    addEdge,
    Background, Controls, useEdgesState, useNodesState,
    ReactFlowJsonObject,
    Node,
    Edge
} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';
//  mui
import {AppBar, Box, Button, Stack, Toolbar, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton';
//  hooks
import useApi from "../../hooks/useApi";
// Api
import api from "../../api/index";
//  customNode
import CanvasNode from './CanvasNode';
import AddNode from "./AddNode";
import OutputNode from "./OutputNode";
// utils
import {edgeToData, flowDetail, getUniqueNodeId, initNode} from '../../utils/genericHelper'
//  custom types
import {FlowData, INodeParams, NodeAnchor} from "../../custom_types";
// context
import {flowContext} from "../../store/context/ReactFlowContext";
import {useSnackbar} from "notistack";


const nodeTypes = {
    customNode: CanvasNode,
    outputNode: OutputNode,
};


const OverviewFlow = () => {
    const theme = useTheme()
    const params = useParams();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    // const [rfInstance, setRfInstance] = useState<ReactFlowInstance>()
    const [detail, setDetail] = useState<FlowData>({} as FlowData);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
    const ws = useRef<WebSocket | null>(null);
    const [delEdge, setDelEdge] = useState<Edge>()
    const [runLoading, setRunLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar();
    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)
    const editFlowApi = useApi(api.editFlow)
    const getCompsApi = useApi(api.getComps)
    const runFlowApiHook = useApi(api.runFlow)


    const {reactFlowInstance, setReactFlowInstance, runResult, setRunResult} = useContext(flowContext);

    // const onInit = (reactFlowInstance: ReactFlowInstance) => {
    //     // setRfInstance(reactFlowInstance)
    //     setReactFlowInstance(reactFlowInstance)
    // }
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
        const NodeType = nodeData.type === 'output' ? 'outputNode' : 'customNode'
        const newNode = {
            id: id,
            position,
            type: NodeType,
            data: data
        }

        console.log("newNode:", newNode)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance]);


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
            console.log(flow);
            // return
            flow = edgeToData(flow);
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
            // 提示保存成功
            enqueueSnackbar('success', {variant: 'success'})
        }
    }

    const runFlow = async () => {
        setRunLoading(true)
        const runObj: Record<string, any> = {}
        setRunResult({})

        const flow = getFlow()
        const topic = await runFlowApiHook.request({graph: flow?.graph})
        ws.current = new WebSocket(`wss://${import.meta.env.VITE_HOST}/api/ws/` + topic);
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

    const onEdgesDelete = (edges: Edge[]) => {
        const flow = getFlow();
        if (delEdge && flow) {
            const targetNode = flow.graph.nodes.find((node: Node) => node.id === delEdge.target)
            if (targetNode) {
                const inputParams = targetNode.data.input_params.find((inputParam: INodeParams) => inputParam.key === delEdge.targetHandle)
                const index = inputParams.anchors.findIndex((item: NodeAnchor) => {
                    return item.node_id === delEdge.source && item.output_key === delEdge.sourceHandle
                })
                inputParams.anchors.splice(index, 1)
            }
        }

    }

    const onEdgeClick = (e: React.MouseEvent, edge: Edge) => {
        console.log('onEdgeClick', e, edge)
        setDelEdge(edge)
    }

    // // =========|| useEffect ||======== //
    useEffect(() => {
        console.log('env:', import.meta.env.MODE, import.meta.env.VITE_HOST);
        getCompsApi.request()
    }, [])

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

    return <Box className="h-full">
        <AppBar
            color='inherit'
            elevation={1}
            sx={{
                bgcolor: theme.palette.background.default
            }}>
            <Toolbar>
                <Box sx={{flexGrow: 1}}>
                    <Typography>{detail.name}</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        variant="outlined"
                        loading={runLoading}
                        onClick={runFlow}>run</LoadingButton>
                    <LoadingButton
                        loading={editFlowApi.loading || addFlowApi.loading}
                        variant="contained" onClick={onSave}>save</LoadingButton>
                </Stack>

            </Toolbar>
        </AppBar>
        <Box sx={{pt: '70px', height: '100vh', width: '100%'}}>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onEdgesDelete={onEdgesDelete}
                    onEdgeClick={onEdgeClick}
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
                    {getCompsApi.data && <AddNode comps={getCompsApi.data}></AddNode>}
                </ReactFlow>
            </div>
        </Box>

    </Box>


};

export default OverviewFlow;
