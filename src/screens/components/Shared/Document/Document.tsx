import "./DocumentStyle.scss";
import {Entity} from "../../../../types/Entities.ts";


type DocumentProps = {
    data?: Entity;
    linksCount?: number;
    onClick?: () => void;
};

function estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

function wordCount(content: string): number {
    return content.trim().split(/\s+/).filter(Boolean).length;
}

const DocumentTemplate = ({ data, linksCount = 0, onClick }: DocumentProps) => {
    if (!data) {
        return (
            <div className="DocumentItem DocumentItemEmpty" onClick={onClick}>
                <div className="DocumentIcon DocumentIconEmpty">
                    <span>+</span>
                </div>
                <div className="DocumentBody" onClick={onClick}>
                    <h3 className="DocumentTitle DocumentTitleMuted">Создать документ</h3>
                    <p className="DocumentExcerpt">Нажмите, чтобы начать новый диздок</p>
                </div>
            </div>
        );
    }

    return (
        <div className="DocumentItem" onClick={onClick}>
            <div className="DocumentIcon">
                <span>📄</span>
            </div>

            <div className="DocumentBody">
                <div className="DocumentHeader">
                    <h3 className="DocumentTitle">{data.title}</h3>
                    <span className="DocumentDate">
                        {new Date(data.updatedAt).toLocaleDateString()}
                    </span>
                </div>

                <p className="DocumentExcerpt">
                    {data.content || "Пока пусто — откройте, чтобы начать писать"}
                </p>

                <div className="DocumentFooter">
                    {data.category.slice(0, 2).map((cat) => (
                        <span key={cat.id} className="DocumentTag">{cat.title}</span>
                    ))}
                    {data.category.length > 2 && (
                        <span className="DocumentTagMore">+{data.category.length - 2}</span>
                    )}

                    <span className="DocumentMeta DocumentMetaRight">
                        <span className="DocumentMetaIcon">🔗</span>{linksCount}
                    </span>
                    <span className="DocumentMeta">
                        <span className="DocumentMetaIcon">📝</span>{wordCount(data.content)} слов
                    </span>
                    <span className="DocumentMeta">
                        <span className="DocumentMetaIcon">⏱</span>~{estimateReadTime(data.content)} мин
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentTemplate;