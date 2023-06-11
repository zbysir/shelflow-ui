import {useState, useEffect} from 'react'
import {createPortal} from 'react-dom'
import {Dialog, DialogContent, DialogTitle, DialogActions, Button} from '@mui/material'
import {INodeParams} from "../../../custom_types";
import CodeEditor from "../editor/CodeEditor";
import './ExpandDlg.css'
import LabelComp from "../label/Index";

interface Props {
    show: boolean,
    inputParam: INodeParams,
    onCancel: () => void,
    value: string,
    onConfirm: (s: string) => void
}

export default function ExpandDlg({show, inputParam, onCancel, value, onConfirm}: Props) {
    const portalElement: HTMLElement = document.getElementById('portal')
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        setInputValue(value)
        return () => {
            setInputValue('')
        }
    }, [show])

    const comp = show ? <Dialog open={true} fullWidth={true} maxWidth='md'>
        <DialogTitle id="scroll-dialog-title">
            <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
        </DialogTitle>
        <DialogContent>
            <CodeEditor
                inputParam={inputParam}
                value={inputValue}
                onValueChange={(code) => setInputValue(code)}
            >
            </CodeEditor>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant='contained' onClick={() => onConfirm(inputValue)}>Sure</Button>
        </DialogActions>
    </Dialog> : null

    return createPortal(comp, portalElement)
}