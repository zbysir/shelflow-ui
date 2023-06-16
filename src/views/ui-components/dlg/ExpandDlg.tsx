import {useState, useEffect} from 'react'
import {createPortal} from 'react-dom'
import {INodeParams} from "@/custom_types";
import CodeEditor from "../editor/CodeEditor";
import './ExpandDlg.css'
import LabelComp from "../label/Index";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {Button} from '@/components/ui/button'


interface Props {
    show: boolean,
    inputParam: INodeParams,
    onCancel: () => void,
    value: string,
    onConfirm: (s: string) => void
}

export default function ExpandDlg({show, inputParam, onCancel, value, onConfirm}: Props) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const portalElement: HTMLElement = document.getElementById('portal')
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        setInputValue(value)
        return () => {
            setInputValue('')
        }
    }, [show])

    const comp = show ? <Dialog  open={true}>
        <DialogContent className="w-full sm:max-w-screen-lg">
            <DialogTitle id="scroll-dialog-title">
                <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
            </DialogTitle>
            <CodeEditor
                inputParam={inputParam}
                value={inputValue}
                onValueChange={(code) => setInputValue(code)}
            >
            </CodeEditor>
            <DialogFooter>
                <Button variant="outline" onClick={() => onCancel()}>Cancel</Button>
                <Button onClick={() => onConfirm(inputValue)}>Sure</Button>
            </DialogFooter>
        </DialogContent>

    </Dialog> : null

    return createPortal(comp, portalElement)
}