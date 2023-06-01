import {useCallback, useEffect, useState, useRef} from 'react';
// react-flow
import ReactFlow, {addEdge, Controls, Background, useNodesState, useEdgesState, Panel} from 'reactflow'

import 'reactflow/dist/style.css';
import './overview.css';
//  mui
import {Button} from '@mui/material'
//  hooks
import useApi from "../../hooks/useApi";
// Api
import api from "../../api/index";
//  customNode
import CanvasNode from './CanvasNode';
import AddNode from "./AddNode";

const nodeTypes = {
    customNode: CanvasNode
};
// mockData
import {nodeData} from './node.ts'

let id = 0;
const getId = () => `dndnode_${id++}`;
const OverviewFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


    // ===========|| flowApi ||=========== //
    const getFlowApi = useApi(api.getFlow)
    const addFlowApi = useApi(api.addFlow)

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
        const id = getId();
        nodeData.id = id;
        nodeData.inputs = {}
        nodeData.input_params.forEach((item) => {
            item.id = getId();
        })
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
            const flow = rfInstance.toObject();
            console.log(flow);

            const data = {
                name: 'first demo',
                description: 'first demo',
                graph: flow
            }

            addFlowApi.request(data)
        }
    }

    // // =========|| useEffect ||======== //
    useEffect(() => {
        getFlowApi.request(1)
    }, [])

    useEffect(() => {
            if (getFlowApi.data) {
                console.log(getFlowApi.data)
            }
        },
        [getFlowApi.data, getFlowApi.error])

    return <div className="reactflow-wrapper" ref={reactFlowWrapper}>
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
            <Panel position="top-right">
                <Button variant="contained" onClick={onSave}>save</Button>
            </Panel>
            <AddNode nodes={nodeData}></AddNode>
        </ReactFlow>
    </div>


};

export default OverviewFlow;
