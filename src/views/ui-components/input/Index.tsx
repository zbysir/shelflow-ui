import {FormControl, OutlinedInput} from '@mui/material'
import PropTypes from 'prop-types'
import {useState} from 'react'
import ExpandDlg from '../dlg/ExpandDlg'
interface Props {
    inputParam: any;
    disabled: boolean;
    value: string;
    onChange: (s: string) => void;
    showDlg: boolean,
    onDialogCancel: () => void,
    dialogProps: any
}

export const Input = ({
                          inputParam,
                          value,
                          disabled = false,
                          onChange,
                          showDlg,
                          onDialogCancel,
                          dialogProps
                      }:
                          Props) => {
    const [myValue, setMyValue] = useState(value ?? '')
    let multiline = false
    let rows = 1
    // textarea| code | input
    const getInputType = (type: string) => {
        switch (type) {
            case 'string':
                return 'text'
            case 'input':
                multiline = false;
                rows = 1;
                return 'text'
            case 'number':
                return 'number'
            case 'textarea':
            case 'code':
                multiline = true;
                rows = 2
                return 'text'
            default:
                return 'text'
        }
    }
    return <>
        <FormControl sx={{mt: 1, width: '100%'}} size='small'>
            <OutlinedInput
                id={inputParam.id}
                size='small'
                disabled={disabled}
                value={myValue}
                placeholder={inputParam.placeholder}
                multiline={multiline}
                name={inputParam.label}
                rows={rows}
                type={getInputType(inputParam.display_type)}
                onChange={(e) => {
                    setMyValue(e.target.value)
                    onChange(e.target.value)
                }}
            ></OutlinedInput>
            {multiline && <ExpandDlg
                show={showDlg}
                inputParam={inputParam}
                onCancel={onDialogCancel}
                onConfirm={(s: string) => {
                    setMyValue(s)
                    onDialogCancel()
                }}
                value={myValue}
            ></ExpandDlg>}
        </FormControl>
    </>
}

Input.prototype = {
    inputParam: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
}