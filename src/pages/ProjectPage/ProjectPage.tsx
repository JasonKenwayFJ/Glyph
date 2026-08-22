import { useEffect, useState } from "react";
import { projectService } from "../../services/entityServices/projectService.ts";
import type { projectEntity } from "../../../types/Entities.ts";
import "./ProjectPage.css";
import DataReceiver from "../../components/Shared/DataReceiver/DataReceiver.tsx";
import {createProject} from "../../services/entityControllers/projectController.ts";

const ProjectPage = () => {
    const [projects, setProjects] = useState<projectEntity[]>([]);
    const [search, setSearch] = useState("");
    const [dataReceiver, setDataReceiver] = useState<boolean>(false);
    useEffect(() => {
        async function load() {
            const data = await projectService.getAllLocally();
            setProjects(data);
        }
        load();
    }, []);

    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const openProject = (project: projectEntity) => {
        window.projectController.setProject(project);
        window.electron.closeWindow();
    };

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


    function toggleDataReceiver(value: boolean) {
        setDataReceiver(value)
    }

    async function submitProjectCreation(title: string, description: string) {

        const project : projectEntity = {
            category: [], createdAt: "", entities: [], id: crypto.randomUUID(), tags: [], updatedAt: "",
            title,
            description
        }
        console.log(await createProject(project));
        setDataReceiver(false);
        setProjects(prev => [...prev, project]);
    }

    return (
        <div className="ProjectSelectPage">
            {dataReceiver && <DataReceiver onCreate={(title, description) => submitProjectCreation(title, description)} onClose={() => toggleDataReceiver(!dataReceiver)}/>}
            <div className="ProjectSelectHeader">
                <div>
                    <h1>Твои проекты</h1>
                    <p>Выбери проект, чтобы продолжить работу</p>
                </div>
                <button className="ProjectCreateButton">
                    <span>+</span> Новый проект
                </button>
            </div>

            <input
                className="ProjectSearch"
                placeholder="Поиск проекта..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="ProjectGrid">
                <div className="ProjectCardNew" onClick={() => setDataReceiver(!dataReceiver)}>
                    <span className="ProjectCardNewPlus">+</span>
                    <p>Создать проект</p>
                </div>

                {filtered.map((project, i) => (
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
                                <span>{project.entities.length} сущностей</span>
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