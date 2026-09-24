import {useParams} from "react-router-dom";
import {CardContent} from "./components/EntityPage/CardContent.tsx";
import {DocumentContent} from "./components/EntityPage/DocumentContent.tsx";
import {Searcher} from "./components/Shared/Searcher.tsx";
import "./MainStyles/EntityPageStyle.scss"
import {useState} from "react";
import EntityCreator from "./Creators/EntityCreator.tsx";
import {EntityType} from "../types/enums/entityType.ts";
import {CreatorMode} from "../types/enums/creatorMode.ts";
import {BaseEntity} from "../types/entities/baseEntity.ts";


export const EntityPage = () => {
    const { entity_type } = useParams<{ entity_type: EntityType }>();
    const [isCreator, setCreator] = useState<boolean>(false);
    const [entity, setEntity] = useState<BaseEntity | undefined>(undefined);
    const [mode, setMode] = useState<CreatorMode>(CreatorMode.None);
    const [searchText, setSearchText] = useState("");

    function toggleCreator(mode: CreatorMode, entity?: BaseEntity) {
        setCreator(true);
        setEntity(entity);
        setMode(mode);
    }

    function onSave() {
        setCreator(false);
    }
    return (
        <div className={"EntityPageContainer"}>
            {isCreator && (
                <EntityCreator
                    entityType={entity_type!}
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
