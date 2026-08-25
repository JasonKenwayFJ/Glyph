import {Outlet} from "react-router-dom";
import Sidebar from "./../components/Shared/SideBar/SideBar.tsx";
import "./MainLayout.css"
import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {useState} from "react";
import AIChat from "../pages/Assist/AssistPage.tsx";

export default function MainLayout() {
    const [isSideBarOpen, setSideBarState] = useState<boolean>(true)
    const [isAiChatOpen, setAiChat] = useState<boolean>(false)
    let isSubsribed = true;
    function toggleSideBar(value: boolean) {
        setSideBarState(value)
    }
    function toggleAiChatPanel(value: boolean){
        setAiChat(value);
    }

    return (
        <div className={"MainLayout"}>
            <div className="sBar">
                {isSideBarOpen && <Sidebar onInvokeAssistEvent={() => toggleAiChatPanel(!isAiChatOpen)} onInvokeAssist={() => toggleSideBar(!isSideBarOpen)}/>}
            </div>
            <main style={{flex: 1, overflow: "auto"}}>
                <Outlet/>
            </main>
            {isAiChatOpen && isSubsribed && <AIChat/>}
        </div>
    );
}