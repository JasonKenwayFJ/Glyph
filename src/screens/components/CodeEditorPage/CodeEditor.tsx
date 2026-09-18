
import Editor, { OnMount } from "@monaco-editor/react";
import {glyphApiDeclarationSource} from "../../../Storage/glyphApi.ts";




const handleEditorMount: OnMount = (editor, monaco) => {
    console.log(glyphApiDeclarationSource);

    monaco.editor.defineTheme("glyph", {
        base: "vs-dark",
        inherit: true,

        rules: [
            { token: "", foreground: "FFFFFF" },
            { token: "comment", foreground: "6A737D" },
            { token: "keyword", foreground: "C586C0" },
            { token: "string", foreground: "FFFFFF" }
        ],


        colors: {
            "editor.background": "#10161D",
            "editor.foreground": "#FFFFFF",
            "editorLineNumber.foreground": "#555555",
            "editorCursor.foreground": "#FFFFFF",
            "editor.selectionBackground": "#264F78"
        }
    });


    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        glyphApiDeclarationSource,
        'glyph-api.d.ts'
    );

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        checkJs: true,
        noEmit: true,
    });


    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
    });

    monaco.editor.setTheme("glyph");
};


interface CodeEditorProps {
    code?: string;
    language: string;
    onChange?: (value: string) => void;
}


export const CodeEditor = ({language, code, onChange }: CodeEditorProps) => {
    return (
            <Editor
                height="50%"

                language={language}
                theme="glyph"
                value={code}
                onChange={(v) => onChange?.(v ?? '')}
                onMount={handleEditorMount}
            />

    );
};