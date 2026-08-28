import {useParams} from "react-router-dom";
import {CardContent} from "./components/EntityPage/CardContent.tsx";
import {AudioContent} from "./components/EntityPage/AudioContent.tsx";
import {VideoContent} from "./components/EntityPage/VideoContent.tsx";
import {GraphContent} from "./components/EntityPage/GraphContent.tsx";
import {TaskContent} from "./components/EntityPage/TaskContent.tsx";
import {NoteContent} from "./components/EntityPage/NoteContent.tsx";
import {DocumentContent} from "./components/EntityPage/DocumentContent.tsx";
import {TableContent} from "./components/EntityPage/TableContent.tsx";
import {Searcher} from "./components/Shared/Searcher.tsx";
import "./MainStyles/EntityPageStyle.scss"
import {TrashContent} from "./components/EntityPage/TrashContent.tsx";
import {CreatorMode, Entity, EntityType} from "../types/Entities.ts";
import {useEffect, useState} from "react";
import EntityCreator from "./Creators/EntityCreator.tsx";

import {invoke} from "@tauri-apps/api/core";
import {listen} from "@tauri-apps/api/event";


export const EntityPage = () => {
    const {type} = useParams<{ type: EntityType }>();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
    const [isCreator, setCreator] = useState<boolean>(false);

    useEffect(() => {
        const onCreating = listen<Entity>('OnEntityCreated', (event) => {
            setEntities(prev => [...prev, event.payload])
        });
        const onDeleting = listen<Entity>('OnEntityDeleted', (event) => {
            setEntities(prev => prev.filter(e => e.id !== event.payload.id));
        });
        return () => {
            onCreating.then(fn => fn());
            onDeleting.then(fn => fn())
        };
    }, []);

    useEffect(() => {
        const getEntities = async () => {
            setEntities(await invoke('get_entities'))
            setFilteredEntities(entities)
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

    }


    return (
        <div className={"EntityPageContainer"}>
            {isCreator && <EntityCreator onSaved={onSave} onClose={() => setCreator(false)} mode={mode} data={entity}/>}
            <div className={"SearcherContainer"}>
                <Searcher placeholder={"Что ищем?"} value={""} setSearch={() => {
                }}/>
            </div>
            <div className={"Divider"}>

            </div>
            <div>
                {type === EntityType.Card && <CardContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Document && <DocumentContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Note && <NoteContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Audio && <AudioContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Video && <VideoContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Graph && <GraphContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Table && <TableContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Task && <TaskContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}
                {type === EntityType.Trash && <TrashContent
                    invokeCreator={toggleCreator}
                    entities={entities} filteredEntities={filteredEntities}/>}

            </div>

            <div className={"EntityFilter"}>

            </div>
        </div>
    )
}
export default EntityPage
