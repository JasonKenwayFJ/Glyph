import { CodeEditor } from "./components/CodeEditorPage/CodeEditor.tsx";
import { useState } from "react";
import { useSidebarStorage } from "../Storage/ToolbarStorage.ts";
import { runPluginCode } from "../pluginRuntime.ts";
import "./MainStyles/CodeEditorPage.scss"
import { usePageStorage } from "../Storage/PageStorage.ts";

type Tab = "js" | "html" | "css";

export const CodeEditorPage = () => {
    const [jsCode, setJSCode] = useState("");
    const [htmlCode, setHTMLCode] = useState("");
    const [cssCode, setCSSCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("js");

    const addButton = useSidebarStorage((s) => s.addButton);
    const removeButtonsBySource = useSidebarStorage((s) => s.removeButtonsBySource);
    const addPage = usePageStorage((s) => s.addPage);
    const removePagesBySource = usePageStorage((s) => s.removePagesBySource);

    const handleApply = async () => {
        removeButtonsBySource('dev-script');
        removePagesBySource('dev-script');

        const result = await runPluginCode(jsCode, {
            onCreateButton: (btn) => addButton({ ...btn, source: 'dev-script' }),
            onCreatePage: (page) => {
                const pageId = page.path.replace('/plugin/', '');
                // Склеиваем HTML и CSS из отдельных вкладок в один content —
                // CodeEditor вкладки существуют только для удобства ввода,
                // Glyph.ui.createPage() продолжает получать один готовый content.
                const fullContent = `${htmlCode}<style>${cssCode}</style>`;
                addPage({ id: pageId, content: page.content || fullContent, source: 'dev-script' });
            },
            onSetInfo: (info) => { /* пока никуда не сохраняем, заглушка */ }
        });

        setError(result.ok ? null : result.error!);
    };

    return (
        <div className={"CodeEditorPageContainer"}>
            <button className={"ApplyCodeButton"} onClick={handleApply}>Применить</button>

            <div className="EditorTabs">
                <button
                    className={activeTab === "html" ? "active" : ""}
                    onClick={() => setActiveTab("html")}
                >
                    HTML
                </button>
                <button
                    className={activeTab === "css" ? "active" : ""}
                    onClick={() => setActiveTab("css")}
                >
                    CSS
                </button>
                <button
                    className={activeTab === "js" ? "active" : ""}
                    onClick={() => setActiveTab("js")}
                >
                    JS
                </button>
            </div>

            {activeTab === "html" && (
                <CodeEditor language="html" code={htmlCode} onChange={setHTMLCode} />
            )}
            {activeTab === "css" && (
                <CodeEditor language="css" code={cssCode} onChange={setCSSCode} />
            )}
            {activeTab === "js" && (
                <CodeEditor language="javascript" code={jsCode} onChange={setJSCode} />
            )}

            {error && <div className="error">{error}</div>}
        </div>
    )
}