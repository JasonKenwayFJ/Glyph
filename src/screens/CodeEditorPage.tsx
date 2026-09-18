import {CodeEditor} from "./components/CodeEditorPage/CodeEditor.tsx";
import {useState} from "react";
import {useSidebarStorage} from "../Storage/ToolbarStorage.ts";
import {runPluginCode} from "../pluginRuntime.ts";
import "./MainStyles/CodeEditorPage.scss"
export const CodeEditorPage = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const addButton = useSidebarStorage((s) => s.addButton)
    const removeBySource = useSidebarStorage((s) => s.removeButtonsBySource);

    const handleApply = async () => {
        removeBySource('dev-script');
        const result = await runPluginCode(code, (btn) =>
            addButton({ ...btn, source: 'dev-script' })
        );
        setError(result.ok ? null : result.error!);
    };




    return (
        <div className={"CodeEditorPageContainer"}>
            <button className={"ApplyCodeButton"} onClick={handleApply}>Применить</button>
            <CodeEditor code={code} onChange={setCode} />
            {error && <div className="error">{error}</div>}
        </div>
    )
}