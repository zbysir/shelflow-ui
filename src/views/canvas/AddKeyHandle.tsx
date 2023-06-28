import {useState} from 'react'
import {INodeParams} from "../../custom_types";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Check} from 'lucide-react'

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
        {label: 'boolean', value: 'bool'},
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
            dynamic: true
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
                    dynamic: true
                })
            })
        }
    }


    return <div className="p-2">
        <div className="flex items-center"
        >
            <Input
                className="w-32 mr-2"
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
            <Select
                    onValueChange={(v: string) => {
                        const data: INodeParams = {
                            ...inputAnchor,
                            type: v
                        }
                        setInputAnchor(data)
                    }}>
                <SelectTrigger>
                    <SelectValue
                        placeholder="type"
                    />
                </SelectTrigger>
                <SelectContent>
                    {
                        options.map((option, index) => (
                            <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

            <Check
                className="flex-none cursor-pointer ml-2"
                onClick={saveHandle}></Check>
        </div>

    </div>
}
