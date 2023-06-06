import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
// react-flow
import ReactFlow, {
    addEdge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowInstance,
    Edge,
    Node
} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';
//  mui
import {Button, Box, AppBar, Toolbar, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
//  hooks
import useApi from "../../hooks/useApi";
// Api
import api from "../../api/index";
//  customNode
import CanvasNode from './CanvasNode';
import AddNode from "./AddNode";
// utils
import {initNode, getUniqueNodeId, flowDetail, edgeToData} from '../../utils/genericHelper'
//  custom types
import {INode} from "../../custom_types";

const nodeTypes = {
    customNode: CanvasNode
};


const OverviewFlow = () => {
    const theme = useTheme()
    const params = useParams();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance>()
    const [detail, setDetail] = useState({});

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)
    const editFlowApi = useApi(api.editFlow)
    const getCompsApi = useApi(api.getComps)

    const onInit = (reactFlowInstance: ReactFlowInstance) => console.log(
        setRfInstance(reactFlowInstance)
    );
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
        if (!rfInstance) {
            return
        }
        const position = rfInstance.project({
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setNodes((nds) => nds.concat(newNode));
    }, [rfInstance]);

    const onSave = () => {
        console.log('saveFlow:', rfInstance)
        if (rfInstance) {
            let flow = rfInstance.toObject();
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
                    <Typography>名称</Typography>
                </Box>
                <Button variant="contained" onClick={onSave}>save</Button>
            </Toolbar>
        </AppBar>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
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


};

export default OverviewFlow;
