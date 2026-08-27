import Editor from "../components/Shared/Editor/Editor.tsx";
import EntityCreator from "./Creators/EntityCreator.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Entity, EntityType} from "../types/Entities.ts";
import {invoke} from "@tauri-apps/api/core";
// import {invoke} from "@tauri-apps/api/core";

const MainPage = () => {
    const {id} = useParams()
    const navigate = useNavigate();

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

    const [document, setDocument] = useState<Entity | null>(null);
    const [content, setContent] = useState<string>("");
    const [showCreator, setShowCreator] = useState(false);

    const handleSave = async () => {
        if (document) {
            document.id = id!;
            document.content = content;
            await invoke('UpdateDocument', document);
        } else {
            setShowCreator(true);
        }
    };

    const handleCreated = (created: Entity) => {
        setDocument(created);
        setShowCreator(false);
        navigate(`/mainPage/${created.id}`, {replace: true}); //Хз что за реплейс, предположу, что это замена документа, но свойства replace ниде нет
    };

    return(
        <div className={"MainPageContainer"}>
            <div className="MainPageHeader">
                <h2>{document?.title ?? "Новый документ"}</h2>
                <button onClick={handleSave}>Сохранить</button>
            </div>

            <div className="Editor">
                <Editor initialContent={content} onChange={setContent}/>

                {showCreator && (
                    <EntityCreator
                        onClose={() => setShowCreator(false)}
                        onSaved={handleCreated}
                        entityType={EntityType.Document}
                        prefillContent={content}
                    />
                )}

            </div>
        </div>
    )
}
export default MainPage