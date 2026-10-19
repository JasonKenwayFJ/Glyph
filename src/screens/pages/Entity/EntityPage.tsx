import {useParams} from "react-router-dom";
import {DocumentContent} from "./Contents/DocumentContent.tsx";
import {Searcher} from "../../components/Shared/Searcher.tsx";
import "./EntityPageStyle.scss"
import {useState} from "react";
import {EntityType} from "../../../types/enums/entityType.ts";
import {CreatorMode} from "../../../types/enums/creatorMode.ts";
import {BaseEntity} from "../../../types/entities/baseEntity.ts";
import EntityCreator from "../../Panels/Creators/EntityCreator.tsx";
import {CardContent} from "./Contents/CardContent.tsx";


export const EntityPage = () => {
    const { entity_type } = useParams<{ entity_type: EntityType }>();
    const [isCreator, setCreator] = useState<boolean>(false);
    const [entity, setEntity] = useState<BaseEntity | undefined>(undefined);
    const [mode, setMode] = useState<CreatorMode>(CreatorMode.None);
    const [searchText, setSearchText] = useState("");

    function toggleCreator(mode: CreatorMode, entity?: BaseEntity) {
        setEntity(entity);
        setMode(mode);
        setCreator(true);
    }

    function onSave() {
        setCreator(false);
    }
    return (
        <div className={"EntityPageContainer"}>
            {isCreator && (
                <EntityCreator
                    entityType={entity_type as EntityType}
                    onSaved={onSave}
                    onClose={() => setCreator(false)}
                    mode={mode}
                    data={entity}
                />
            )}
            <div className={"SearcherContainer"}>
                <Searcher placeholder={"Что ищем?"} value={searchText} setSearch={setSearchText} />
            </div>
            <div className={"Divider"} />
            <div>
                {entity_type === EntityType.Card && (
                    <CardContent invokeCreator={toggleCreator} searchText={searchText} />
                )}
                {entity_type === EntityType.Document && (
                    <DocumentContent invokeCreator={toggleCreator} searchText={searchText} />
                )}
                {/*{entity_type === EntityType.Note && <NoteContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities.filter(e=> e.entityType === entity_type)}*/}
                {/*    filteredEntities={filteredEntities.filter(e=> e.entityType === entity_type)}/>}*/}
                {/*{entity_type === EntityType.Audio && <AudioContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities.filter(e=> e.entityType === entity_type)}*/}
                {/*    filteredEntities={filteredEntities.filter(e=> e.entityType === entity_type)}/>}*/}
                {/*{entity_type === EntityType.Video && <VideoContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities} filteredEntities={filteredEntities}/>}*/}
                {/*{entity_type === EntityType.Graph && <GraphContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities} filteredEntities={filteredEntities}/>}*/}
                {/*{entity_type === EntityType.Table && <TableContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities} filteredEntities={filteredEntities}/>}*/}
                {/*{entity_type === EntityType.Task && <TaskContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities.filter(e=> e.entityType === entity_type)}*/}
                {/*    filteredEntities={filteredEntities.filter(e=> e.entityType === entity_type)}/>}*/}
                {/*{entity_type === EntityType.Trash && <TrashContent*/}
                {/*    invokeCreator={toggleCreator}*/}
                {/*    entities={entities} filteredEntities={filteredEntities}/>}*/}

            </div>

            <div className={"EntityFilter"}>

            </div>
        </div>
    )
}
export default EntityPage
