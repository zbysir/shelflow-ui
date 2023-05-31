import {useCallback} from 'react';
import ReactFlow, {addEdge, Controls, Background, useNodesState, useEdgesState} from 'reactflow'

import {nodes as initialNodes, edges as initialEdges} from './initial-elements';
import CanvasNode from './CanvasNode';

import 'reactflow/dist/style.css';
import './overview.css';

const nodeTypes = {
    customNode: CanvasNode
};


const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

const OverviewFlow = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params:any) => setEdges((eds) => addEdge(params, eds)), []);


    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    const edgesWithUpdatedTypes = edges.map((edge) => {
        return edge;
    });

    return <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        minZoom={0.1}
        nodeTypes={nodeTypes}
    >
        <Controls style={{
            display: 'flex',
            flexDirection: 'row',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}/>
        <Background color="#aaa" gap={16}/>
    </ReactFlow>


};

export default OverviewFlow;
