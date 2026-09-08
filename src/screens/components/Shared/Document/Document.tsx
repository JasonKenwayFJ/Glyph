import "./DocumentStyle.scss";
import { Entity } from "../../../../types/Entities.ts";

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
                <div className="DocumentIconWrapper DocumentIconWrapperEmpty">
                    <i className="ti ti-plus" aria-hidden="true" />
                </div>
                <div className="DocumentBody" onClick={onClick}>
                    <h3 className="DocumentTitle DocumentTitleMuted">Создать документ</h3>
                    <p className="DocumentExcerpt">Начните новый диздок</p>
                </div>
            </div>
        );
    }

    return (
        <div className="DocumentItem" onClick={onClick}>
            <div className="DocumentHeader">
                <div className="DocumentIconWrapper">
                    <i className="ti ti-file-text" aria-hidden="true" />
                </div>
                <span className="DocumentDate">
                    {new Date(data.updatedAt).toLocaleDateString()}
                </span>
            </div>

            <div className="DocumentBody">
                <h3 className="DocumentTitle">{data.title}</h3>

                <p className="DocumentExcerpt">
                    {data.content || "Пока пусто — откройте, чтобы начать писать"}
                </p>

                <div className="DocumentTags">
                    {data.categories.slice(0, 2).map((cat) => (
                        <span key={cat.id} className="DocumentTag">{cat.title}</span>
                    ))}
                    {data.categories.length > 2 && (
                        <span className="DocumentTagMore">+{data.categories.length - 2}</span>
                    )}
                </div>

                <div className="DocumentStats">
                    <span className="DocumentStat">
                        <i className="ti ti-link" aria-hidden="true" />
                        {linksCount}
                    </span>
                    <span className="DocumentStat">
                        <i className="ti ti-notes" aria-hidden="true" />
                        {wordCount(data.content)} слов
                    </span>
                    <span className="DocumentStat">
                        <i className="ti ti-clock" aria-hidden="true" />
                        ~{estimateReadTime(data.content)} мин
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentTemplate;