import Editor from "../../../components/Shared/Editor/Editor.tsx";
import {useEffect, useRef, useState} from "react";
import "./MainPageStyle.scss"
import {EntityType} from "../../../types/enums/entityType.ts";
import EntityCreator from "../../Panels/Creators/EntityCreator.tsx";
import {BaseEntity, DocumentEntity} from "../../../types/entities/baseEntity.ts";
import {invoke} from "@tauri-apps/api/core";
import {useEntityStorage} from "../../../storage/entity_storage.ts";
import {useParams} from "react-router-dom";
import {updateEntity} from "../../../apis/entityApi.ts";

const MainPage = () => {
    const {id} = useParams()

    const handleSave = async () => {
        console.log("Saving document with content:", content);
        if (document) {
            document.content = content;
            await updateEntity(document);
            console.log("Document saved:", document);
        } else {
            setShowCreator(true);
        }
    };

    const saveRef = useRef(handleSave);
    saveRef.current = handleSave;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "s") {
                event.preventDefault();
                saveRef.current();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    useEffect(() => {
        const loadEntities = async () => {
            try {
                const entities = await invoke<BaseEntity[]>('get_entities');
                console.log("Loaded entities:", entities);
                useEntityStorage.getState().setEntities(entities);
            } catch (e) {
                console.error("Error loading entities:", e);
            }
        }
        loadEntities()
    }, []);

    const document = useEntityStorage((state) => state.entities.find((e) => e.id === id)) as DocumentEntity;
    const [content, setContent] = useState<string>("");
    const [showCreator, setShowCreator] = useState(false);




    return (
        <div className={"MainPageContainer"}>
            <div className="MainPageHeader">
                <h2>{document?.title ?? "Новый документ"}</h2>
            </div>

            <div className="Editor">
                <Editor initialContent={document?.content ?? ""} onChange={setContent}/>

                {showCreator && (
                    <EntityCreator
                        onClose={() => setShowCreator(false)}
                        entityType={EntityType.Document}
                        prefillContent={document?.content ?? ""} onSaved={function (): void {
                        throw new Error("Function not implemented.");
                    }}/>
                )}

            </div>
        </div>
    )
}
export default MainPage