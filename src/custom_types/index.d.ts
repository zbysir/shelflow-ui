export interface INodeParams {
    name: {
        [propName: string]: any;
    }
    key: string;
    type: string;
    default?: any;
    display_type: string

}

export interface INodeData {
    id: string;
    name: {
        [propName: string]: any;
    };
    type?: string;
    description?: string;
    input_params?: INodeParams[];
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

