import DocumentTemplate from "../../../../templates/Document/Document.tsx";
import {useNavigate} from "react-router-dom";
import "./Styles/DocumentContent.scss"
import {CreatorMode} from "../../../../types/enums/creatorMode.ts";
import {useEntityStorage} from "../../../../storage/entity_storage.ts";
import {useMemo} from "react";
import {EntityType} from "../../../../types/enums/entityType.ts";
import {EntityContentProps} from "../../../../types/props/EntityContentProps.ts";
import {DocumentEntity} from "../../../../types/entities/baseEntity.ts";


export const DocumentContent = ({ invokeCreator, searchText }: EntityContentProps) => {
    const navigate = useNavigate()
    const entities = useEntityStorage((state) => state.entities);
    const documents = useMemo(() => entities.filter((e) => e.entityType === EntityType.Document), [entities]);

    const filtered = searchText
        ? documents.filter((c) => c.title.toLowerCase().includes(searchText.toLowerCase()))
        : documents;

    //TODO:Заставить invokeCreator принимать объект
    return (
        <main className="EntityContent">

            <DocumentTemplate  onClick={() => invokeCreator(CreatorMode.Creating, EntityType.Document)}/>
            {filtered.length > 0 ? (
                filtered.map((doc) => (
                    <DocumentTemplate
                        key={doc.id}
                        data={doc as DocumentEntity}
                        onClick={() => navigate(`/mainPage/${doc.id}`)}
                    />
                ))
            ) : (
                <p>{searchText ? "Документы не найдены" : "Документов пока нет"}</p>
            )}
        </main>
    )
}