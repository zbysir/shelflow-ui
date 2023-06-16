import {useState} from 'react'
import {Input} from "@/components/ui/input"
import {INodeParams} from "@/custom_types";

interface Props {
    inputParam: INodeParams
    value: string;
    onChange: (s: string) => void;
    displayType: string
}

const InputComp = ({
                       inputParam,
                       value,
                       onChange,
                       displayType
                   }:
                       Props) => {
    const [myValue, setMyValue] = useState(value ?? '')
    return <>
        <Input value={myValue}
               placeholder={inputParam?.placeholder}
               type={displayType}
               onChange={(e) => {
                   setMyValue(e.target.value)
                   onChange(e.target.value)
               }}></Input>
    </>
}

export default InputComp