import {Textarea} from "@/components/ui/textarea"
import ExpandDlg from "@/views/ui-components/dlg/ExpandDlg";
import {useState} from "react";

interface Props {
    inputParam: any;
    value: string;
    onChange: (s: string) => void;
    showDlg: boolean,
    onDialogCancel: () => void,
}

export default function TextAreaComp({
                                         inputParam,
                                         value,
                                         onChange,
                                         showDlg,
                                         onDialogCancel,
                                     }: Props) {
    const [myValue, setMyValue] = useState(value ?? '')
    return <>
        <Textarea
            className={"bg-input"}
            value={value}
            onChange={(e) => {
                setMyValue(e.target.value)
                onChange(e.target.value)
            }}
        placeholder="Type your message here." />
        <ExpandDlg
            show={showDlg}
            inputParam={inputParam}
            onCancel={onDialogCancel}
            onConfirm={(s: string) => {
                setMyValue(s)
                onChange(s)
                onDialogCancel()
            }}
            value={myValue}
        ></ExpandDlg>
    </>
}