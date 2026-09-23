import {CodeEditor} from "./components/CodeEditorPage/CodeEditor.tsx";
import {useState} from "react";
import {useSidebarStorage} from "../storage/toolbarStorage.ts";
import {runPluginCode} from "../pluginRuntime.ts";
import "./MainStyles/CodeEditorPage.scss"
import {usePageStorage} from "../storage/pageStorage.ts";
import {IconDeviceFloppy, IconDeviceIpadCode, IconNewSection} from "@tabler/icons-react";
import {invoke} from "@tauri-apps/api/core";
import {PluginDto} from "../types/DTO/PluginDto.ts";

type Tab = "js" | "html" | "css";

export const CodeEditorPage = () => {
    const JS_TEMPLATE = `Glyph.plugin.setInfo({
    name: "Plugin Name",
    version: "1.0",
    author: "Your Name",
    tags: ["ui"]
});

Glyph.ui.createButton({
    id: "my-button",
    type: "nav",
    label: "Your Page",
    icon: "settings",
    order: 100,
    path: "/plugin/my-page"
});

Glyph.ui.createPage({
    path: "/plugin/my-page",
    content: ""
});
`;
    const HTML_TEMPLATE = `<div class="NameClass">
        <iframe width="1897" height="735" src="https://www.youtube.com/embed/oPLObjVAvIU?list=RDoPLObjVAvIU" 
        title="RICKROLL 10 HOURS" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
`;

    const CSS_TEMPLATE = `body {
    font-family: sans-serif;
    background-color: #10161D;
    color: #ffffff;
    padding: 24px;
}

NameClass {
    display: flex;
    flex-direction: column;
    color: #C586C0;
}
`;

    const [jsCode, setJSCode] = useState(JS_TEMPLATE);
    const [htmlCode, setHTMLCode] = useState(HTML_TEMPLATE);
    const [cssCode, setCSSCode] = useState(CSS_TEMPLATE);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("js");
    const [scriptInfo, setScriptInfo] = useState<{
        name: string; version: string; author: string; tags: string[];
    } | null>(null);


    const addButton = useSidebarStorage((s) => s.addButton);
    const removeButtonsBySource = useSidebarStorage((s) => s.removeButtonsBySource);
    const addPage = usePageStorage((s) => s.addPage);
    const removePagesBySource = usePageStorage((s) => s.removePagesBySource);

    const handleApply = async () => {
        removeButtonsBySource('dev-script');
        removePagesBySource('dev-script');
        setScriptInfo(null);

        const result = await runPluginCode(jsCode, {
            onCreateButton: (btn) => addButton({ ...btn, source: 'dev-script' }),
            onCreatePage: (page) => {
                const pageId = page.path.replace('/plugin/', '');
                const fullContent = `${htmlCode}<style>${cssCode}</style>`;
                addPage({ id: pageId, content: page.content || fullContent, source: 'dev-script' });
            },
            onSetInfo: (info) => setScriptInfo(info),
        });

        setError(result.ok ? null : result.error!);
    };
    const [showMetaForm, setShowMetaForm] = useState(false);

    const handleSaveClick = () => {
        if (scriptInfo) {
            savePlugin(scriptInfo);
        } else {
            setShowMetaForm(true);
        }
    };

    const savePlugin = async (info: { name: string; version: string; author: string; tags: string[] }) => {
        const dto: PluginDto = {
            title: info.name,
            description: "",
            version: info.version,
            author: info.author,
            tags: [],
            glyphVersion: "1.0",
            jsCode,
            htmlCode,
            cssCode,
        };
        await invoke('export_plugin', { pluginDto: dto });
        setShowMetaForm(false);
    };

    function handleClear() {
        setJSCode(JS_TEMPLATE)
        setHTMLCode(HTML_TEMPLATE)
        setCSSCode(CSS_TEMPLATE)
        setScriptInfo(null)
    }
    return (
        <div className={"CodeEditorPageContainer"}>
            <div className={"EditorButtons"}>
                <button className={"ApplyCodeButton"} onClick={handleClear}><IconNewSection stroke={2} /></button>
                <button className={"ApplyCodeButton"} onClick={handleApply}><IconDeviceIpadCode stroke={2} /></button>
                <button className={"ApplyCodeButton"} onClick={handleSaveClick}><IconDeviceFloppy stroke={2} /></button>
            </div>

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
                <CodeEditor language="html" code={htmlCode} onChange={setHTMLCode}/>
            )}
            {activeTab === "css" && (
                <CodeEditor language="css" code={cssCode} onChange={setCSSCode}/>
            )}
            {activeTab === "js" && (
                <CodeEditor language="javascript" code={jsCode} onChange={setJSCode}/>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    )
}