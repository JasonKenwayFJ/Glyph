import {useEffect, useRef, useState} from "react";
import {Project} from "../types/Project.ts";
import {invoke} from "@tauri-apps/api/core";
import {Searcher} from "./components/Shared/Searcher.tsx";
import "./MainStyles/ProjectPageStyle.scss"
import {ProjectCreator} from "./Creators/ProjectCreator.tsx";
import {EntityType, User} from "../types/Entities.ts";
import {useNavigate} from "react-router-dom";

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
        setCreator(value)
    }

    function setFilter(value: string) {
        setFiltered(projects.filter(x => x.title == value))
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
                const data = await invoke<Project[]>('get_projects');
                console.log(data)
                setProjects(data ?? []);
                setFiltered(data ?? [])
            }catch (e) {
                console.error(e)
            }
        }

        load();
    }, []);

    async function openProject(project: Project) {
        await invoke('open_project', {
            project: project
        })
        setProjects(prev => [...prev, project]);
        navigate("/mainPage")
    }


    async function submitProjectCreation(title: string, description: string) {
        const now = new Date().toISOString();
        const user: User = await invoke('get_user');
        console.log(user);
        const project: Project = {
            id: crypto.randomUUID(),
            userId: user.id,
            title,
            entityType: EntityType.Project,
            description,
            imagePath: "",
            createdAt: now.toString(),
            updatedAt: now.toString(),
            weight: 0,
            isPending: false,
        };

        let result;
        try {
            result = await invoke('create_project', {project})
        } catch (e) {
            console.error(e)
            console.error(project)
            console.log(result)
        }

        setCreator(false);
        setProjects(prev => [...prev, project]);
        setFiltered(prev => [...prev, project]);
        navigate("/mainPage");
    }


    return (
        <div className={"ProjectPageContainer"}>
            {isCreator &&
                <ProjectCreator onCreate={async (title, description) => await submitProjectCreation(title, description)}
                                onClose={() => toggleCreator(!isCreator)}/>}
            <div className={"ProjectSelectHeader"}>
                <div>
                    <h1>Твои проекты</h1>
                    <p>Выбери проект, чтобы продолжить работу</p>
                </div>
            </div>

            <Searcher
                placeholder={"Поиск проекта..."}
                value={""}
                setSearch={setFilter}
            />

            <div className="ProjectGrid">
                <div className="ProjectCardNew" onClick={() => toggleCreator(!isCreator)}>
                    <span className="ProjectCardNewPlus">+</span>
                    <p>Создать проект</p>
                </div>
                <div

                    className="ProjectCard"
                    onMouseMove={handleTilt}
                    onMouseLeave={resetTilt}
                    onClick={() => {
                    }}
                >
                    <div className="ProjectCardCover">
                        <div className="ProjectCardAurora"/>
                        <span className="ProjectActiveBadge">активен</span>
                    </div>
                    <div className="ProjectCardBody">
                        <h3>title</h3>
                        <p>description</p>
                        <div className="ProjectCardFooter">
                            <span>5 сущностей</span>
                            <span>25 july</span>
                        </div>
                    </div>
                </div>

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
