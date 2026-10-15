
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import "./index.scss"
import {Project} from "./types/entities/baseEntity.ts";
import {invoke} from "@tauri-apps/api/core";
import {useProjectStorage} from "./storage/projectStorage.ts";
import {useEffect} from "react";

function App() {

    useEffect(() => {
        const loadProjects = async () => {
            try{
                const projects = await invoke<Project[]>("get_projects");
                console.log("Loaded projects:", projects);
                useProjectStorage.getState().setProjects(projects);
            }
            catch (e) {
                console.error("Failed to load projects:", e);
            }
        }
        loadProjects();
    }, []);


    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;