import {useEffect, useState} from "react";
import {Project} from "../types/Project.ts";
import {invoke} from "@tauri-apps/api/core";
import {Searcher} from "./components/Shared/Searcher.tsx";
import "./MainStyles/ProjectPageStyle.scss"
import {ProjectCreator} from "./Creators/ProjectCreator.tsx";
import {EntityType} from "../types/Entities.ts";

const ProjectPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [isCreator, setCreator] = useState<boolean>(false);
    useEffect(() => {
        async function load() {
            const data = await invoke<Project[]>('get_projects')
            setProjects(data);
        }
        load();
    }, []);

    async function openProject(project: Project) {
        await invoke('open_project', {
            project: project
        })
        setProjects(prev => [...prev, project]);
    }
    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

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
        setCreator(value)
    }
    async function submitProjectCreation(title: string, description: string) {
        const now = new Date().toISOString();
        const project: Project = {
            id: crypto.randomUUID(),
            userId: await invoke('get_user'),
            title,
            entityType: EntityType.Project,
            description,
            imagePath: "",
            createdAt: now,
            updatedAt: now,
            weight: 0,
        };

        try{
            await invoke('create_project', {project})
        }catch (e) {
            console.error(e)
            console.error(project)
        }

        setCreator(false);
        setProjects(prev => [...prev, project]);
    }



    return (
        <div className={"ProjectPageContainer"}>
            {isCreator && <ProjectCreator onCreate={async (title, description) => await submitProjectCreation(title, description)}
                                        onClose={() => toggleCreator(!isCreator)}/>}
            <div className={"ProjectSelectHeader"}>
                <div>
                    <h1>Твои проекты</h1>
                    <p>Выбери проект, чтобы продолжить работу</p>
                </div>
            </div>

            <Searcher
                placeholder={"Поиск проекта..."}
                value={search}
                setSearch={setSearch}/>

            <div className="ProjectGrid">
                <div className="ProjectCardNew" onClick={() => toggleCreator(!isCreator)}>
                    <span className="ProjectCardNewPlus">+</span>
                    <p>Создать проект</p>
                </div>

                //FIXME filtered is null
                {filtered.map((project, i) => (
                    <div
                        key={project.id}
                        className="ProjectCard"
                        style={{animationDelay: `${i * 60}ms`}}
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                        onClick={() => openProject(project)}
                    >
                        <div className="ProjectCardCover">
                            <div className="ProjectCardAurora"/>
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
    )
}
export default ProjectPage
