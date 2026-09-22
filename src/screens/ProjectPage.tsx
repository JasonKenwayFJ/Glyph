import { useEffect, useRef, useState } from "react";
import { Project } from "../types/Project.ts";
import { invoke } from "@tauri-apps/api/core";
import { Searcher } from "./components/Shared/Searcher.tsx";
import "./MainStyles/ProjectPageStyle.scss";
import { ProjectCreator, ProjectDto } from "./Creators/ProjectCreator.tsx";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
    const navigate = useNavigate();

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

    function setFilter(value: string) {
        setFiltered(projects.filter((x) => x.title == value));
    }

    const [projects, setProjects] = useState<Project[]>([]);
    const [filtered, setFiltered] = useState<Project[]>([]);
    const [isCreator, setCreator] = useState<boolean>(false);

    const hasLoaded = useRef(false);

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        async function load() {
            try {
                const data = await invoke<Project[]>("get_projects");
                setProjects(data ?? []);
                setFiltered(data ?? []);
            } catch (e) {
                console.error(e);
            }
        }

        load();
    }, []);

    async function openProject(project: Project) {
        await invoke("open_project", { project });
        navigate("/mainPage");
    }

    // теперь принимает готовый ProjectDto из ProjectCreator, а не title/description по отдельности
    async function submitProjectCreation(dto: ProjectDto) {
        try {
            const created = await invoke<Project>("create_project", { project: dto });
            setProjects((prev) => [...prev, created]);
            setFiltered((prev) => [...prev, created]);
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

            <Searcher placeholder={"Поиск проекта..."} value={""} setSearch={setFilter} />

            <div className="ProjectGrid">
                <div className="ProjectCardNew" onClick={() => toggleCreator(!isCreator)}>
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