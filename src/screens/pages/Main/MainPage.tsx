import Editor from "../../../components/Shared/Editor/Editor.tsx";
import {useEffect, useState} from "react";
import "./MainPageStyle.scss"
import {EntityType} from "../../../types/enums/entityType.ts";
import EntityCreator from "../../Panels/Creators/EntityCreator.tsx";
import {BaseEntity, DocumentEntity} from "../../../types/entities/baseEntity.ts";
import {invoke} from "@tauri-apps/api/core";
import {useEntityStorage} from "../../../storage/entity_storage.ts";
import {useParams} from "react-router-dom";
const MainPage = () => {
    const {id} = useParams()

    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "s"){
                event.preventDefault()
                if (content){
                    await handleSave()
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, []);
    useEffect(() => {
        const loadEntities = async () => {
            try{
                const entities = await invoke<BaseEntity[]>('get_entities');
                console.log("Loaded entities:", entities);
                useEntityStorage.getState().setEntities(entities);
            }
            catch (e) {
                console.error("Error loading entities:", e);
            }
        }
        loadEntities()
    }, []);
    const entity = useEntityStorage((state) => state.entities.find((e) => e.id === id)) as DocumentEntity;

    const [content, setContent] = useState<string>("");
    const [showCreator, setShowCreator] = useState(false);

    useEffect(() => {
        if (entity) {
            setContent(entity.content);
        } else {
            setContent("");
        }
    }, []);
    const handleSave = async () => {
        // if (document) {
        //     document.id = id!;
        //     document.content = content;
        //     await invoke('UpdateDocument', document);
        // } else {
        //     setShowCreator(true);
        // }
    };

    // const handleCreated = (created: Entity) => {
    //     setDocument(created);
    //     setShowCreator(false);
    //     navigate(`/mainPage/${created.id}`, {replace: true}); //Хз что за реплейс, предположу, что это замена документа, но свойства replace ниде нет
    // };

    return(
        <div className={"MainPageContainer"}>
            <div className="MainPageHeader">
                <h2>{entity?.title ?? "Новый документ"}</h2>
            </div>

            <div className="Editor">
                <Editor initialContent={content} onChange={setContent}/>

                {showCreator && (
                    <EntityCreator
                        onClose={() => setShowCreator(false)}
                        entityType={EntityType.Document}
                        prefillContent={content} onSaved={function (): void {
                        throw new Error("Function not implemented.");
                    }}                    />
                )}

            </div>
        </div>
    )
}
export default MainPage