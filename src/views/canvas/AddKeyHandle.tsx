import {useState} from 'react'
import {Box, Input, Autocomplete, TextField, Stack} from "@mui/material";
import {INodeParams} from "../../custom_types";
import DoneIcon from "@mui/icons-material/Done";

interface Option {
    label: string;
    value: string;
}

export default function AddKeyHandle(
    {
        onSelect,
    }: {
        onSelect: (value: INodeParams) => void;
    }) {
    const options: Option[] = [
        {label: 'string', value: 'string'},
        {label: 'number', value: 'number'},
        {label: 'boolean', value: 'boolean'},
        {label: 'any', value: 'any'},
        {label: 'langchain/llm', value: 'langchain/llm'},
    ]
    const [inputAnchor, setInputAnchor] = useState<INodeParams>(
        {
            anchors: [],
            display_type: "",
            list: false,
            options: [],
            value: "",
            key: '',
            type: 'string',
            name: {},
            input_type: 'anchor',
        })

    const saveHandle = () => {
        if (inputAnchor.key && inputAnchor.type) {
            onSelect(inputAnchor)
            setTimeout(() => {
                setInputAnchor({
                    anchors: [],
                    display_type: "",
                    list: false,
                    options: [],
                    value: "",
                    key: '',
                    type: 'string',
                    name: {},
                    input_type: 'anchor',
                })
            })
        }
    }


    return <Box sx={{padding: 1}}>
        <Stack direction="row"
               spacing={1}
               alignItems="center">
            <Input
                size='small'
                placeholder="Key"
                value={inputAnchor.key}
                onChange={(e) => {
                    console.log(e.target.value)
                    const data: INodeParams = {
                        ...inputAnchor,
                        key: e.target.value
                    }
                    setInputAnchor(data)
                }
                }
            />

            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/* @ts-ignore*/}
            <Autocomplete
                id={inputAnchor.key}
                disableClearable={true}
                size='small'
                sx={{width: '50%'}}
                options={options}
                onChange={(e: any, selection: Option) => {
                    console.log('change:', selection, e);
                    const data = {
                        ...inputAnchor,
                        type: selection.value
                    }
                    setInputAnchor(data)
                }}
                renderInput={(params) => <TextField {...params} label="type"/>}>
            </Autocomplete>

            <DoneIcon
                onClick={saveHandle}></DoneIcon>
        </Stack>

    </Box>
}
