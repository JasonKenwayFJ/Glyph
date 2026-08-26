import Editor from "../components/Shared/Editor/Editor.tsx";
import EntityCreator from "./Creators/EntityCreator.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Project} from "../types/Project.ts";
import {listen} from "@tauri-apps/api/event";
import {Entity, EntityType} from "../types/Entities.ts";
// import {invoke} from "@tauri-apps/api/core";

const MainPage = () => {
    const {id} = useParams()
    const [project, setProject] = useState<Project>();
    const navigate = useNavigate();
    useEffect(() => {
        const unlisten = listen<Project>('OnProjectChanged', (event) => {
            setProject(event.payload);
        });

        return () => {
            unlisten.then(fn => fn())
        }

    }, []);

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
            document.content = content;



            //Fixme Ошибка с типами при invoke
            // await invoke('UpdateDocument', document);
        } else {
            setShowCreator(true);
        }
    };

    const handleCreated = (created: Entity) => {
        //Сеттим ново-созданный документ в стейт
        setDocument(created);
        //Закрываем меню создания карточки
        setShowCreator(false);
        //Перенаправляем юзера на эту же страницу, но со входным параметром (айдишником)
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
                        onClick={() => setShowCreator(false)}
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