import "./EntityList.css"
import {useEffect, useState} from "react";
import type {baseEntity} from "../../../types/Entities.ts";
import Card from "../../components/Card/Card.tsx";
import Searcher from "../../components/Shared/Searcher/Searcher.tsx";
import {cardsService} from "../../services/entityServices/cardsService.ts";
import EntityCreator from "./EntityCreator/EntityCreator.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {documentsService} from "../../services/entityServices/documentService.ts";
import DocumentTemplate from "../../components/Document/Document.tsx"
import FilterContainer from "./Filter/EntityCategories/FilterContainer.tsx";
import {useProject} from "../../app/ProjectContext.tsx";

const CreatorMode = {
    None: "none",
    Creating: "creating",
    Editing: "editing"
} as const;

type CreatorMode = typeof CreatorMode[keyof typeof CreatorMode];

function NotFound() {
    return null;
}

const EntityPage = () => {
    type EntityType = "cards" | "documents";
    const {type} = useParams<{ type: EntityType }>();

    const [entities, setEntities] = useState<baseEntity[]>([]);
    const [filteredEntities, setFilteredEntities] = useState<baseEntity[]>([]);

    const {project} = useProject();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);

    type Mode = {
        mode: CreatorMode,
        entity: baseEntity | undefined
    }
    const [mode, setMode] = useState<Mode>({
        mode: CreatorMode.None,
        entity: undefined
    });


    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                if (type === "cards") {
                    console.log("Getting cards locally");
                    if (!project!.id) return; // проект ещё не выбран
                    const data = await cardsService.getAllLocally(project!.id);
                    setEntities(data);
                }

                if (type === "documents") {
                    console.log("Getting documents locally");
                    if (!project!.id) return; // проект ещё не выбран
                    const data = await documentsService.getAllLocally(project!.id);
                    setEntities(data)
                }

            } catch (error) {
                console.error("Error loading entities:", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [type]);


    if (type !== "cards" && type !== "documents") {
        return <NotFound/>;
    }
    if (loading) {
        return <div>Loading...</div>;
    }


    function handleFilterChange(filtered: baseEntity[]) {
        setFilteredEntities(filtered);
    }

    const handleClose = async () => {
        setMode({mode: CreatorMode.None, entity: undefined});
        if (type === "cards") {
            const data = await cardsService.getAllLocally(project!.id!);
            setEntities(data);
        }
        if (type === "documents") {
            const data = await documentsService.getAllLocally(project!.id!);
            setEntities(data);
        }
    };

    function invokeCreator(modeType: CreatorMode, entity?: baseEntity) {
        setMode({
            mode: modeType,
            entity: entity
        })
    }

    return (
        <div className="EntityPageContainer">
            {mode.mode === CreatorMode.Creating && (
                <EntityCreator mode={type} data={mode.entity} onClick={handleClose} />
            )}
            {mode.mode === CreatorMode.Editing && (
                <EntityCreator mode={type} data={mode.entity} onClick={handleClose} />
            )}

            <div className="EntityMain">
                <header className="EntitySearcherBar">
                    <Searcher />
                </header>

                {type === "cards" && (
                    <main className="EntityContent">
                        <Card onClick={() => invokeCreator(CreatorMode.Creating, undefined)} />
                        {filteredEntities.length === 0
                            ? entities.map((card) => (
                                <Card key={card.id} data={card} onClick={() => invokeCreator("editing", card)} />
                            ))
                            : filteredEntities.map((card) => (
                                <Card key={card.id} data={card} onClick={() => invokeCreator("editing", card)} />
                            ))}
                    </main>
                )}

                {type === "documents" && (
                    <main className="EntityContent">
                        <DocumentTemplate onClick={() => invokeCreator(CreatorMode.Creating, undefined)} />
                        {filteredEntities.length === 0
                            ? entities.map((doc) => (
                                <DocumentTemplate key={doc.id} data={doc} onClick={() => navigate(`/mainPage/${doc.id}`)} />
                            ))
                            : filteredEntities.map((doc) => (
                                <DocumentTemplate key={doc.id} data={doc} onClick={() => invokeCreator(CreatorMode.Creating, doc)} />
                            ))}
                    </main>
                )}
            </div>

            <FilterContainer data={entities} onFilter={handleFilterChange} />
        </div>
    );
};

export default EntityPage;