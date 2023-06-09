import React, {useCallback, useEffect, useState, useRef, useContext} from 'react';
import {useParams} from 'react-router-dom';
// react-flow
import ReactFlow, {
    addEdge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node
} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';
//  mui
import {Button, Box, AppBar, Toolbar, Typography, Stack} from '@mui/material'
import {useTheme} from '@mui/material/styles'
//  hooks
import useApi from "../../hooks/useApi";
// Api
import api from "../../api/index";
//  customNode
import CanvasNode from './CanvasNode';
import AddNode from "./AddNode";
import OutputNode from "./OutputNode";
// utils
import {initNode, getUniqueNodeId, flowDetail, edgeToData} from '../../utils/genericHelper'
//  custom types
import {INode} from "../../custom_types";
// context
import {flowContext} from "../../store/context/ReactFlowContext";

import {runFlow as runFlowApi} from "../../api/index";

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
    const [detail, setDetail] = useState({name: ''});

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);
    const ws = useRef<WebSocket | null>(null);

    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)
    const editFlowApi = useApi(api.editFlow)
    const getCompsApi = useApi(api.getComps)


    const {reactFlowInstance, setReactFlowInstance} = useContext(flowContext);

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

        const nodeData: INode = JSON.parse(nodeStr)

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

    const onSave = () => {
        console.log('saveFlow:', reactFlowInstance)
        if (reactFlowInstance) {
            let flow = reactFlowInstance.toObject();
            console.log(flow);
            flow = edgeToData(flow);
            if (params.id) {
                const data = {
                    ...detail,
                    graph: flow
                }
                editFlowApi.request(data)

            } else {
                const data = {
                    name: 'first demo',
                    description: 'first demo',
                    graph: flow
                }

                addFlowApi.request(data)
            }
        }
    }

    const runFlow = async () => {
        const runObj: { [propName: string]: any; } = {}
        const topic = await runFlowApi({id: Number(params.id)})
        ws.current = new WebSocket('wss://writeflow.bysir.top/api/ws/' + topic);
        ws.current.onmessage = e => {
            console.log('messgae:', e.data);
            const data = JSON.parse(e.data);
            runObj[data.node_id] = data;

            console.log('runObj:', runObj);
        };
    }


    // // =========|| useEffect ||======== //
    useEffect(() => {
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
                    <Button variant="outlined" onClick={runFlow}>run</Button>
                    <Button variant="contained" onClick={onSave}>save</Button>
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
