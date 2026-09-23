import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Searcher } from "./components/Shared/Searcher.tsx";
import "./MainStyles/ProjectPageStyle.scss";
import { ProjectCreator } from "./Creators/ProjectCreator.tsx";
import { useNavigate } from "react-router-dom";
import {useProjectStorage} from "../Storage/projectStorage.ts";
import {Project} from "../types/entities/project.ts";
import {ProjectDTO} from "../types/DTO/projectDTO.ts";

const ProjectPage = () => {
    const navigate = useNavigate();
    const projects = useProjectStorage((state) => state.projects);
    const addProject = useProjectStorage((state) => state.addProject);
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



    async function openProject(project: Project) {
        await invoke("open_project", { project });
        addProject(project);
        navigate("/mainPage");
    }

    // теперь принимает готовый ProjectDTO из ProjectCreator, а не title/description по отдельности
    async function submitProjectCreation(dto: ProjectDTO) {
        try {
            const created = await invoke<Project>("create_project", { project: dto });
            addProject(created);
            setCreator(false);
            await openProject(created);
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
                        onClick={() => openProject(project)}
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