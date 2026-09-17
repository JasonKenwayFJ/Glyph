import {useRef} from "react";
import Editor, {OnMount} from "@monaco-editor/react";

const handleEditorMount: OnMount = (editor, monaco) => {

    monaco.editor.defineTheme("glyph", {
        base: "vs-dark",
        inherit: true,

        rules: [
            {
                token: "",
                foreground: "FFFFFF"
            },
            {
                token: "comment",
                foreground: "6A737D"
            },
            {
                token: "keyword",
                foreground: "C586C0"
            },
            {
                token: "string",
                foreground: "FFFFFF"
            }
        ],

        colors: {
            "editor.background": "#10161D",
            "editor.foreground": "#FFFFFF",
            "editorLineNumber.foreground": "#555555",
            "editorCursor.foreground": "#FFFFFF",
            "editor.selectionBackground": "#264F78"
        }
    });

    monaco.editor.setTheme("glyph");
};

interface CodeEditorProps {
    code?: string,
    onChange?: (value: (((prevState: string) => string) | string)) => void
}

export const CodeEditor = ({code, onChange}: CodeEditorProps) => {
    return (
        <Editor
            height="100%"
            language="typescript"
            theme="glyph"
            value={code}
            onChange={() => onChange}
            onMount={handleEditorMount}
        />
    );
};