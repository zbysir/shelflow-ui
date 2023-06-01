import {FormControl, OutlinedInput} from '@mui/material'
import PropTypes from 'prop-types'
import {useState} from 'react'


interface Props {
    inputParam: any;
    disabled: boolean;
    value: string;
    onChange: (s: string) => void;
}

export const Input = ({
                          inputParam,
                          value,
                          disabled = false,
                          onChange
                      }:
                          Props) => {
    const [myValue, setMyValue] = useState(value ?? '')
    const getInputType = (type: string) => {
        switch (type) {
            case 'string':
                return 'text'
            case 'password':
                return 'password'
            case 'number':
                return 'number'
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
                name={inputParam.label}
                type={getInputType(inputParam.type)}
                onChange={(e) => {
                    setMyValue(e.target.value)
                    onChange(e.target.value)
                }}
            ></OutlinedInput>
        </FormControl>
    </>
}

Input.prototype = {
    inputParam: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
}