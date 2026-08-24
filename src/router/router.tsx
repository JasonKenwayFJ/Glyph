import { createHashRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import MainPage from "../pages/MainPage/MainPage.tsx";
import EntityPage from "../pages/EntityPage/EntityPage.tsx";
import Login from "../pages/Login/Login.tsx";
import ProjectPage from "../pages/ProjectPage/ProjectPage.tsx";
import Account from "../pages/Account/Account.tsx";
import GraphPage from "../pages/Graphs/GraphPage.tsx";
import TaskPage from "../pages/Tasks/TaskPage.tsx";

export const router = createHashRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ProjectPage />,
            },
            {
                path: "mainpage",
                element: <MainPage />,
            },
            {
                path: "mainPage/:id?",
                element: <MainPage />,
            },
            {
                path: "entity/:type",
                element: <EntityPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "account",
                element: <Account />,
            },
            {
                path: "projectPage",
                element: <ProjectPage />,
            },
            {
                path: "graphPage",
                element: <GraphPage />,
            },
            {
                path: "taskPage",
                element: <TaskPage />,
            },
        ],
    },
]);