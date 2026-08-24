import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Editor from "../../components/Shared/Editor/Editor.tsx";
import EntityCreator from "../EntityPage/EntityCreator/EntityCreator.tsx";
import "./MainPage.css";
import {documentsService} from "../../services/entityServices/documentService.ts";

import {listen} from '@tauri-apps/api/event'
import {Project} from "../../types/Project.ts";
import {Entity} from "../../types/Entities.ts";



const MainPage = () => {
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        const unlisten = listen<Project>('OnProjectChanged', (event) => {
            setProject(event.payload);
        });

        return () => {
            unlisten.then(fn => fn())
        }

    }, []);






    //Если mainPage был инвоукнут с параметром, то есть произошло открытие mainPage при нажатии на документ во вкладке Documents, пихаем айдишник в переменную
    const {id} = useParams();
    //Хватаем систему навигации (видимо, чтобы перенаправлять на другие страницы/вкладки)
    const navigate = useNavigate();


    //Создаём различные состояния под работу окна при любом сценарии работы
    const [document, setDocument] = useState<Entity | null>(null);
    const [content, setContent] = useState<string>("");
    const [showCreator, setShowCreator] = useState(false);
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        async function load() {
            //Если страница была ивоукнута без параметра, то есть при первом запуске приложения, то забиваем хуй на последующую обработку, она нам не нужна
            if (!id) {
                setLoading(false);
                return;
            }
            //Если параметр всё-таки прибыл, достаём документы из базы данных
            const all = await documentsService.getAllLocally();
            //Находим документ айдишник которого прибыл в mainPage (если он был воукнут с параметром)
            const found = all.find((d) => d.id === id) ?? null;
            //Пихаем его в стейт
            setDocument(found);
            //Пихаем отдельно содержимое документа в отдельный стейт
            setContent(found?.content ?? "");
            //Перестаём показывать меню загрузки
            setLoading(false);

            console.log("🔥 SELECTED PROJECT: " + project);
        }
        //Начинаем процесс обработки обоих сценариев
        load();
    }, [id]);

    //Функция апдейта документа, если таковой имеется
    const handleSave = async () => {
        if (document) {
            // документ уже существует — просто обновляем контент
            await documentsService.updateLocally({...document, content});
        } else {
            // документа ещё нет — просим заполнить метаданные
            setShowCreator(true);
        }
    };

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
    //Функция создания, если документа нет
    const handleCreated = (created: Entity) => {
        //Сеттим ново-созданный документ в стейт
        setDocument(created);
        //Закрываем меню создания карточки
        setShowCreator(false);
        //Перенаправляем юзера на эту же страницу, но со входным параметром (айдишником)
        navigate(`/mainPage/${created.id}`, {replace: true}); //Хз что за реплейс, предположу, что это замена документа, но свойства replace ниде нет
    };

    //Простая менюшка загрузки, просто текст
    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="MainPageContainer">
            <div className="MainPageHeader">
                //Если документ прибыл, то вставляем его название, если нет - То пишем новый документ
                //Нахуя это нужно непонятно, выглядит это уёбищно, надо бы переделать
                <h2>{document?.title ?? "Новый документ"}</h2>
                <button onClick={handleSave}>Сохранить</button>
            </div>
            //Сам эдитор
            <div className="Editor">
                <Editor initialContent={content} onChange={setContent}/>

                {showCreator && (
                    <EntityCreator
                        onClick={() => setShowCreator(false)}
                        onSaved={handleCreated}
                        mode="documents"
                        prefillContent={content} // ключевой момент — контент из редактора идёт в форму
                    />
                )}

            </div>

        </div>
    );
};

export default MainPage;