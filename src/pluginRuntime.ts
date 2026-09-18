// pluginRuntime.ts
export function runPluginCode(
    code: string,
    handlers: {
        onCreateButton: (btn: any) => void;
        onCreatePage: (page: any) => void;
        onSetInfo: (info: any) => void;
    }
) {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
        window.addEventListener('message', function handler(e) {
            if (e.source !== iframe.contentWindow) return;

            switch (e.data.type) {
                case 'create-button': handlers.onCreateButton(e.data.payload); break;
                case 'create-page': handlers.onCreatePage(e.data.payload); break;
                case 'set-info': handlers.onSetInfo(e.data.payload); break;
                case 'done':
                    window.removeEventListener('message', handler);
                    document.body.removeChild(iframe);
                    resolve(e.data.error ? { ok: false, error: e.data.error } : { ok: true });
                    break;
            }
        });

        iframe.srcdoc = `
            <script>
                window.Glyph = {
                    ui: {
                        createButton: (btn) => parent.postMessage({ type: 'create-button', payload: btn }, '*'),
                        createPage: (page) => parent.postMessage({ type: 'create-page', payload: page }, '*')
                    },
                    plugin: {
                        setInfo: (info) => parent.postMessage({ type: 'set-info', payload: info }, '*')
                    }
                };
                try {
                    ${code}
                    parent.postMessage({ type: 'done' }, '*');
                } catch (e) {
                    parent.postMessage({ type: 'done', error: e.message }, '*');
                }
            </script>
        `;
    });
}