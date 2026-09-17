import {CodeEditor} from "./components/CodeEditorPage/CodeEditor.tsx";
import {useState} from "react";

export const CodeEditorPage = () => {
    const [code, setCode] = useState("");
    return (
        <CodeEditor
            code={code}
            onChange={setCode}
        />
    )
}