// import {invoke} from "@tauri-apps/api/core";
import "./App.css";
import SideBar from "./components/Shared/SideBar/SideBar.tsx";
import AIChat from "./pages/Assist/AssistPage.tsx";
import {router} from "./router/router.tsx";
import { RouterProvider } from 'react-router-dom'
import {useState} from "react";

function App() {

    const [isAssistOpen, setAssist] = useState<boolean>(false)

    function toggleAssist(value: boolean) {
        setAssist(value)
    }



    return (
        <main className="App">
                <div className="AppContent">
                    <SideBar onInvokeAssistEvent={() => toggleAssist(!isAssistOpen)}/>
                    <RouterProvider router={router}/>
                    {isAssistOpen && <AIChat/>}
                </div>


        </main>
    );
}

export default App;
