import {useState} from 'react'
import {INodeParams} from "@/custom_types";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Check} from 'lucide-react'
import {Button} from "@/components/ui/button.tsx";

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

    return <div className="py-1.5">
        <div className="flex items-center space-x-2">
            <Input
                className="flex-1 bg-accent border-0 px-3 py-1.5"
                placeholder="Add key"
                value={inputAnchor.key}
                onChange={(e) => {
                    const data: INodeParams = {
                        ...inputAnchor,
                        key: e.target.value
                    }
                    setInputAnchor(data)
                }}
            />
            <Select
                defaultValue={"any"}
                onValueChange={(v: string) => {
                    const data: INodeParams = {
                        ...inputAnchor,
                        type: v
                    }
                    setInputAnchor(data)
                }}>
                <SelectTrigger
                    className=" px-3 py-1.5">
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

            <Button className={"px-1"} size={"sm"} variant={"ghost"}>
                <Check
                    className="w-4 h-4 flex-none cursor-pointer"
                    onClick={saveHandle}></Check>
            </Button>
        </div>

    </div>
}
