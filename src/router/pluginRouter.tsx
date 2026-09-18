import {useParams} from 'react-router-dom'
import {usePageStorage} from "../Storage/PageStorage.ts";

export const PluginRouter = () => {
    const {pageId} = useParams<{ pageId: string }>();
    const page = usePageStorage((state) => state.pages.find((p) => p.id === pageId));

    if (!page) {
        return <div>Страница не найдена</div>
    }
    return (
        <iframe
            sandbox={"allow-scripts"}
            style={{width: '100%', height: '100%', border: 'none'}}
            srcDoc={page.content}/>
    )
}