import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import type { Theme } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
const glyphDarkTheme: Theme = {
    colors: {
        editor: {
            text: "#ffffff",
            background: "#10161d",
        },
        menu: {
            text: "#ffffff",
            background: "#1a222c",
        },
        tooltip: {
            text: "#ffffff",
            background: "#15202b",
        },
        hovered: {
            text: "#ffffff",
            background: "#1a222c",
        },
        selected: {
            text: "#ffffff",
            background: "#2979ff",
        },
        border: "#2a2a2a",
        sideMenu: "#6a6a6a",
    },
    borderRadius: 8,
    fontFamily: "system-ui, sans-serif",
};
type EditorProps = {
    initialContent?: string; // JSON-строка сохранённых блоков
    onChange: (content: string) => void;
};
const Editor = ({ initialContent, onChange }: EditorProps) => {
    const editor = useCreateBlockNote({
        initialContent: initialContent
            ? parseContent(initialContent)
            : undefined,
    });
    function parseContent(raw: string | undefined) {
        if (!raw) return undefined;
        try {
            return JSON.parse(raw);
        } catch {
            // не JSON — значит это plain text, оборачиваем в один текстовый блок
            return [
                {
                    type: "paragraph",
                    content: raw,
                },
            ];
        }
    }
    return (
        <BlockNoteView
            editor={editor}
            theme={glyphDarkTheme}
            onChange={() => {
                const json = JSON.stringify(editor.document);
                onChange(json);
            }}
        />
    );
};

export default Editor;