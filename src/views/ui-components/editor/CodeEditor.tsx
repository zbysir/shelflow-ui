import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another


interface Props {
    value: string;
    onValueChange: (s: string) => void;
}

export default function CodeEditor({value, onValueChange}: Props) {
    return (
        <Editor
            className="border border-solid border-color rounded-md font-12 bg-background"
            value={value}
            onValueChange={onValueChange}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            textareaClassName='editor__textarea'
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                height: 'calc(100vh - 220px)',
                width: '100%',
                overflowX: 'hidden',
                overflowY: 'auto'
            }}
        />
    );
}