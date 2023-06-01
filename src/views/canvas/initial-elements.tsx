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
        "id": "echo_1",
        "type": "customNode",
        "width": 100,
        "height": 50,
        "position": {
            "x": 40,
            "y": 40
        },
        "data": {
            "id": "echo_1",
            "type": "echo",
            "name": {
                "en": "Echo"
            },
            "source": {
                "type": "builtin"
            },
            "input_params": [
                {
                    id: 'xx',
                    "name": {
                        "en": "Message"
                    },
                    "key": "message",
                    "type": "string"
                }
            ],
            "inputs": {
                "message": "Hello"
            }
        }
    }
]

export const edges = [
];
