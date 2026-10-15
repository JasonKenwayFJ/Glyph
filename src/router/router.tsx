import { createHashRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import ProjectPage from "../screens/pages/Project/ProjectPage.tsx"
import MainPage from "../screens/pages/Main/MainPage.tsx";
import EntityPage from "../screens/pages/Entity/EntityPage.tsx";
import LoginPage from "../screens/pages/Login/LoginPage.tsx";
import {AccountPage} from "../screens/pages/Account/AccountPage.tsx";
import {CodeEditorPage} from "../screens/pages/CodeEditor/CodeEditorPage.tsx";
import {PluginRouter} from "./pluginRouter.tsx";


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
                path: "mainPage",
                element: <MainPage />,
            },
            {
                path: "mainPage/:id?",
                element: <MainPage />,
            },
            {
                path: "entityPage/:entity_type",
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
            {
                path: "codeEditorPage",
                element: <CodeEditorPage/>
            },
            {
                path: "plugin/:pageId",
                element: <PluginRouter/>
            }
        ],
    },
]);