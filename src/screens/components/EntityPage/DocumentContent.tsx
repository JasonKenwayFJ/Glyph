import {EntityPageContentProp} from "../../../types/LocalProps.ts";
import DocumentTemplate from "../Shared/Document/Document.tsx";
import {CreatorMode} from "../../../types/Entities.ts";
import {useNavigate} from "react-router-dom";
import "./Styles/DocumentContent.scss"
export const DocumentContent = (props: EntityPageContentProp) => {
    const navigate = useNavigate()

    //TODO:Заставить invokeCreator принимать объект
    return (
        <main className="EntityContent">

            <DocumentTemplate  onClick={() => props.invokeCreator(CreatorMode.Creating)}/>
            {props.filteredEntities.length === 0
                ? props.entities.map((doc) => (
                    <DocumentTemplate key={doc.id} data={doc} onClick={() => navigate(`/mainPage/${doc.id}`)}/>
                ))
                : props.filteredEntities.map((doc) => (
                    <DocumentTemplate key={doc.id} data={doc}
                                      onClick={() => props.invokeCreator(CreatorMode.Creating)}/>
                ))}
        </main>
    )
}