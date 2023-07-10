import {Edge, Node} from 'reactflow'
interface NodeAnchor {
    node_id: string;
    output_key: string;
}

export  type inputTpe = 'anchor' | 'literal'

export interface INodeParams {
    id?: string;
    name: {
        [key: string]: any;
    }
    key: string;
    type: string;
    display_type: string;
    value: any;
    input_type?: inputTpe;
    anchors?: NodeAnchor[];
    dynamic?: boolean;
    options?: any[];
    optional?: boolean;
    list?: boolean;
    placeholder?: string;
}

export interface INodeData {
    id: string;
    name: {
        [propName: string]: any;
    };
    type?: string;
    description?: string;
    input_params: INodeParams[];
    input_anchors?: INodeParams[];
    inputs: {
        [propName: string]: any;
    }
    output_params?: INodeParams[];
    output_anchors?: INodeParams[];

    [propName: string]: any;
}

export interface INode {
    id: string;
    type: string;
    key: string;
    data: INodeData;

    [propName: string]: any;
}

export interface Graph {
    nodes: Node[],
    edges?: Edge[],
}
export interface FlowData {
    id: string | number;
    name: string;
    updated_at: string;
    description?: string;
    graph: Graph;
}


