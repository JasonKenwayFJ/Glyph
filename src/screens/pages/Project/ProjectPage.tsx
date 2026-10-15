import { useState } from "react";
import { Searcher } from "../../components/Shared/Searcher.tsx";
import "./ProjectPageStyle.scss";
import { useNavigate } from "react-router-dom";
import {useProjectStorage} from "../../../storage/projectStorage.ts";
import {ProjectDTO} from "../../../types/DTO/projectDTO.ts";
import {createProject, openProject} from "../../../apis/projectApi.ts";
import { Project} from "../../../types/entities/baseEntity.ts";
import {ProjectCreator} from "../../Panels/Creators/ProjectCreator.tsx";
import {getEntities} from "../../../apis/entityApi.ts";
import {useEntityStorage} from "../../../storage/entity_storage.ts";
import {EntityType} from "../../../types/enums/entityType.ts";

const ProjectPage = () => {
    const navigate = useNavigate();
    const projects = useProjectStorage((state) => state.projects);


    function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -6;
        const rotateY = ((x - rect.width / 2) / rect.width) * 6;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }

    function resetTilt(e: React.MouseEvent<HTMLDivElement>) {
        e.currentTarget.style.transform = "";
    }

    function toggleCreator(value: boolean) {
        setCreator(value);
    }




    const [isCreator, setCreator] = useState<boolean>(false);



    async function open(data: Project) {
        await openProject(data);
        useEntityStorage.getState().setEntities(await getEntities(EntityType.Project));
        navigate("/mainPage");
    }

    async function submitProjectCreation(dto: ProjectDTO) {
        try {
            let created = await createProject(dto)
            setCreator(false);
            await open(created);
        } catch (e) {
            console.error("Не удалось создать проект:", e);
        }
    }

    return (
        <div className={"ProjectPageContainer"}>
            {isCreator && (
                <ProjectCreator
                    onCreate={submitProjectCreation}
                    onClose={() => toggleCreator(!isCreator)}
                />
            )}
            <div className={"ProjectSelectHeader"}>
                <div>
                    <h1>Твои проекты</h1>
                    <p>Выбери проект, чтобы продолжить работу</p>
                </div>
            </div>

            <Searcher placeholder={"Поиск проекта..."} value={""} setSearch={()=>{}} />

            <div className="ProjectGrid">
                <div className="ProjectCardNew" onClick={() => toggleCreator(!isCreator)}>
                    <span className="ProjectCardNewPlus">+</span>
                    <p>Создать проект</p>
                </div>

                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="ProjectCard"
                        style={{ animationDelay: `${i * 60}ms` }}
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                        onClick={() => open(project)}
                    >
                        <div className="ProjectCardCover">
                            <div className="ProjectCardAurora" />
                            <span className="ProjectActiveBadge">активен</span>
                        </div>
                        <div className="ProjectCardBody">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="ProjectCardFooter">
                                <span>{project.weight} сущностей</span>
                                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ProjectPage;