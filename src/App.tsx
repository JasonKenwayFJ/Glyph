import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import {useEffect} from "react";
import {Project} from "./types/entities/project.ts";
import {invoke} from "@tauri-apps/api/core";
import {useProjectStorage} from "./storage/projectStorage.ts";


function App() {

    useEffect(() => {
        invoke<Project[]>("get_projects").then((projects) => {
            useProjectStorage.getState().setProjects(projects);
        })
    }, []);


    return (
        <main className="App">
            <RouterProvider router={router} />
        </main>
    );
}

export default App;