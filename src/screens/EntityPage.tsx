import {useParams} from "react-router-dom";
import {CardContent} from "./components/EntityPage/CardContent.tsx";
import {DocumentContent} from "./components/EntityPage/DocumentContent.tsx";
import {Searcher} from "./components/Shared/Searcher.tsx";
import "./MainStyles/EntityPageStyle.scss"
import {useEffect, useState} from "react";
import EntityCreator from "./Creators/EntityCreator.tsx";

import {invoke} from "@tauri-apps/api/core";
import {listen} from "@tauri-apps/api/event";
import {EntityType} from "../types/enums/entityType.ts";
import {Entity} from "dexie";
import {CreatorMode} from "../types/enums/creatorMode.ts";


export const EntityPage = () => {
    const {entity_type} = useParams<{ entity_type: EntityType }>();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
    const [isCreator, setCreator] = useState<boolean>(false);

    useEffect(() => {
        const onCreating = listen<Entity>('OnEntityCreated', (event) => {
            if (event.payload.entityType !== entity_type) return;
            setEntities(prev => [...prev, event.payload]);
        });
        const onDeleting = listen<Entity>('OnEntityDeleted', (event) => {
            if (event.payload.entityType !== entity_type) return;
            setEntities(prev => prev.filter(e => e.id !== event.payload.id));
        });
        return () => {
            onCreating.then(fn => fn());
            onDeleting.then(fn => fn())
        };
    }, []);

    useEffect(() => {
        const getEntities = async () => {
            const result = await invoke<Entity[]>('get_entities', { entityType: entity_type });
            setEntities(result);
            setFilteredEntities(result);
        }
        getEntities()
    }, []);


    const [entity, setEntity] = useState<Entity | undefined>(undefined);
    const [mode, setMode] = useState<CreatorMode>(CreatorMode.None)

    function toggleCreator(mode: CreatorMode, entity?: Entity) {
        setCreator(true);
        setEntity(entity);
        setMode(mode);
    }

    function onSave() {
        setCreator(false);
    }

    return (
        <div className={"EntityPageContainer"}>
            {isCreator && <EntityCreator entityType={entity_type!} onSaved={onSave} onClose={() => setCreator(false)} mode={mode} data={entity}/>}
            <div className={"SearcherContainer"}>
                <Searcher placeholder={"Что ищем?"} value={""} setSearch={() => {
                }}/>
            </div>
            <div className={"Divider"}>

            </div>
            <div>
                {entity_type === EntityType.Card && <CardContent
                    invokeCreator={toggleCreator}
                    entities={entities.filter(e=> e.entityType === entity_type)} filteredEntities={filteredEntities.filter(e=> e.entityType === entity_type)}/>}

                {entity_type === EntityType.Document && <DocumentContent
                    invokeCreator={toggleCreator}
                    entities={entities.filter(e=> e.entityType === entity_type)}
                    filteredEntities={filteredEntities.filter(e=> e.entityType === entity_type)}/>}
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
