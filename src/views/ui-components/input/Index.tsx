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
}

export const Input = ({
                          inputParam,
                          value,
                          disabled = false,
                          onChange,
                          showDlg,
                          onDialogCancel,
                      }:
                          Props) => {
    const [myValue, setMyValue] = useState(value ?? '')
    // textarea| code | input
    const getInputType = (type: string) => {
        type = type.split('/')[0]
        switch (type) {
            case 'string':
            case 'input':
                return {
                    type: 'text',
                    multiline: false,
                    rows: 1
                }
            case 'password':
                return {
                    type: 'password',
                    multiline: false,
                    rows: 1
                }
            case 'number':
                return {
                    type: 'number',
                    multiline: false,
                    rows: 1
                }
            case 'textarea':
            case 'code':
                return {
                    type: 'text',
                    multiline: true,
                    rows: 2
                }
            default:
                return {
                    type: 'text',
                    multiline: false,
                    rows: 1
                }
        }
    }

    const data = getInputType(inputParam.display_type)

    return <>
        <FormControl sx={{mt: 1, width: '100%'}} size='small'>
            <OutlinedInput
                id={inputParam.id}
                size='small'
                disabled={disabled}
                value={myValue}
                placeholder={inputParam.placeholder}
                type={data.type}
                multiline={data.multiline}
                name={inputParam.label}
                rows={data.rows}
                onChange={(e) => {
                    setMyValue(e.target.value)
                    onChange(e.target.value)
                }}
            ></OutlinedInput>
            {data.multiline && <ExpandDlg
                show={showDlg}
                inputParam={inputParam}
                onCancel={onDialogCancel}
                onConfirm={(s: string) => {
                    setMyValue(s)
                    onChange(s)
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