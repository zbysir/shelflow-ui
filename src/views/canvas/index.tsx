import {useCallback, useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
// react-flow
import ReactFlow, {addEdge, Controls, Background, useNodesState, useEdgesState, Panel} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';
//  mui
import {Button, Box, AppBar, Toolbar, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
//  hooks
import useApi from "../../hooks/useApi";
// Api
import api, {editFlow} from "../../api/index";
//  customNode
import CanvasNode from './CanvasNode';
import AddNode from "./AddNode";
// utils
import {initNode, getUniqueNodeId} from '../../utils/genericHelper'

const nodeTypes = {
    customNode: CanvasNode
};
// mockData
import {nodeData} from './node.ts'
import {elGR} from "@mui/material/locale";


const OverviewFlow = () => {
    const theme = useTheme()
    const params = useParams();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const [detail, setDetail] = useState(null);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)
    const editFlowApi = useApi(api.editFlow)

    const onInit = (reactFlowInstance: any) => console.log(
        setRfInstance(reactFlowInstance)
    );
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        let nodeData = event.dataTransfer.getData('application/reactflow')

        if (typeof nodeData === 'undefined' || !nodeData) {
            return
        }

        nodeData = JSON.parse(nodeData)

        console.log('nodeData:', nodeData);
        const position = rfInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const id = getUniqueNodeId();
        nodeData = initNode(nodeData, id)
        const newNode = {
            id: id,
            position,
            type: 'customNode',
            data: nodeData
        }

        setNodes((nds) => nds.concat(newNode));
    }, [rfInstance]);

    const onSave = () => {
        console.log('saveFlow:', rfInstance)
        if (rfInstance) {
            let flow = rfInstance.toObject();
            console.log(flow);


            flow.nodes = flow.nodes.map((node: any) => {
                return {
                    ...node,
                    type: node.data.type,
                }
            })
            // 解析边
            flow.edges.forEach((edge: any) => {
                const target = flow.nodes.find((node: any) => node.id === edge.target)
                // target.data.inputs = {}
                target.data.inputs[edge.targetHandle] = [edge.source, edge.sourceHandle].join('.')
            })
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
        if (params.id) {
            getFlowApi.request(params.id)
        }
    }, [])

    useEffect(() => {
            if (getFlowApi.data) {
                console.log('flowDetail:', getFlowApi.data)
                const data = getFlowApi.data;
                let edges: any = []
                data.graph.nodes = data.graph.nodes.map((node: any) => {
                    if (node.data.input_anchors && node.data.inputs) {
                        node.data.input_anchors.forEach(one => {
                            const key = one.key;
                            const item = node.data.inputs[key]
                            console.log('key:', key, item);
                            if(item){
                                edges.push({
                                    id: 'reactflow__edge-' + key.replace('.', '') + '-' + node.id + item.split('.')[0],
                                    source: item.split('.')[0],
                                    target: node.id,
                                    sourceHandle: item.split('.')[1],
                                    targetHandle: key
                                })
                            }
                        })

                    }
                    return {
                        ...node,
                        type: 'customNode',
                        data: {
                            ...node.data,
                            id: node.id,
                            type: node.type
                        }
                    }


                })
                data.graph.edges = edges;
                console.log('edges:', edges)
                // 解析边框

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
            >
                <Controls style={{
                    display: 'flex',
                    flexDirection: 'row',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}/>
                <Background color="#aaa" gap={16}/>
                <AddNode nodes={nodeData}></AddNode>
            </ReactFlow>
        </div>
    </Box>


};

export default OverviewFlow;
