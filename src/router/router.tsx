import { createHashRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import ProjectPage from "../screens/ProjectPage.tsx"
import MainPage from "../screens/MainPage.tsx";
import EntityPage from "../screens/EntityPage.tsx";
import LoginPage from "../screens/LoginPage.tsx";
import {AccountPage} from "../screens/AccountPage.tsx";


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
                path: "entityPage/:type",
                element: <EntityPage />,
            },
            {
                path: "loginPage/:mode",
                element: <LoginPage />,
            },
            {
                path: "accountPage",
                element: <AccountPage />,
            },
            {
                path: "projectPage",
                element: <ProjectPage />,
            },
        ],
    },
]);