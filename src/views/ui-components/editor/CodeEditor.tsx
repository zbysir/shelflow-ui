import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import { useTheme } from '@mui/material/styles'

interface Props {
    value: string;
    onValueChange: (s: string) => void;
}

export default function CodeEditor({value, onValueChange}: Props) {
    const theme:any = useTheme()
    return (
        <Editor
            value={value}
            onValueChange={onValueChange}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            textareaClassName='editor__textarea'
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                background: theme?.palette?.card?.main,
                minHeight: 'calc(100vh - 220px)',
                width: '100%',
                border: '1px solid',
                borderColor: theme?.palette?.grey['500'],
                borderRadius: '12px',
                height: '100%',
                maxHeight: 'calc(100vh - 220px)',
                overflowX: 'hidden',
                backgroundColor: 'white'
            }}
        />
    );
}