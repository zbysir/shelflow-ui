import {MarkerType, Position} from 'reactflow';

// interface Anchor {
//     id: string;
//     label: string;
//     name: string;
//     type: string;
//     list?: boolean
// }


export const nodes = [
    {
        id: '0',
        type: 'customCard',
        data: {
            label: 'Custom Node',
            id: '1',
            name: 'CustomNode',
            category: 'Agents',
            description: '',
            inputs: {
                input1: '',
                input2: ''
            },
            inputAnchors: [
                {
                    id: 'lmr',
                    label: 'Input 1',
                    name: 'input1',
                    type: 'Tool',
                    list: false
                }
            ],
            inputParams: [
                {
                    id: 'lmr2',
                    label: 'Input 2',
                    name: 'input2',
                    type: 'string',
                    list: false
                }
            ],
            outputAnchors: [
                {
                    id: 'lmr3',
                    label: 'Output 1',
                    name: 'output1',
                    type: 'Tool',
                    list: false
                }
            ]
        },
        position: {x: 0, y: 0},
    },
    {
        id: 'ac',
        type: 'customCard',
        data: {
            label: 'Custom Node1',
            id: '1',
            name: 'CustomNode1',
            category: 'Agents',
            description: '',
            inputs: {
                input1: '',
                input2: ''
            },
            inputAnchors: [
                {
                    id: 'input-b',
                    label: 'Input b',
                    name: 'input1',
                    type: 'Tool',
                    list: false
                }
            ],
            inputParams: [
                {
                    id: 'input-c',
                    label: 'Input c',
                    name: 'input2',
                    type: 'string',
                    list: false
                }
            ],
            outputAnchors: [
                {
                    id: 'output-d',
                    label: 'Output 1',
                    name: 'output1',
                    type: 'Tool',
                    list: false
                }
            ]
        },
        position: {x: 300, y: 0},
    },
];

export const edges = [
];
